import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  Palette, Layout, Sliders, Plus, Copy, Trash2, Edit3,
  Check, X, Sparkles, Orbit, Wind, ZapOff, ChevronLeft,
  ChevronRight, Layers, RotateCcw, RotateCw, GripVertical
} from 'lucide-react';
import { NotificationCard } from '../shared/NotificationCard.jsx';

const themeV2 = globalThis.TimestampChatterThemeCatalogV2 || null;
const STORAGE_LOCAL_KEY = themeV2?.THEME_CATALOG_V2_KEY || 'themeCatalogV2';
const STORAGE_REV_KEY = themeV2?.THEME_CATALOG_V2_REVISION_KEY || 'themeCatalogV2Revision';
const STORAGE_VER_KEY = themeV2?.THEME_CATALOG_V2_SCHEMA_VERSION_KEY || 'themeCatalogV2SchemaVersion';

const initialThemes = [
  {
    name: 'Default',
    description: 'Classic medal-tier progression.',
    tiers: [
      { id: '1', name: 'Bronze', body: '#3d2315', border: '#CD7F32', borderOpacity: 100, text: '#ffffff', radius: 8, borderWidth: 2, opacity: 90, textOpacity: 100, effect: 'none' },
      { id: '2', name: 'Silver', body: '#2b2b2b', border: '#C0C0C0', borderOpacity: 100, text: '#ffffff', radius: 8, borderWidth: 2, opacity: 90, textOpacity: 100, effect: 'none' },
      { id: '3', name: 'Gold', body: '#332b00', border: '#FFD700', borderOpacity: 100, text: '#ffffff', radius: 8, borderWidth: 2, opacity: 90, textOpacity: 100, effect: 'none' },
      { id: '4', name: 'Diamond', body: '#002d35', border: '#B9F2FF', borderOpacity: 100, text: '#ffffff', radius: 8, borderWidth: 2, opacity: 90, textOpacity: 100, effect: 'galaxy' },
      { id: '5', name: 'Platinum', body: '#262626', border: '#E5E4E2', borderOpacity: 100, text: '#ffffff', radius: 8, borderWidth: 2, opacity: 90, textOpacity: 100, effect: 'aurora' }
    ]
  },
  {
    name: 'Cyberpunk',
    description: 'High-contrast neon HUD style.',
    tiers: [
      { id: 'cp1', name: 'Street-Rat', body: '#1A1A1A', border: '#4A4A4A', borderOpacity: 100, text: '#B0B0B0', radius: 2, borderWidth: 1, opacity: 100, textOpacity: 100, effect: 'none' },
      { id: 'cp2', name: 'Runner', body: '#16213E', border: '#00D2FF', text: '#E0E0E0', radius: 2, borderWidth: 1, opacity: 95, textOpacity: 100, effect: 'none' },
      { id: 'cp3', name: 'Augmented', body: '#1B1212', border: '#FFD700', text: '#FFFFFF', radius: 2, borderWidth: 2, opacity: 90, textOpacity: 100, effect: 'none' },
      { id: 'cp4', name: 'Net-Ghost', body: '#0D1117', border: '#00FFC3', text: '#FFFFFF', radius: 2, borderWidth: 2, opacity: 90, textOpacity: 100, effect: 'galaxy' },
      { id: 'cp5', name: 'Glitch-Walker', body: '#1A1A1A', border: '#E0E0E0', text: '#FFFFFF', radius: 2, borderWidth: 3, opacity: 85, textOpacity: 100, effect: 'galaxy' },
      { id: 'cp6', name: 'Neon-Legend', body: '#1B1212', border: '#BC13FE', text: '#FFFFFF', radius: 2, borderWidth: 2, opacity: 90, textOpacity: 100, effect: 'aurora' },
      { id: 'cp7', name: 'Apex-Chrome', body: '#0A0A0A', border: '#FF0055', borderOpacity: 100, text: '#FFFFFF', radius: 2, borderWidth: 3, opacity: 95, textOpacity: 100, effect: 'aurora' }
    ]
  },
  {
    name: 'Borderlands 2',
    description: 'Loot rarity colors from Pandora.',
    tiers: [
      { id: 'bl1', name: 'Common', body: '#1A1A1A', border: '#FFFFFF', borderOpacity: 100, text: '#FFFFFF', radius: 4, borderWidth: 2, opacity: 90, textOpacity: 100, effect: 'none' },
      { id: 'bl2', name: 'Uncommon', body: '#0A2400', border: '#1EFF00', text: '#FFFFFF', radius: 4, borderWidth: 2, opacity: 90, textOpacity: 100, effect: 'none' },
      { id: 'bl3', name: 'Rare', body: '#001B35', border: '#0070DD', text: '#FFFFFF', radius: 4, borderWidth: 2, opacity: 90, textOpacity: 100, effect: 'none' },
      { id: 'bl4', name: 'Cursed', body: '#140024', border: '#4B0082', text: '#FFFFFF', radius: 4, borderWidth: 2, opacity: 90, textOpacity: 100, effect: 'none' },
      { id: 'bl5', name: 'Epic', body: '#200033', border: '#A335EE', text: '#FFFFFF', radius: 4, borderWidth: 2, opacity: 90, textOpacity: 100, effect: 'none' },
      { id: 'bl6', name: 'E-tech', body: '#330029', border: '#FF33CC', text: '#FFFFFF', radius: 4, borderWidth: 2, opacity: 90, textOpacity: 100, effect: 'none' },
      { id: 'bl7', name: 'Gemstone', body: '#00241E', border: '#00FFD5', text: '#FFFFFF', radius: 4, borderWidth: 2, opacity: 90, textOpacity: 100, effect: 'none' },
      { id: 'bl8', name: 'Legendary', body: '#2E1700', border: '#FF8000', text: '#FFFFFF', radius: 4, borderWidth: 2, opacity: 90, textOpacity: 100, effect: 'none' },
      { id: 'bl9', name: 'Effervescent', body: '#330026', border: '#FF4FD8', text: '#FFFFFF', radius: 4, borderWidth: 2, opacity: 90, textOpacity: 100, effect: 'aurora' },
      { id: 'bl10', name: 'Seraph', body: '#33001C', border: '#f00060', text: '#FFFFFF', radius: 4, borderWidth: 2, opacity: 90, textOpacity: 100, effect: 'none' },
      { id: 'bl11', name: 'Pearlescent', body: '#002424', border: '#66FFFF', borderOpacity: 100, text: '#FFFFFF', radius: 4, borderWidth: 2, opacity: 90, textOpacity: 100, effect: 'galaxy' }
    ]
  },
  {
    name: 'Animal Crossing',
    tiers: [
      { id: 'ac1', name: 'Stone', body: '#D1D5DB', border: '#9CA3AF', borderOpacity: 100, text: '#374151', radius: 30, borderWidth: 2, opacity: 100, textOpacity: 100, effect: 'none' },
      { id: 'ac2', name: 'Coconut', body: '#D2B48C', border: '#8B4513', borderOpacity: 100, text: '#3E2723', radius: 30, borderWidth: 2, opacity: 100, textOpacity: 100, effect: 'none' },
      { id: 'ac3', name: 'Pear', body: '#C5E1A5', border: '#7CB342', borderOpacity: 100, text: '#33691E', radius: 30, borderWidth: 2, opacity: 100, textOpacity: 100, effect: 'none' },
      { id: 'ac4', name: 'Peach', body: '#FFD1DC', border: '#FF8FAB', borderOpacity: 100, text: '#8A2E44', radius: 30, borderWidth: 2, opacity: 100, textOpacity: 100, effect: 'none' },
      { id: 'ac5', name: 'Orange', body: '#FFB347', border: '#E67E22', borderOpacity: 100, text: '#5E3008', radius: 30, borderWidth: 2, opacity: 100, textOpacity: 100, effect: 'none' },
      { id: 'ac6', name: 'Cherry', body: '#FF9AA2', border: '#D81B60', borderOpacity: 100, text: '#4A001F', radius: 30, borderWidth: 2, opacity: 100, textOpacity: 100, effect: 'none' },
      { id: 'ac7', name: 'Apple', body: '#FF6B6B', border: '#C0392B', borderOpacity: 100, text: '#4A0000', radius: 30, borderWidth: 2, opacity: 100, textOpacity: 100, effect: 'none' }
    ]
  }
];

const EFFECTS = [
  { id: 'none', label: 'Plain', icon: <ZapOff size={14} /> },
  { id: 'galaxy', label: 'Galaxy', icon: <Orbit size={14} /> },
  { id: 'aurora', label: 'Aurora', icon: <Wind size={14} /> },
  { id: 'shader', label: 'Shader', icon: <Sparkles size={14} /> }
];

const SOFT_BUTTON_BASE =
  'rounded-[14px] border-0 bg-gradient-to-b from-white to-slate-100 text-slate-700 shadow-none transition-all';
const SOFT_BUTTON_HOVER = 'hover:bg-gradient-to-b hover:from-white hover:to-slate-50 hover:border-slate-200';
const SOFT_ICON_BUTTON = `${SOFT_BUTTON_BASE} ${SOFT_BUTTON_HOVER} p-2`;
const SOFT_PILL_BUTTON = `${SOFT_BUTTON_BASE} ${SOFT_BUTTON_HOVER} px-3 py-2`;
const THEME_MGMT_BUTTON = 'border-0 shadow-none bg-slate-100 hover:bg-slate-100 rounded-lg text-slate-600';

const BACKGROUNDS = [
  { id: 'dark', type: 'gradient', value: 'radial-gradient(circle at center, #1e293b 0%, #0f172a 100%)', label: 'Dark Void' },
  { id: 'gaming', type: 'image', value: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=1200', label: 'Gaming Backdrop' },
  { id: 'abstract', type: 'image', value: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=1200', label: 'Colorful Abstract' },
  { id: 'forest-mist', type: 'image', value: 'https://images.unsplash.com/photo-1646708198974-4c4893e8a2d7?q=80&w=1287&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', label: 'Forest Mist' },
  { id: 'cozy-room', type: 'image', value: 'https://images.unsplash.com/photo-1618193139062-2c5bf4f935b7?q=80&w=1287&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', label: 'Cozy Room' },
  { id: 'premium-abstract', type: 'image', value: 'https://plus.unsplash.com/premium_photo-1674917000586-b7564f21540e?q=80&w=1288&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', label: 'Premium Abstract' }
];

const VISUAL_TIER_LIKE_VALUES = [
  '1', '3', '11', '37', '123', '408', '1.4K', '4.5K', '15K', '50K',
  '166K', '554K', '1.84M', '6.13M', '20.4M', '67.9M', '226M', '753M', '2.51B', '8.35B',
  '27.8B', '92.6B', '308B', '1.03T', '3.42T', '11.4T', '38.0T', '126T', '420T', '1.40Qa',
  '4.67Qa', '15.5Qa', '51.7Qa', '172Qa', '573Qa', '1.91Qi', '6.35Qi', '21.1Qi', '70.3Qi', '234Qi',
  '778Qi', '2.59Sx', '8.62Sx', '28.7Sx', '95.4Sx', '312Sx', '1.04Sp', '3.46Sp', '11.5Sp', '38.3Sp'
];

function getVisualTierNumber(index) {
  return `T${Math.max(1, Number(index) + 1)}`;
}

function getVisualTierLikesValue(index) {
  return VISUAL_TIER_LIKE_VALUES[index] || VISUAL_TIER_LIKE_VALUES[VISUAL_TIER_LIKE_VALUES.length - 1];
}

const NotificationPreview = ({
  tier, tierIndex, isSelected, onClick, onDelete,
  onDragStart, onDragOver, onDrop, showAllTiers
}) => {
  return (
    <div
      draggable={showAllTiers}
      onDragStart={(e) => onDragStart?.(e, tierIndex)}
      onDragOver={(e) => onDragOver?.(e, tierIndex)}
      onDrop={(e) => onDrop?.(e, tierIndex)}
      className="relative flex items-center group w-full transition-all"
      onClick={onClick}
    >
      {showAllTiers && isSelected && (
        <div className="absolute -left-6 w-3 h-3 bg-white rounded-full shadow-[0_0_10px_white] z-20 transition-all animate-pulse" />
      )}
      <NotificationCard
        mode="editor"
        contentMode="live"
        tier={tier}
        tierIndex={tierIndex}
        isSelected={isSelected}
        showTierControls={showAllTiers}
        onDeleteTier={onDelete}
        onDragStart={onDragStart}
        onDragOver={onDragOver}
        onDrop={onDrop}
        draggable={showAllTiers}
        onClick={onClick}
        avatarUrl={`https://api.dicebear.com/7.x/avataaars/svg?seed=${tier.id || tier.name}`}
        likesLabel={`Likes ${getVisualTierLikesValue(tierIndex)} - ${tier.name}`}
        text={`1:30 designing ${tier.name} notification vibes. drag to reorder me if you have multiple tiers!`}
        showMeta={true}
        runtimeConfig={{ overlayAvatarSize: 25 }}
      />
    </div>
  );
};

function clone(v) { return JSON.parse(JSON.stringify(v)); }
function genId(prefix = 'id') {
  try { return `${prefix}-${crypto.randomUUID()}`; } catch { return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`; }
}

function applyEditToThemes(inputThemes, themeIndex, tierIndex, key, value) {
  const nextThemes = JSON.parse(JSON.stringify(inputThemes));
  const theme = nextThemes[themeIndex];
  if (!theme) return nextThemes;
    if (key === 'radius' || key === 'borderWidth' || key === 'opacity' || key === 'borderOpacity') {
    theme.tiers = theme.tiers.map((t) => ({ ...t, [key]: value }));
  } else if (theme.tiers?.[tierIndex]) {
    theme.tiers[tierIndex][key] = value;
  }
  return nextThemes;
}

function normalizeThemesForEditor(rawThemes) {
  return (Array.isArray(rawThemes) && rawThemes.length ? rawThemes : initialThemes).map((theme, tIdx) => ({
    id: String(theme?.id || genId('theme')),
    name: String(theme?.name || `Theme ${tIdx + 1}`),
    description: theme?.description ? String(theme.description) : '',
    tiers: (Array.isArray(theme?.tiers) && theme.tiers.length ? theme.tiers : [{ id: genId('tier'), name: 'Base', body: '#ffffff', border: '#cccccc', text: '#000000', radius: 8, borderWidth: 2, opacity: 100, textOpacity: 100, effect: 'none' }]).map((tier, i) => ({
      id: String(tier?.id || genId('tier')),
      name: String(tier?.name || `Tier ${i + 1}`),
      body: String(tier?.body || '#ffffff'),
      border: String(tier?.border || '#cccccc'),
      borderOpacity: Number(tier?.borderOpacity ?? 100),
      text: String(tier?.text || '#000000'),
      radius: Number(tier?.radius ?? 8),
      borderWidth: Number(tier?.borderWidth ?? 2),
      opacity: Number(tier?.opacity ?? 100),
      textOpacity: Number(tier?.textOpacity ?? 100),
      effect: ['none', 'galaxy', 'aurora', 'shader'].includes(String(tier?.effect)) ? String(tier.effect) : 'none'
    }))
  }));
}

export default function App() {
  const [themes, setThemes] = useState(normalizeThemesForEditor(initialThemes));
  const [selectedThemeIndex, setSelectedThemeIndex] = useState(0);
  const [selectedTierIndex, setSelectedTierIndex] = useState(0);
  const [history, setHistory] = useState([{ themes: normalizeThemesForEditor(initialThemes), selectedThemeIndex: 0, selectedTierIndex: 0 }]);
  const [historyPointer, setHistoryPointer] = useState(0);
  const [isEditingName, setIsEditingName] = useState(false);
  const [editNameValue, setEditNameValue] = useState('');
  const [bgIndex, setBgIndex] = useState(0);
  const [showAllTiers, setShowAllTiers] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState(null);
  const initializedRef = useRef(false);
  const saveTimerRef = useRef(null);
  const lastSavedSignatureRef = useRef('');
  const pickerPreviewActiveRef = useRef(false);
  const importFileInputRef = useRef(null);

  const currentTheme = themes[selectedThemeIndex] || themes[0];
  const currentTier = currentTheme?.tiers?.[selectedTierIndex] || currentTheme?.tiers?.[0];
  const currentBg = BACKGROUNDS[bgIndex];

  const commitChange = useCallback((newThemes, themeIdx = selectedThemeIndex, tierIdx = selectedTierIndex) => {
    const newEntry = { themes: JSON.parse(JSON.stringify(newThemes)), selectedThemeIndex: themeIdx, selectedTierIndex: tierIdx };
    const newHistory = history.slice(0, historyPointer + 1);
    newHistory.push(newEntry);
    if (newHistory.length > 50) newHistory.shift();
    setHistory(newHistory);
    setHistoryPointer(newHistory.length - 1);
    setThemes(newThemes);
    setSelectedThemeIndex(themeIdx);
    setSelectedTierIndex(tierIdx);
  }, [history, historyPointer, selectedThemeIndex, selectedTierIndex]);

  useEffect(() => {
    (async () => {
      try {
        if (themeV2?.ensureThemeCatalogV2Storage) {
          const seeded = await themeV2.ensureThemeCatalogV2Storage();
          const catalog = themeV2.normalizeThemeCatalog(seeded?.catalog);
          const loadedThemes = normalizeThemesForEditor(catalog?.themes || initialThemes);
          setThemes(loadedThemes);
          setHistory([{ themes: JSON.parse(JSON.stringify(loadedThemes)), selectedThemeIndex: 0, selectedTierIndex: 0 }]);
          setHistoryPointer(0);
          lastSavedSignatureRef.current = JSON.stringify({ themes: loadedThemes, activeThemeId: loadedThemes[0]?.id || 'default' });
        }
      } catch (error) {
        console.error('Editor load failed', error);
      } finally {
        initializedRef.current = true;
      }
    })();
  }, []);

  useEffect(() => {
    if (!initializedRef.current || !themes.length || !themeV2) return;
    if (pickerPreviewActiveRef.current) return;
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(async () => {
      try {
        const normalizedThemes = normalizeThemesForEditor(themes);
        const activeThemeId = normalizedThemes[selectedThemeIndex]?.id || normalizedThemes[0]?.id || 'default';
        const signature = JSON.stringify({ themes: normalizedThemes, activeThemeId });
        if (signature === lastSavedSignatureRef.current) return;

        const catalog = themeV2.normalizeThemeCatalog({ themes: normalizedThemes });
        const revision = Date.now();
        await chrome.storage.local.set({
          [STORAGE_LOCAL_KEY]: catalog,
          [STORAGE_REV_KEY]: revision,
          [STORAGE_VER_KEY]: Number(themeV2.THEME_CATALOG_V2_SCHEMA_VERSION || 1)
        });
        try {
          await chrome.storage.sync.set({ raritySkin: activeThemeId, activeRaritySkinId: activeThemeId });
        } catch {}
        try {
          await chrome.runtime.sendMessage({
            type: 'theme_catalog_updated',
            themeCatalogV2: catalog,
            themeCatalogV2Revision: revision,
            activeThemeId
          });
        } catch {}
        lastSavedSignatureRef.current = signature;
      } catch (error) {
        console.error('Editor save failed', error);
      }
    }, 300);

    return () => {
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    };
  }, [themes, selectedThemeIndex]);

  const undo = () => {
    if (historyPointer > 0) {
      const prev = history[historyPointer - 1];
      setThemes(JSON.parse(JSON.stringify(prev.themes)));
      setSelectedThemeIndex(prev.selectedThemeIndex);
      setSelectedTierIndex(prev.selectedTierIndex);
      setHistoryPointer(historyPointer - 1);
    }
  };

  const redo = () => {
    if (historyPointer < history.length - 1) {
      const next = history[historyPointer + 1];
      setThemes(JSON.parse(JSON.stringify(next.themes)));
      setSelectedThemeIndex(next.selectedThemeIndex);
      setSelectedTierIndex(next.selectedTierIndex);
      setHistoryPointer(historyPointer + 1);
    }
  };

  const updateValue = (key, value) => {
    const nextThemes = applyEditToThemes(themes, selectedThemeIndex, selectedTierIndex, key, value);
    commitChange(nextThemes);
  };

  const previewValueNoHistory = (key, value) => {
    pickerPreviewActiveRef.current = true;
    setThemes((prev) => applyEditToThemes(prev, selectedThemeIndex, selectedTierIndex, key, value));
  };

  const commitPickerValue = (key, value) => {
    pickerPreviewActiveRef.current = false;
    const nextThemes = applyEditToThemes(themes, selectedThemeIndex, selectedTierIndex, key, value);
    commitChange(nextThemes);
  };

  const deleteTier = (idx) => {
    if (currentTheme.tiers.length <= 1) return;
    const nextThemes = JSON.parse(JSON.stringify(themes));
    nextThemes[selectedThemeIndex].tiers.splice(idx, 1);
    const nextTierIdx = Math.min(selectedTierIndex, nextThemes[selectedThemeIndex].tiers.length - 1);
    commitChange(nextThemes, selectedThemeIndex, nextTierIdx);
  };

  const handleDragStart = (e, index) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e) => e.preventDefault();

  const handleDrop = (e, targetIndex) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === targetIndex) return;
    const nextThemes = JSON.parse(JSON.stringify(themes));
    const tiers = nextThemes[selectedThemeIndex].tiers;
    const [removed] = tiers.splice(draggedIndex, 1);
    tiers.splice(targetIndex, 0, removed);
    commitChange(nextThemes, selectedThemeIndex, targetIndex);
    setDraggedIndex(null);
  };

  const addSkin = () => {
    const nextThemes = JSON.parse(JSON.stringify(themes));
    nextThemes.push({
      id: genId('theme'),
      name: `New Skin ${nextThemes.length + 1}`,
      description: '',
      tiers: [{ id: genId('tier'), name: 'Base', body: '#ffffff', border: '#cccccc', text: '#000000', radius: 8, borderWidth: 2, opacity: 100, textOpacity: 100, effect: 'none' }]
    });
    commitChange(nextThemes, nextThemes.length - 1, 0);
  };

  const duplicateSkin = () => {
    const nextThemes = JSON.parse(JSON.stringify(themes));
    const original = nextThemes[selectedThemeIndex];
    const copy = { ...JSON.parse(JSON.stringify(original)), id: genId('theme'), name: `${original.name} (Copy)` };
    copy.tiers = copy.tiers.map((tier) => ({ ...tier, id: genId('tier') }));
    nextThemes.push(copy);
    commitChange(nextThemes, nextThemes.length - 1, selectedTierIndex);
  };

  const removeSkin = () => {
    if (themes.length <= 1) return;
    const nextThemes = JSON.parse(JSON.stringify(themes));
    nextThemes.splice(selectedThemeIndex, 1);
    const nextIdx = Math.max(0, selectedThemeIndex - 1);
    commitChange(nextThemes, nextIdx, 0);
  };

  const nextBg = () => setBgIndex((prev) => (prev + 1) % BACKGROUNDS.length);
  const prevBg = () => setBgIndex((prev) => (prev - 1 + BACKGROUNDS.length) % BACKGROUNDS.length);

  const exportThemes = () => {
    try {
      const normalizedThemes = normalizeThemesForEditor(themes);
      const payload = {
        type: 'timestamp-chatter-theme-catalog-v2',
        schemaVersion: Number(themeV2?.THEME_CATALOG_V2_SCHEMA_VERSION || 1),
        exportedAt: new Date().toISOString(),
        themes: normalizedThemes
      };
      const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `timestamp-chatter-themes-${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Theme export failed', error);
    }
  };

  const importThemesFromFile = async (event) => {
    const file = event?.target?.files?.[0];
    if (!file) return;
    try {
      const text = await file.text();
      const parsed = JSON.parse(text);
      const rawThemes = Array.isArray(parsed) ? parsed : parsed?.themes;
      const importedThemes = normalizeThemesForEditor(rawThemes);
      if (!importedThemes.length) {
        throw new Error('No themes found in import file');
      }
      setThemes(importedThemes);
      setSelectedThemeIndex(0);
      setSelectedTierIndex(0);
      setHistory([{ themes: JSON.parse(JSON.stringify(importedThemes)), selectedThemeIndex: 0, selectedTierIndex: 0 }]);
      setHistoryPointer(0);
      lastSavedSignatureRef.current = '';
    } catch (error) {
      console.error('Theme import failed', error);
      try { alert(`Import failed: ${error?.message || 'Invalid JSON file'}`); } catch {}
    } finally {
      if (event?.target) event.target.value = '';
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 p-4 md:p-8 font-sans text-slate-900">
      <input
        ref={importFileInputRef}
        type="file"
        accept=".json,application/json"
        className="hidden"
        onChange={importThemesFromFile}
      />
      <div className="max-w-6xl mx-auto space-y-6">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <div className="flex items-center gap-6">
            <div>
              <h1 className="text-2xl font-bold flex items-center gap-2">
                <Palette className="text-indigo-600" />
                Theme Editor
              </h1>
            </div>
            <div className="h-10 w-px bg-slate-200" />
            <div className="flex gap-2">
              <button onClick={undo} disabled={historyPointer === 0} className={`${SOFT_ICON_BUTTON} disabled:opacity-20`} title="Undo"><RotateCcw size={20} /></button>
              <button onClick={redo} disabled={historyPointer === history.length - 1} className={`${SOFT_ICON_BUTTON} disabled:opacity-20`} title="Redo"><RotateCw size={20} /></button>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-black uppercase text-slate-400 ml-1 tracking-widest">Theme Management</label>
            <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-xl">
              {isEditingName ? (
                <div className="flex items-center gap-1 flex-1 min-w-[200px]">
                  <input
                    value={editNameValue}
                    onChange={(e) => setEditNameValue(e.target.value)}
                    className="bg-white border-none rounded-lg px-2 py-1 text-sm font-bold focus:ring-2 focus:ring-indigo-500 outline-none w-full"
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        const nt = JSON.parse(JSON.stringify(themes));
                        nt[selectedThemeIndex].name = editNameValue;
                        commitChange(nt);
                        setIsEditingName(false);
                      }
                    }}
                  />
                  <button onClick={() => setIsEditingName(false)} className={`p-1.5 text-emerald-600 ${THEME_MGMT_BUTTON}`}><Check size={16} /></button>
                </div>
              ) : (
                <>
                  <select
                    value={selectedThemeIndex}
                    onChange={(e) => { setSelectedThemeIndex(parseInt(e.target.value, 10)); setSelectedTierIndex(0); }}
                    className="bg-transparent border-none px-3 py-1 text-sm font-bold outline-none cursor-pointer min-w-[140px]"
                  >
                    {themes.map((theme, idx) => <option key={theme.id || idx} value={idx}>{theme.name}</option>)}
                  </select>
                  <button onClick={() => { setEditNameValue(currentTheme.name); setIsEditingName(true); }} className={`p-2 ${THEME_MGMT_BUTTON} text-slate-500`}><Edit3 size={18} /></button>
                </>
              )}
              <div className="h-6 w-px bg-slate-300 mx-1" />
              <button
                onClick={() => importFileInputRef.current?.click()}
                className={`px-2 py-1 text-xs font-bold ${THEME_MGMT_BUTTON}`}
                title="Import Theme File"
              >
                Import
              </button>
              <button
                onClick={exportThemes}
                className={`px-2 py-1 text-xs font-bold ${THEME_MGMT_BUTTON}`}
                title="Export Theme File"
              >
                Export
              </button>
              <div className="h-6 w-px bg-slate-300 mx-1" />
              <button onClick={addSkin} className={`p-2 ${THEME_MGMT_BUTTON} text-indigo-600`} title="Add Skin"><Plus size={18} /></button>
              <button onClick={duplicateSkin} className={`p-2 ${THEME_MGMT_BUTTON} text-slate-600`} title="Duplicate Skin"><Copy size={18} /></button>
              <button onClick={removeSkin} disabled={themes.length <= 1} className={`p-2 ${THEME_MGMT_BUTTON} text-red-500 disabled:opacity-20`} title="Remove Skin"><Trash2 size={18} /></button>
            </div>
          </div>
        </header>

        <main className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-7 space-y-4 order-2 lg:order-1 lg:sticky lg:top-8">
             <div className={`rounded-3xl overflow-hidden shadow-2xl border-8 border-slate-800 flex items-center justify-center relative transition-all duration-500 bg-cover bg-center ${showAllTiers ? 'h-auto min-h-[600px] py-20' : 'h-[500px]'}`} style={{ backgroundImage: currentBg.type === 'image' ? `url(${currentBg.value})` : currentBg.value }}>
              {currentBg.type === 'image' && <div className="absolute inset-0 bg-black/20" />}
              <div className="absolute top-0 left-0 w-full h-12 bg-black/20 border-b border-white/5 flex items-center px-4 z-20">
                <div className="flex gap-2"><div className="w-3 h-3 rounded-full bg-slate-700/50"></div><div className="w-3 h-3 rounded-full bg-slate-700/50"></div><div className="w-3 h-3 rounded-full bg-slate-700/50"></div></div>
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <button onClick={() => setShowAllTiers(!showAllTiers)} className={`pointer-events-auto flex items-center gap-2 px-3 py-1.5 rounded-[14px] text-[10px] font-black uppercase tracking-widest ${SOFT_BUTTON_BASE} ${SOFT_BUTTON_HOVER}`}>
                    <Layers size={14} /> {showAllTiers ? 'Collapse Tiers' : 'Show All Tiers'}
                  </button>
                </div>
                <div className="flex-1" />
                <div className="flex gap-2 absolute left-20 top-1/2 -translate-y-1/2 z-30">
                  <button onClick={prevBg} className={`${SOFT_ICON_BUTTON} p-1.5`}><ChevronLeft size={16} /></button>
                  <button onClick={nextBg} className={`${SOFT_ICON_BUTTON} p-1.5`}><ChevronRight size={16} /></button>
                </div>
              </div>
              <div className="w-full h-full flex flex-col items-center justify-center p-8 z-10 gap-6">
                {showAllTiers ? currentTheme.tiers.map((tier, idx) => (
                  <NotificationPreview key={tier.id || idx} tier={tier} tierIndex={idx} isSelected={selectedTierIndex === idx} onClick={() => setSelectedTierIndex(idx)} onDelete={deleteTier} onDragStart={handleDragStart} onDragOver={handleDragOver} onDrop={handleDrop} showAllTiers={showAllTiers} />
                )) : (
                  <NotificationPreview tier={currentTier} tierIndex={selectedTierIndex} isSelected={true} showAllTiers={false} onDelete={deleteTier} onDragStart={() => {}} onDragOver={() => {}} onDrop={() => {}} />
                )}
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 space-y-6 order-1 lg:order-2">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
              <h2 className="text-lg font-bold mb-4 flex items-center gap-2 text-slate-800 uppercase tracking-tighter text-sm"><Layout className="w-5 h-5 text-indigo-500" /> Select Tier</h2>
              <div className="flex flex-wrap gap-2 mb-8">
                {currentTheme.tiers.map((tier, idx) => (
                  <button key={tier.id || idx} onClick={() => setSelectedTierIndex(idx)} className={`px-3 py-2 min-w-[80px] rounded-[14px] border-0 transition-all text-center ${selectedTierIndex === idx ? 'bg-gradient-to-b from-white to-slate-100 text-slate-800 ring-2 ring-slate-200' : 'bg-gradient-to-b from-white to-slate-100 text-slate-600 hover:to-slate-50'}`}>
                    <div className="text-[9px] font-black uppercase tracking-tighter opacity-70">{getVisualTierNumber(idx)}</div>
                    <div className="text-[10px] font-black uppercase tracking-tighter">{tier.name}</div>
                  </button>
                ))}
                <button onClick={() => { const nt = JSON.parse(JSON.stringify(themes)); nt[selectedThemeIndex].tiers.push({ ...currentTier, id: genId('tier'), name: 'New Tier' }); commitChange(nt, selectedThemeIndex, nt[selectedThemeIndex].tiers.length - 1); }} className={`px-3 py-2 ${SOFT_PILL_BUTTON}`}><Plus size={16} /></button>
              </div>
              <h2 className="text-lg font-bold mb-4 flex items-center gap-2 border-t pt-6 text-slate-800 uppercase tracking-tighter text-sm"><Sliders className="w-5 h-5 text-indigo-500" /> Tier Style</h2>
              <div className="space-y-4">
                <div className="p-4 bg-indigo-50/30 border border-indigo-100/50 rounded-xl space-y-3">
                   <label className="text-[10px] font-black uppercase text-indigo-600 tracking-wider flex items-center gap-2"><Sparkles size={12} /> Visual Effect</label>
                   <div className="grid grid-cols-3 gap-2">
                     {EFFECTS.map(effect => (
                       <button key={effect.id} onClick={() => updateValue('effect', effect.id)} className={`flex flex-col items-center gap-2 px-3 py-3 rounded-[14px] text-[10px] font-bold transition-all border-0 ${currentTier.effect === effect.id ? 'bg-gradient-to-b from-white to-slate-100 text-slate-800 ring-2 ring-slate-200' : 'bg-gradient-to-b from-white to-slate-100 text-slate-600 hover:to-slate-50'}`}>{effect.icon}{effect.label}</button>
                     ))}
                   </div>
                </div>
                <div className="p-4 bg-slate-50 rounded-xl space-y-4">
                  <div className="flex items-center justify-between"><label className="text-[10px] font-black uppercase text-slate-400">Tier Name</label><input type="text" value={currentTier.name} onChange={(e) => updateValue('name', e.target.value)} className="bg-white border border-slate-200/80 rounded-lg px-2 py-1 text-xs font-bold w-32 focus:outline-none focus:ring-0 focus:shadow-none shadow-none appearance-none" /></div>
                  <div className="flex items-center justify-between"><label className="text-[10px] font-black uppercase text-slate-400">Text Color</label><input type="color" value={currentTier.text} onInput={(e) => previewValueNoHistory('text', e.target.value)} onBlur={(e) => commitPickerValue('text', e.target.value)} className="w-6 h-6 rounded-md cursor-pointer bg-transparent border-none" /></div>
                  <div className="flex items-center justify-between"><label className="text-[10px] font-black uppercase text-slate-400">Body Color</label><input type="color" value={currentTier.body} onInput={(e) => previewValueNoHistory('body', e.target.value)} onBlur={(e) => commitPickerValue('body', e.target.value)} className="w-6 h-6 rounded-md cursor-pointer bg-transparent border-none" /></div>
                  <div className="space-y-1"><div className="flex justify-between items-center text-[10px] font-bold text-slate-500"><span>Body Opacity</span><span className="text-indigo-600">{currentTier.opacity}%</span></div><input type="range" min="0" max="100" value={currentTier.opacity} onChange={(e) => updateValue('opacity', parseInt(e.target.value, 10))} className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600" /></div>
                </div>
                <div className="p-4 bg-slate-50 rounded-xl space-y-4">
                  <div className="flex items-center justify-between"><label className="text-[10px] font-black uppercase text-slate-400">Border Color</label><input type="color" value={currentTier.border} onInput={(e) => previewValueNoHistory('border', e.target.value)} onBlur={(e) => commitPickerValue('border', e.target.value)} className="w-6 h-6 rounded-md cursor-pointer bg-transparent border-none" /></div>
                  <div className="space-y-1"><div className="flex justify-between items-center text-[10px] font-bold text-slate-500"><span>Border Opacity</span><span className="text-indigo-600">{Math.round(currentTier.borderOpacity ?? 100)}%</span></div><input type="range" min="0" max="100" value={Math.round(currentTier.borderOpacity ?? 100)} onChange={(e) => updateValue('borderOpacity', parseInt(e.target.value, 10))} className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600" /></div>
                </div>
                <div className="p-4 bg-slate-50 rounded-xl space-y-1">
                  <div className="flex justify-between items-center text-[10px] font-bold text-slate-500"><span>Global Radius</span><span className="text-indigo-600">{currentTier.radius}px</span></div>
                  <input type="range" min="0" max="40" value={currentTier.radius} onChange={(e) => updateValue('radius', parseInt(e.target.value, 10))} className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600" />
                </div>
                <div className="p-4 bg-slate-50 rounded-xl space-y-1">
                  <div className="flex justify-between items-center text-[10px] font-bold text-slate-500"><span>Border Thickness</span><span className="text-indigo-600">{currentTier.borderWidth}px</span></div>
                  <input type="range" min="0" max="10" step="0.1" value={currentTier.borderWidth} onChange={(e) => updateValue('borderWidth', parseFloat(e.target.value))} className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600" />
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
