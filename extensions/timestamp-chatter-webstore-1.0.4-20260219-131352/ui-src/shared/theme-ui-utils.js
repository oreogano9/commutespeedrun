export const EFFECTS = [
  { id: 'none', label: 'Plain' },
  { id: 'galaxy', label: 'Galaxy' },
  { id: 'aurora', label: 'Aurora' }
];

export function hexToRgba(hex, alphaPercent = 100) {
  const safe = String(hex || '#ffffff').replace('#', '');
  const parsedR = parseInt(safe.slice(0, 2), 16);
  const parsedG = parseInt(safe.slice(2, 4), 16);
  const parsedB = parseInt(safe.slice(4, 6), 16);
  const r = Number.isNaN(parsedR) ? 255 : parsedR;
  const g = Number.isNaN(parsedG) ? 255 : parsedG;
  const b = Number.isNaN(parsedB) ? 255 : parsedB;
  return `rgba(${r}, ${g}, ${b}, ${Math.max(0, Math.min(100, alphaPercent)) / 100})`;
}
