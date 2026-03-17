import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { gsap } from 'gsap';
import {
  AlarmClock,
  ArrowDownUp,
  BadgeCheck,
  Bus,
  Car,
  ChevronDown,
  ChevronUp,
  ClipboardList,
  Download,
  Flag,
  Home,
  ParkingCircle,
  RotateCcw,
  Save,
  Trash2,
  Upload,
  Zap,
} from 'lucide-react';

type Mode = 'forward' | 'reverse';

type SegmentMap = Record<string, string>; // ISO timestamps

type Run = {
  id: string;
  mode: Mode;
  date: string;
  segments: SegmentMap;
  totalMs: number;
};

type Step = {
  id: string;
  label: string;
  segment?: string;
  icon: React.ReactNode;
};

const STORAGE_KEY = 'commute-speedrun-history-v1';

const forwardSteps: Step[] = [
  { id: 'car', label: 'Got in Car', icon: <Car size={18} />, segment: 'Driving' },
  { id: 'parking', label: 'Arrived at Parking', icon: <ParkingCircle size={18} />, segment: 'Walk to Stop' },
  { id: 'busStop', label: 'At Bus Stop', icon: <AlarmClock size={18} />, segment: 'Wait for Bus' },
  { id: 'busArrival', label: 'Bus Arrived', icon: <Bus size={18} />, segment: 'Bus Transit' },
  { id: 'busDest', label: 'Bus Destination', icon: <Flag size={18} />, segment: 'Walk to Office' },
  { id: 'checkpoint', label: 'Checkpoint', icon: <BadgeCheck size={18} /> },
];

const reverseSteps: Step[] = [
  { id: 'checkpoint', label: 'Leave Checkpoint', icon: <BadgeCheck size={18} />, segment: 'Walk to Stop' },
  { id: 'busDest', label: 'At Bus Stop', icon: <AlarmClock size={18} />, segment: 'Wait for Bus' },
  { id: 'busArrival', label: 'Bus Arrived', icon: <Bus size={18} />, segment: 'Bus Transit' },
  { id: 'busStop', label: 'Arrived at Parking', icon: <Flag size={18} />, segment: 'Walk to Car' },
  { id: 'parking', label: 'At Car', icon: <ParkingCircle size={18} />, segment: 'Driving Home' },
  { id: 'car', label: 'Got Home', icon: <Home size={18} /> },
];

const modeMeta = {
  forward: {
    label: 'To Work',
    accent: 'from-[#ff5b2e] to-[#ff8e6c]',
    chip: 'bg-[#ff5b2e]/10 text-[#b83a16] border-[#ff5b2e]/20',
  },
  reverse: {
    label: 'To Home',
    accent: 'from-[#2a6ef5] to-[#7aa6ff]',
    chip: 'bg-[#2a6ef5]/10 text-[#1f4fb0] border-[#2a6ef5]/20',
  },
} satisfies Record<Mode, { label: string; accent: string; chip: string }>;

const colorMap: Record<string, string> = {
  Driving: 'border-orange-200 bg-orange-50/70 text-orange-700',
  'Driving Home': 'border-orange-200 bg-orange-50/70 text-orange-700',
  'Walk to Stop': 'border-emerald-200 bg-emerald-50/70 text-emerald-700',
  'Wait for Bus': 'border-sky-200 bg-sky-50/70 text-sky-700',
  'Bus Transit': 'border-violet-200 bg-violet-50/70 text-violet-700',
  'Walk to Office': 'border-rose-200 bg-rose-50/70 text-rose-700',
  'Walk to Car': 'border-rose-200 bg-rose-50/70 text-rose-700',
  'Total Trip': 'border-slate-300 bg-slate-900 text-white',
};

const parseTime = (value?: string | null) => (value ? new Date(value) : null);

const durationMs = (start?: string | null, end?: string | null) => {
  if (!start || !end) return null;
  const s = parseTime(start);
  const e = parseTime(end);
  if (!s || !e) return null;
  return Math.max(0, e.getTime() - s.getTime());
};

const formatDuration = (ms?: number | null) => {
  if (!ms && ms !== 0) return '--:--';
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}m ${seconds.toString().padStart(2, '0')}s`;
};

const formatClock = (iso?: string | null) => {
  if (!iso) return '--:--';
  const date = parseTime(iso);
  if (!date) return '--:--';
  return new Intl.DateTimeFormat('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  }).format(date);
};

const exportFile = (data: Run[]) => {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `commute_speedrun_${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

const App = () => {
  const [mode, setMode] = useState<Mode>('forward');
  const [segments, setSegments] = useState<SegmentMap>({});
  const [history, setHistory] = useState<Run[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [expandedStats, setExpandedStats] = useState(true);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const headerRef = useRef<HTMLDivElement | null>(null);

  useLayoutEffect(() => {
    if (!headerRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.hero-sheen',
        { xPercent: -40, opacity: 0 },
        { xPercent: 40, opacity: 1, duration: 1.4, ease: 'power2.out' }
      );
    }, headerRef);
    return () => ctx.revert();
  }, []);

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    try {
      const parsed = JSON.parse(raw) as Run[];
      setHistory(parsed);
    } catch {
      setHistory([]);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
  }, [history]);

  const steps = mode === 'forward' ? forwardSteps : reverseSteps;
  const nextStepIndex = steps.findIndex((step) => !segments[step.id]);
  const isFinished = nextStepIndex === -1 && Object.keys(segments).length > 0;

  const logStep = (stepId: string) => {
    setSegments((prev) => ({ ...prev, [stepId]: new Date().toISOString() }));
  };

  const undoStep = () => {
    const completed = steps.filter((step) => segments[step.id]);
    if (completed.length === 0) return;
    const last = completed[completed.length - 1];
    setSegments((prev) => {
      const copy = { ...prev };
      delete copy[last.id];
      return copy;
    });
  };

  const reset = () => {
    if (Object.keys(segments).length > 0) {
      const ok = window.confirm('Discard current run?');
      if (!ok) return;
    }
    setSegments({});
  };

  const totalTimeMs = useMemo(() => {
    const first = segments[steps[0].id];
    const last = segments[steps[steps.length - 1].id] ?? new Date().toISOString();
    if (!first) return null;
    if (isFinished) {
      return durationMs(first, segments[steps[steps.length - 1].id]);
    }
    return durationMs(first, last);
  }, [segments, steps, isFinished]);

  const bestTotal = useMemo(() => {
    const candidates = history.filter((run) => run.mode === mode).map((run) => run.totalMs);
    if (candidates.length === 0) return null;
    return Math.min(...candidates);
  }, [history, mode]);

  const deltaFromPB = useMemo(() => {
    if (bestTotal === null || totalTimeMs === null) return null;
    return totalTimeMs - bestTotal;
  }, [bestTotal, totalTimeMs]);

  const bestSegments = useMemo(() => {
    const map: Record<string, number> = {};
    history
      .filter((run) => run.mode === mode)
      .forEach((run) => {
        for (let i = 0; i < steps.length - 1; i += 1) {
          const label = steps[i].segment;
          if (!label) continue;
          const dur = durationMs(run.segments[steps[i].id], run.segments[steps[i + 1].id]);
          if (dur === null) continue;
          map[label] = map[label] ? Math.min(map[label], dur) : dur;
        }
      });
    return map;
  }, [history, mode, steps]);

  const liveSegments = useMemo(() => {
    return steps.slice(0, -1).map((step, idx) => {
      const start = segments[step.id];
      const end = segments[steps[idx + 1].id];
      const isRunning = !!start && !end;
      const value = isRunning ? durationMs(start, new Date().toISOString()) : durationMs(start, end);
      return {
        label: step.segment ?? step.label,
        value,
        isRunning,
      };
    });
  }, [segments, steps]);

  const saveRun = () => {
    if (!isFinished) return;
    const first = segments[steps[0].id];
    const last = segments[steps[steps.length - 1].id];
    if (!first || !last) return;
    const total = durationMs(first, last) ?? 0;
    const next: Run = {
      id: crypto.randomUUID(),
      mode,
      date: new Date().toISOString(),
      segments,
      totalMs: total,
    };
    setHistory((prev) => [next, ...prev]);
    setSegments({});
  };

  const deleteRun = (id: string) => {
    const ok = window.confirm('Delete this run?');
    if (!ok) return;
    setHistory((prev) => prev.filter((run) => run.id !== id));
  };

  const importHistory = async (file: File) => {
    const text = await file.text();
    const parsed = JSON.parse(text) as Run[];
    if (!Array.isArray(parsed)) throw new Error('Invalid data');
    const cleaned = parsed.map((run) => ({
      ...run,
      id: run.id ?? crypto.randomUUID(),
      totalMs: run.totalMs ?? 0,
    }));
    setHistory((prev) => [...cleaned, ...prev]);
  };

  const detailedStats = useMemo(() => {
    const runs = history.filter((run) => run.mode === mode);
    if (runs.length === 0) return [];
    const buckets: Record<string, number[]> = {};

    runs.forEach((run) => {
      for (let i = 0; i < steps.length - 1; i += 1) {
        const label = steps[i].segment;
        if (!label) continue;
        const dur = durationMs(run.segments[steps[i].id], run.segments[steps[i + 1].id]);
        if (dur === null) continue;
        buckets[label] = buckets[label] ? [...buckets[label], dur] : [dur];
      }
      buckets['Total Trip'] = buckets['Total Trip'] ? [...buckets['Total Trip'], run.totalMs] : [run.totalMs];
    });

    return Object.entries(buckets).map(([label, values]) => ({
      label,
      avg: Math.round(values.reduce((a, b) => a + b, 0) / values.length),
      best: Math.min(...values),
      worst: Math.max(...values),
    }));
  }, [history, mode, steps]);

  return (
    <div className="min-h-screen pb-24 px-4 md:px-8 py-8">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8">
        <header
          ref={headerRef}
          className="relative overflow-hidden rounded-[32px] border border-black/5 bg-white/80 p-8 shadow-[0_30px_90px_rgba(20,17,14,0.18)]"
        >
          <div className="hero-sheen absolute -left-20 top-0 h-full w-[55%] bg-gradient-to-r from-white/80 via-white/10 to-transparent" />
          <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 rounded-full border border-black/5 bg-white/80 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-[#5a534b]">
                Commute Speedrun Livesplit
              </div>
              <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
                Race your real-world route like a speedrun.
              </h1>
              <p className="max-w-xl text-sm text-[#6b665d]">
                Tap splits in sequence, watch pace vs your personal best, and build a clean commute history.
                Works fully offline and stores runs in local storage.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="rounded-2xl border border-black/10 bg-white px-4 py-3 text-right">
                <p className="text-[11px] uppercase tracking-[0.3em] text-[#9a938a]">Current Mode</p>
                <p className="text-lg font-semibold">{modeMeta[mode].label}</p>
              </div>
              <button
                onClick={() => setShowHistory((prev) => !prev)}
                className="inline-flex items-center gap-2 rounded-2xl border border-black/5 bg-black px-4 py-3 text-sm font-semibold text-white"
              >
                <ClipboardList size={16} />
                {showHistory ? 'Back to Splits' : 'View History'}
              </button>
            </div>
          </div>
        </header>

        {!showHistory ? (
          <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
            <section className="card rounded-[28px] p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span
                    className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold ${modeMeta[mode].chip}`}
                  >
                    <ArrowDownUp size={12} />
                    {modeMeta[mode].label}
                  </span>
                  <button
                    onClick={() => {
                      if (Object.keys(segments).length > 0) {
                        const ok = window.confirm('Switch mode and reset current run?');
                        if (!ok) return;
                      }
                      setSegments({});
                      setMode(mode === 'forward' ? 'reverse' : 'forward');
                    }}
                    className="rounded-full border border-black/10 px-3 py-1 text-xs font-semibold text-[#6b665d]"
                  >
                    Toggle Mode
                  </button>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={undoStep}
                    className="rounded-full border border-black/10 px-3 py-1 text-xs font-semibold text-[#6b665d]"
                  >
                    Undo
                  </button>
                  <button onClick={reset} className="rounded-full border border-black/10 px-3 py-1 text-xs font-semibold text-[#6b665d]">
                    <RotateCcw size={12} className="inline-block" /> Reset
                  </button>
                </div>
              </div>

              <div className="mt-6 rounded-[24px] border border-black/5 bg-[#101010] p-5 text-white">
                <p className="text-[11px] uppercase tracking-[0.3em] text-white/60">Live Timer</p>
                <div className="mt-2 flex items-end justify-between gap-4">
                  <div>
                    <p className="mono text-4xl font-bold md:text-5xl">{formatDuration(totalTimeMs)}</p>
                    <p className="mt-1 text-xs text-white/60">
                      {bestTotal ? `PB ${formatDuration(bestTotal)}` : 'No PB yet'}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-white/60">Delta</p>
                    <p
                      className={`mono text-lg font-semibold ${
                        deltaFromPB === null
                          ? 'text-white/50'
                          : deltaFromPB <= 0
                          ? 'text-[#48e08a]'
                          : 'text-[#ff8e6c]'
                      }`}
                    >
                      {deltaFromPB === null ? '--' : `${deltaFromPB <= 0 ? '-' : '+'}${formatDuration(Math.abs(deltaFromPB))}`}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-6 space-y-3">
                {steps.map((step, idx) => {
                  const timestamp = segments[step.id];
                  const isLogged = !!timestamp;
                  const isNext = idx === nextStepIndex;
                  return (
                    <motion.div
                      key={step.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.25, delay: idx * 0.03 }}
                      className={`flex items-center justify-between gap-4 rounded-2xl border border-black/5 px-4 py-3 ${
                        isNext ? 'bg-white' : 'bg-white/60'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`grid h-10 w-10 place-items-center rounded-xl ${
                            isLogged
                              ? 'bg-[#0da678]/15 text-[#0da678]'
                              : isNext
                              ? 'bg-[#ff5b2e] text-white'
                              : 'bg-black/5 text-black/30'
                          }`}
                        >
                          {step.icon}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-[#1c1a17]">{step.label}</p>
                          <p className="mono text-xs text-[#9a938a]">{formatClock(timestamp)}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="mono text-xs text-[#9a938a]">
                          {step.segment ? step.segment.toUpperCase() : 'FINISH'}
                        </span>
                        {!isLogged && (
                          <button
                            onClick={() => logStep(step.id)}
                            disabled={idx > nextStepIndex}
                            className={`rounded-xl px-3 py-1 text-xs font-semibold uppercase tracking-wide ${
                              isNext
                                ? 'bg-black text-white'
                                : 'cursor-not-allowed bg-black/5 text-black/30'
                            }`}
                          >
                            Split
                          </button>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {isFinished && (
                <div className="mt-6">
                  <button
                    onClick={saveRun}
                    className="flex w-full items-center justify-center gap-2 rounded-2xl bg-black px-4 py-3 text-sm font-semibold text-white"
                  >
                    <Save size={16} /> Save Run
                  </button>
                </div>
              )}
            </section>

            <section className="flex flex-col gap-6">
              <div className="card rounded-[28px] p-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-[#9a938a]">Live Splits</h2>
                  <button
                    onClick={() => setExpandedStats((prev) => !prev)}
                    className="rounded-full border border-black/10 px-3 py-1 text-xs font-semibold text-[#6b665d]"
                  >
                    {expandedStats ? <ChevronUp size={12} /> : <ChevronDown size={12} />} Stats
                  </button>
                </div>
                <div className="mt-4 space-y-3">
                  {liveSegments.map((segment, idx) => {
                    const best = bestSegments[segment.label];
                    const isGold = best !== undefined && segment.value !== null && segment.value <= best;
                    return (
                      <div key={idx} className="flex items-center justify-between gap-4 rounded-2xl border border-black/5 px-4 py-3">
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#6b665d]">{segment.label}</p>
                          <p className={`mono text-lg font-semibold ${segment.isRunning ? 'text-[#ff5b2e]' : ''}`}>
                            {segment.value ? formatDuration(segment.value) : '--:--'}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-[10px] uppercase tracking-[0.3em] text-[#9a938a]">Best</p>
                          <p className={`mono text-xs font-semibold ${isGold ? 'text-[#0da678]' : 'text-[#6b665d]'}`}>
                            {best ? formatDuration(best) : '--:--'}
                          </p>
                          {isGold && (
                            <span className="mt-1 inline-flex items-center gap-1 text-[10px] font-semibold text-[#0da678]">
                              <Zap size={10} /> Gold
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <AnimatePresence>
                {expandedStats && detailedStats.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 12 }}
                    className="card rounded-[28px] p-6"
                  >
                    <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-[#9a938a]">Performance Stats</h2>
                    <div className="mt-4 space-y-3">
                      {detailedStats.map((stat) => {
                        const colors = colorMap[stat.label] ?? 'border-black/5 bg-white text-[#6b665d]';
                        return (
                          <div key={stat.label} className={`rounded-2xl border px-4 py-3 ${colors}`}>
                            <div className="flex items-center justify-between">
                              <p className="text-xs font-semibold uppercase tracking-[0.2em]">{stat.label}</p>
                              <p className="mono text-xs">Avg {formatDuration(stat.avg)}</p>
                            </div>
                            <div className="mt-3 grid grid-cols-2 gap-3 text-xs">
                              <div>
                                <p className="text-[10px] uppercase tracking-[0.3em] opacity-70">Best</p>
                                <p className="mono text-sm font-semibold">{formatDuration(stat.best)}</p>
                              </div>
                              <div>
                                <p className="text-[10px] uppercase tracking-[0.3em] opacity-70">Worst</p>
                                <p className="mono text-sm font-semibold">{formatDuration(stat.worst)}</p>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </section>
          </div>
        ) : (
          <section className="card rounded-[28px] p-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-lg font-semibold">Run History</h2>
                <p className="text-sm text-[#6b665d]">Export, import, or delete runs.</p>
              </div>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => exportFile(history)}
                  className="inline-flex items-center gap-2 rounded-2xl border border-black/10 bg-white px-4 py-2 text-sm font-semibold"
                >
                  <Download size={16} /> Export
                </button>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="inline-flex items-center gap-2 rounded-2xl border border-black/10 bg-white px-4 py-2 text-sm font-semibold"
                >
                  <Upload size={16} /> Import
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="application/json"
                  className="hidden"
                  onChange={async (event) => {
                    const file = event.target.files?.[0];
                    if (!file) return;
                    try {
                      await importHistory(file);
                    } catch {
                      window.alert('Import failed.');
                    } finally {
                      event.currentTarget.value = '';
                    }
                  }}
                />
              </div>
            </div>

            <div className="mt-6 grid gap-3">
              {history.length === 0 && (
                <div className="rounded-2xl border border-dashed border-black/10 p-6 text-center text-sm text-[#9a938a]">
                  No runs saved yet. Start a split to see history.
                </div>
              )}
              {history.map((run) => (
                <div
                  key={run.id}
                  className="flex flex-col gap-4 rounded-2xl border border-black/5 bg-white/70 p-4 md:flex-row md:items-center md:justify-between"
                >
                  <div>
                    <p className="text-xs uppercase tracking-[0.3em] text-[#9a938a]">
                      {new Intl.DateTimeFormat('en-US', {
                        weekday: 'short',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: false,
                      }).format(new Date(run.date))}
                    </p>
                    <p className="mono text-2xl font-semibold">{formatDuration(run.totalMs)}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`rounded-full border px-3 py-1 text-xs font-semibold ${modeMeta[run.mode].chip}`}
                    >
                      {modeMeta[run.mode].label}
                    </span>
                    <button
                      onClick={() => deleteRun(run.id)}
                      className="rounded-full border border-black/10 px-3 py-1 text-xs font-semibold text-[#6b665d]"
                    >
                      <Trash2 size={12} className="inline-block" /> Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default App;
