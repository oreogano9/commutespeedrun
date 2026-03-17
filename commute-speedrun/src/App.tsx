import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { gsap } from 'gsap';
import {
  Activity,
  AlertCircle,
  ArrowRightLeft,
  BadgeCheck,
  ChartLine,
  Clock,
  CloudLightning,
  Gauge,
  Loader2,
  MapPin,
  PlaneLanding,
  PlaneTakeoff,
  Radar,
  RefreshCw,
  Search,
  ShieldCheck,
  Ticket,
} from 'lucide-react';
import { demoFlights, type FlightRecord, type FlightStatus, type FlightType } from './data/demoFlights';

const API_CONFIG = {
  mode: import.meta.env.VITE_FLIGHT_MODE ?? 'demo',
  baseUrl: import.meta.env.VITE_FLIGHT_API_BASE ?? '/api/fco-flights',
  apiKey: import.meta.env.VITE_FLIGHT_API_KEY ?? '',
};

const statusStyles: Record<FlightStatus, string> = {
  'On Time': 'bg-emerald-100 text-emerald-700 border-emerald-200',
  Boarding: 'bg-blue-100 text-blue-700 border-blue-200',
  'Final Call': 'bg-amber-100 text-amber-800 border-amber-200',
  Delayed: 'bg-rose-100 text-rose-700 border-rose-200',
  'Gate Closed': 'bg-slate-200 text-slate-700 border-slate-300',
  Landed: 'bg-indigo-100 text-indigo-700 border-indigo-200',
  Taxiing: 'bg-cyan-100 text-cyan-700 border-cyan-200',
  Scheduled: 'bg-slate-100 text-slate-600 border-slate-200',
  Cancelled: 'bg-black text-white border-black',
};

const delayTone = (delay: number) => {
  if (delay <= 0) return 'text-emerald-600';
  if (delay <= 15) return 'text-amber-600';
  return 'text-rose-600';
};

const sortByTime = (a: FlightRecord, b: FlightRecord) => a.time.localeCompare(b.time);

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const normalizeResponse = (data: unknown): FlightRecord[] => {
  if (!data) return [];
  if (Array.isArray(data)) return data as FlightRecord[];
  if (typeof data === 'object' && data && 'flights' in data) {
    return (data as { flights: FlightRecord[] }).flights ?? [];
  }
  return [];
};

const fetchFlights = async (type: FlightType, offset: number) => {
  if (!API_CONFIG.baseUrl || API_CONFIG.mode === 'demo') {
    await sleep(600);
    const filtered = demoFlights.filter((flight) => flight.type === type).sort(sortByTime);
    return filtered.slice(offset, offset + 6);
  }

  const url = new URL(`${API_CONFIG.baseUrl.replace(/\/$/, '')}/flights`);
  url.searchParams.set('type', type);
  url.searchParams.set('offset', offset.toString());
  url.searchParams.set('limit', '6');

  const response = await fetch(url.toString(), {
    headers: {
      'Content-Type': 'application/json',
      ...(API_CONFIG.apiKey ? { Authorization: `Bearer ${API_CONFIG.apiKey}` } : {}),
    },
  });

  if (!response.ok) {
    throw new Error('Flight API request failed');
  }

  const payload = await response.json();
  return normalizeResponse(payload);
};

const App = () => {
  const [view, setView] = useState<FlightType>('arrivals');
  const [flights, setFlights] = useState<FlightRecord[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<FlightStatus | 'All'>('All');
  const headerRef = useRef<HTMLDivElement | null>(null);

  const systemClock = useMemo(() => {
    return new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    }).format(new Date());
  }, []);

  const addLog = (msg: string) => {
    const stamp = new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    }).format(new Date());
    setLogs((prev) => [`${stamp} ${msg}`, ...prev].slice(0, 8));
  };

  const startSequence = async () => {
    setIsScanning(true);
    setError(null);
    setFlights([]);
    setLogs([]);
    addLog('Initializing operations stream.');

    for (let i = 0; i < 4; i += 1) {
      setCurrentStep(i + 1);
      addLog(`Requesting segment ${i + 1} from ${API_CONFIG.mode === 'demo' ? 'demo cache' : 'live API'}.`);

      try {
        const batch = await fetchFlights(view, i * 6);

        if (batch.length === 0 && i > 0) {
          addLog('End of board reached.');
          break;
        }

        setFlights((prev) => {
          const existing = new Set(prev.map((flight) => flight.id));
          const merged = [...prev, ...batch.filter((flight) => !existing.has(flight.id))].sort(sortByTime);
          return merged;
        });

        addLog(`Synced ${batch.length} records.`);
      } catch (err) {
        setError('Connection issue. Verify API endpoint or switch to demo mode.');
        addLog('Critical: Failed to retrieve live data.');
        break;
      }
    }

    setIsScanning(false);
    setCurrentStep(0);
    addLog('Synchronization complete.');
  };

  useLayoutEffect(() => {
    if (!headerRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.scan-beam',
        { xPercent: -35, opacity: 0 },
        { xPercent: 45, opacity: 1, duration: 1.4, ease: 'power2.out' }
      );
    }, headerRef);
    return () => ctx.revert();
  }, []);

  useEffect(() => {
    startSequence();
  }, [view]);

  const filteredFlights = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return flights.filter((flight) => {
      if (statusFilter !== 'All' && flight.status !== statusFilter) return false;
      if (!needle) return true;
      return (
        flight.flightCode.toLowerCase().includes(needle) ||
        flight.airline.toLowerCase().includes(needle) ||
        flight.route.toLowerCase().includes(needle)
      );
    });
  }, [flights, query, statusFilter]);

  const selected = useMemo(() => {
    if (!selectedId) return filteredFlights[0] ?? null;
    return filteredFlights.find((flight) => flight.id === selectedId) ?? filteredFlights[0] ?? null;
  }, [filteredFlights, selectedId]);

  const totals = useMemo(() => {
    const total = flights.length;
    const delayed = flights.filter((f) => f.delayMinutes > 0).length;
    const onTime = flights.filter((f) => f.delayMinutes === 0 && f.status !== 'Delayed').length;
    const avgDelay = total === 0 ? 0 : Math.round(flights.reduce((acc, f) => acc + f.delayMinutes, 0) / total);
    const gateUtil = Math.min(98, Math.max(62, Math.round(60 + total * 1.7)));
    return { total, delayed, onTime, avgDelay, gateUtil };
  }, [flights]);

  const opsScore = useMemo(() => {
    if (totals.total === 0) return 0;
    const base = 100 - totals.avgDelay * 1.2 - (totals.delayed / totals.total) * 20;
    return Math.max(62, Math.min(99, Math.round(base)));
  }, [totals]);

  return (
    <div className="min-h-screen px-4 pb-24 pt-8 md:px-8">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8">
        <header
          ref={headerRef}
          className="relative overflow-hidden rounded-[36px] border border-black/5 bg-white/80 p-8 shadow-[0_30px_90px_rgba(12,20,20,0.2)]"
        >
          <div className="scan-beam absolute -left-24 top-0 h-full w-[55%] bg-gradient-to-r from-white/90 via-white/10 to-transparent" />
          <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 rounded-full border border-black/5 bg-white/80 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.3em] text-[#5f6b6b]">
                <Radar size={14} /> AeroScope Intelligence
              </div>
              <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
                Airport business + flight data tracker for live ramp decisions.
              </h1>
              <p className="max-w-xl text-sm text-[#6b6f6f]">
                Monitor arrivals/departures, gate utilization, delay risk, and operational health in one live table.
                The default pipeline runs in demo mode until a real API is connected.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <div className="rounded-2xl border border-black/10 bg-white px-4 py-3 text-right">
                <p className="text-[11px] uppercase tracking-[0.3em] text-[#9aa2a3]">System Clock</p>
                <p className="text-lg font-semibold">{systemClock}</p>
              </div>
              <button
                onClick={() => setView((prev) => (prev === 'arrivals' ? 'departures' : 'arrivals'))}
                disabled={isScanning}
                className="inline-flex items-center gap-2 rounded-2xl border border-black/5 bg-black px-4 py-3 text-sm font-semibold text-white"
              >
                <ArrowRightLeft size={16} /> Switch Board
              </button>
            </div>
          </div>
        </header>

        <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="card rounded-[30px] p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-black px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-white">
                  {view === 'arrivals' ? <PlaneLanding size={12} /> : <PlaneTakeoff size={12} />}
                  {view}
                </span>
                <span className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-3 py-1 text-xs font-semibold text-[#5f6b6b]">
                  <BadgeCheck size={12} /> {API_CONFIG.mode === 'demo' ? 'Demo stream' : 'Live API'}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={startSequence}
                  disabled={isScanning}
                  className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-3 py-1 text-xs font-semibold text-[#5f6b6b]"
                >
                  <RefreshCw size={12} /> Refresh
                </button>
                <div className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-3 py-1 text-xs font-semibold text-[#5f6b6b]">
                  <ShieldCheck size={12} /> {flights.length} records
                </div>
              </div>
            </div>

            <div className="mt-5 grid gap-4 md:grid-cols-3">
              <div className="rounded-[22px] border border-black/5 bg-white/70 p-4">
                <div className="flex items-center justify-between">
                  <p className="text-[11px] uppercase tracking-[0.3em] text-[#9aa2a3]">Ops Score</p>
                  <Gauge size={16} className="text-emerald-500" />
                </div>
                <p className="mt-2 text-3xl font-semibold text-[#111]">{opsScore}%</p>
                <p className="text-xs text-[#6b6f6f]">On-time health + delay risk blend.</p>
              </div>
              <div className="rounded-[22px] border border-black/5 bg-white/70 p-4">
                <div className="flex items-center justify-between">
                  <p className="text-[11px] uppercase tracking-[0.3em] text-[#9aa2a3]">Gate Utilization</p>
                  <ChartLine size={16} className="text-blue-500" />
                </div>
                <p className="mt-2 text-3xl font-semibold text-[#111]">{totals.gateUtil}%</p>
                <p className="text-xs text-[#6b6f6f]">Based on current movement load.</p>
              </div>
              <div className="rounded-[22px] border border-black/5 bg-white/70 p-4">
                <div className="flex items-center justify-between">
                  <p className="text-[11px] uppercase tracking-[0.3em] text-[#9aa2a3]">Average Delay</p>
                  <CloudLightning size={16} className="text-rose-500" />
                </div>
                <p className={`mt-2 text-3xl font-semibold ${delayTone(totals.avgDelay)}`}>{totals.avgDelay} min</p>
                <p className="text-xs text-[#6b6f6f]">Across current board.</p>
              </div>
            </div>

            <div className="mt-5 flex flex-wrap items-center gap-3">
              <div className="relative flex-1">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9aa2a3]" />
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search flight, airline, or route"
                  className="w-full rounded-2xl border border-black/5 bg-white px-9 py-3 text-sm text-[#1b1f1f] outline-none placeholder:text-[#9aa2a3]"
                />
              </div>
              <div className="flex flex-wrap items-center gap-2">
                {(['All', 'On Time', 'Delayed', 'Boarding', 'Final Call'] as const).map((status) => (
                  <button
                    key={status}
                    onClick={() => setStatusFilter(status)}
                    className={`rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] transition-all ${
                      statusFilter === status
                        ? 'border-black bg-black text-white'
                        : 'border-black/10 bg-white text-[#6b6f6f]'
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="card rounded-[30px] p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] uppercase tracking-[0.3em] text-[#9aa2a3]">Live Ops Log</p>
                <p className="text-sm text-[#6b6f6f]">Scanning board + API status.</p>
              </div>
              {isScanning && (
                <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-blue-600">
                  <Loader2 size={12} className="animate-spin" /> Segment {currentStep}
                </div>
              )}
            </div>
            <div className="mt-4 space-y-2 font-mono text-[11px]">
              {logs.length > 0 ? (
                logs.map((log, index) => (
                  <div key={log} className={index === 0 ? 'text-blue-500' : 'text-[#6b6f6f]'}>
                    <span className="opacity-60">&gt;</span> {log}
                  </div>
                ))
              ) : (
                <div className="text-[#9aa2a3]">Awaiting first sync.</div>
              )}
            </div>
            <div className="mt-5 rounded-2xl border border-black/5 bg-white/70 p-4">
              <div className="flex items-center gap-3">
                {error ? (
                  <AlertCircle className="h-6 w-6 text-rose-500" />
                ) : (
                  <Activity className="h-6 w-6 text-emerald-500" />
                )}
                <div>
                  <p className="text-sm font-semibold text-[#111]">Sync Integrity</p>
                  <p className="text-xs text-[#6b6f6f]">
                    {error ?? 'All systems nominal. Monitoring data freshness.'}
                  </p>
                </div>
              </div>
            </div>
            <div className="mt-4 rounded-2xl border border-black/5 bg-[#111] p-4 text-white">
              <p className="text-[11px] uppercase tracking-[0.3em] text-white/60">API Plug</p>
              <p className="mt-2 text-xs text-white/70">
                Configure <span className="mono text-white">VITE_FLIGHT_API_BASE</span> and{' '}
                <span className="mono text-white">VITE_FLIGHT_API_KEY</span> to enable live mode.
              </p>
            </div>
          </div>
        </section>

        <section className="card overflow-hidden rounded-[32px]">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-black/5 bg-white/80 px-6 py-4">
            <div>
              <p className="text-[11px] uppercase tracking-[0.3em] text-[#9aa2a3]">Flight Board</p>
              <h2 className="text-lg font-semibold text-[#111]">{view === 'arrivals' ? 'Arrivals' : 'Departures'} overview</h2>
            </div>
            <div className="flex flex-wrap items-center gap-2 text-xs text-[#6b6f6f]">
              <Ticket size={14} />
              {totals.total} records • {totals.onTime} on-time • {totals.delayed} delayed
            </div>
          </div>

          <div className="grid gap-6 p-6 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-black/5 text-[10px] uppercase tracking-[0.25em] text-[#9aa2a3]">
                    <th className="pb-3 pl-2">Flight</th>
                    <th className="pb-3">Route</th>
                    <th className="pb-3 text-center">Gate/Belt</th>
                    <th className="pb-3 text-right">Time</th>
                    <th className="pb-3 text-right">Status</th>
                  </tr>
                </thead>
                <tbody>
                  <AnimatePresence>
                    {filteredFlights.map((flight, idx) => (
                      <motion.tr
                        key={flight.id}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2, delay: idx * 0.02 }}
                        className={`cursor-pointer border-b border-black/5 text-sm transition-colors hover:bg-blue-50/40 ${
                          selected?.id === flight.id ? 'bg-blue-50/60' : ''
                        }`}
                        onClick={() => setSelectedId(flight.id)}
                      >
                        <td className="py-4 pl-2">
                          <div className="font-mono text-sm font-semibold text-[#0f1a1a]">{flight.flightCode}</div>
                          <div className="text-[11px] text-[#6b6f6f]">{flight.airline}</div>
                        </td>
                        <td className="py-4">
                          <div className="font-semibold text-[#111]">{flight.route}</div>
                          <div className="text-[11px] text-[#6b6f6f]">Terminal {flight.terminal}</div>
                        </td>
                        <td className="py-4 text-center">
                          <span className="inline-flex min-w-[64px] items-center justify-center rounded-xl border border-black/5 bg-white px-3 py-1 text-xs font-semibold text-[#111]">
                            {view === 'arrivals' ? flight.belt ?? '---' : flight.gate ?? '---'}
                          </span>
                        </td>
                        <td className="py-4 text-right font-mono text-sm text-[#111]">{flight.time}</td>
                        <td className="py-4 text-right">
                          <span
                            className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-[11px] font-semibold ${
                              statusStyles[flight.status]
                            }`}
                          >
                            {flight.status}
                          </span>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>

              {filteredFlights.length === 0 && (
                <div className="flex flex-col items-center gap-4 py-20 text-center text-sm text-[#9aa2a3]">
                  {isScanning ? (
                    <div className="flex flex-col items-center gap-4">
                      <div className="relative">
                        <div className="h-12 w-12 rounded-full border-4 border-blue-100 border-t-blue-600 animate-spin" />
                        <Search className="absolute left-1/2 top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-blue-600">Syncing board</p>
                        <p className="text-[11px] text-[#9aa2a3]">Gathering records from {systemClock} onward.</p>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.3em]">No flights match filters</p>
                      <p className="mt-2 text-[11px] text-[#9aa2a3]">Try clearing search or switching board.</p>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="space-y-4">
              <div className="rounded-[24px] border border-black/5 bg-white/80 p-5">
                <div className="flex items-center justify-between">
                  <p className="text-[11px] uppercase tracking-[0.3em] text-[#9aa2a3]">Selected Flight</p>
                  <MapPin size={14} className="text-[#6b6f6f]" />
                </div>
                {selected ? (
                  <div className="mt-4 space-y-4">
                    <div>
                      <p className="text-xs uppercase tracking-[0.3em] text-[#9aa2a3]">Flight Code</p>
                      <p className="mt-1 font-mono text-2xl font-semibold text-[#111]">{selected.flightCode}</p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-[0.3em] text-[#9aa2a3]">Route</p>
                      <p className="text-sm font-semibold text-[#111]">{selected.route}</p>
                      <p className="text-[11px] text-[#6b6f6f]">{selected.airline}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div className="rounded-2xl border border-black/5 bg-white px-3 py-2">
                        <p className="text-[10px] uppercase tracking-[0.3em] text-[#9aa2a3]">Terminal</p>
                        <p className="mt-1 font-semibold text-[#111]">{selected.terminal}</p>
                      </div>
                      <div className="rounded-2xl border border-black/5 bg-white px-3 py-2">
                        <p className="text-[10px] uppercase tracking-[0.3em] text-[#9aa2a3]">Gate/Belt</p>
                        <p className="mt-1 font-semibold text-[#111]">
                          {view === 'arrivals' ? selected.belt ?? '---' : selected.gate ?? '---'}
                        </p>
                      </div>
                      <div className="rounded-2xl border border-black/5 bg-white px-3 py-2">
                        <p className="text-[10px] uppercase tracking-[0.3em] text-[#9aa2a3]">Status</p>
                        <p className="mt-1 font-semibold text-[#111]">{selected.status}</p>
                      </div>
                      <div className="rounded-2xl border border-black/5 bg-white px-3 py-2">
                        <p className="text-[10px] uppercase tracking-[0.3em] text-[#9aa2a3]">Updated</p>
                        <p className="mt-1 font-semibold text-[#111]">{selected.updatedAt}</p>
                      </div>
                    </div>
                    <div className="rounded-2xl border border-black/5 bg-[#0f1a1a] px-4 py-3 text-white">
                      <p className="text-[11px] uppercase tracking-[0.3em] text-white/60">Delay Impact</p>
                      <p className={`mt-2 text-lg font-semibold ${delayTone(selected.delayMinutes)}`}>
                        {selected.delayMinutes} min
                      </p>
                      <p className="text-[11px] text-white/60">Projected turnaround risk: {selected.delayMinutes > 20 ? 'High' : 'Normal'}.</p>
                    </div>
                  </div>
                ) : (
                  <div className="mt-4 text-sm text-[#9aa2a3]">No flight selected.</div>
                )}
              </div>
              <div className="rounded-[24px] border border-black/5 bg-white/80 p-5">
                <div className="flex items-center justify-between">
                  <p className="text-[11px] uppercase tracking-[0.3em] text-[#9aa2a3]">Operational Alerts</p>
                  <Clock size={14} className="text-[#6b6f6f]" />
                </div>
                <ul className="mt-4 space-y-3 text-sm text-[#6b6f6f]">
                  <li className="flex items-start gap-2">
                    <span className="mt-1 h-2 w-2 rounded-full bg-rose-400" />
                    Monitor delayed flights for gate rotation conflicts.
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 h-2 w-2 rounded-full bg-amber-400" />
                    Prioritize arrivals with belt changes in terminal 3.
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 h-2 w-2 rounded-full bg-emerald-400" />
                    On-time departures above 85% for current window.
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <footer className="text-center text-[10px] font-semibold uppercase tracking-[0.4em] text-[#9aa2a3]">
          AeroScope Ramp Control • Data pulse v3.0 • Build with React + Vite + Tailwind v4
        </footer>
      </div>
    </div>
  );
};

export default App;
