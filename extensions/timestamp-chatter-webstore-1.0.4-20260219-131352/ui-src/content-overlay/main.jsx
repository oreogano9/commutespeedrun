import React from 'react';
import { createRoot } from 'react-dom/client';
import '../shared/shared.css';
import { NotificationCard } from '../shared/NotificationCard.jsx';

const LANE_KEYS = ['top-left', 'top-right', 'bottom-left', 'bottom-right'];
const laneRoots = new Map();
let mountedOverlayElement = null;
let overlayCallbacks = {};
let overlayState = {
  lanes: Object.fromEntries(LANE_KEYS.map((k) => [k, []])),
  globalVisible: true,
  runtimeConfig: {}
};
let themeCatalogV2 = null;
let activeThemeId = 'default';

function ensureLaneContainers(overlayElement) {
  if (!overlayElement) return [];
  const results = [];
  for (const key of LANE_KEYS) {
    let lane = overlayElement.querySelector(`:scope > .overlay-lane.${CSS.escape(key)}`);
    if (!lane) {
      lane = document.createElement('div');
      lane.className = `overlay-lane ${key}`;
      overlayElement.appendChild(lane);
    }
    results.push({ key, lane });
  }
  return results;
}

function getRootForLane(laneElement) {
  let root = laneRoots.get(laneElement);
  if (!root) {
    root = createRoot(laneElement);
    laneRoots.set(laneElement, root);
  }
  return root;
}

function renderAllLanes() {
  if (!mountedOverlayElement) return;
  const lanes = ensureLaneContainers(mountedOverlayElement);
  for (const { key, lane } of lanes) {
    const root = getRootForLane(lane);
    const cards = Array.isArray(overlayState?.lanes?.[key]) ? overlayState.lanes[key] : [];
    root.render(
      <LaneCards
        laneKey={key}
        cards={cards}
        runtimeConfig={overlayState.runtimeConfig || {}}
        onCardClick={(cardId) => overlayCallbacks?.onCardClick?.(cardId)}
      />
    );
  }
}

function phaseClass(phase) {
  if (phase === 'hiding') return 'hiding';
  if (phase === 'visible') return 'visible';
  if (phase === 'entering') return '';
  return '';
}

function LaneCards({ cards, runtimeConfig, onCardClick }) {
  return (
    <>
      {cards.map((entry) => (
        <div
          key={entry.id}
          className={[
            'overlay-comment',
            'tc-react-hosted-card',
            phaseClass(entry.phase),
            entry.accentClass || '',
            entry.rubberbandPulse ? 'accent-rubberband' : ''
          ].filter(Boolean).join(' ')}
          style={{ order: String(entry.order ?? 0) }}
        >
          <NotificationCard
            mode="live"
            tier={entry.tier}
            text={entry.comment?.text || ''}
            author={entry.comment?.author || '@User'}
            avatarUrl={entry.comment?.avatar || ''}
            likesLabel={entry.likesLabel || ''}
            showMeta={entry.showMeta !== false}
            className="tc-live-react-card-frame"
            runtimeConfig={runtimeConfig}
            onClick={() => onCardClick?.(entry.id)}
          />
        </div>
      ))}
    </>
  );
}

function mountOverlay(overlayElement, callbacks = {}) {
  mountedOverlayElement = overlayElement || null;
  overlayCallbacks = callbacks || {};
  if (!mountedOverlayElement) return;
  renderAllLanes();
}

function unmountOverlay() {
  for (const [lane, root] of laneRoots.entries()) {
    try {
      root.unmount();
    } catch {}
    laneRoots.delete(lane);
  }
  mountedOverlayElement = null;
}

function setOverlayState(nextState) {
  overlayState = {
    ...overlayState,
    ...(nextState || {}),
    lanes: nextState?.lanes || overlayState.lanes
  };
  renderAllLanes();
}

function setThemeCatalog(nextCatalog) {
  themeCatalogV2 = nextCatalog || null;
}

function setActiveThemeId(nextId) {
  activeThemeId = String(nextId || 'default');
}

function setRuntimeDisplayConfig(nextConfig) {
  overlayState = {
    ...overlayState,
    runtimeConfig: { ...(overlayState.runtimeConfig || {}), ...(nextConfig || {}) }
  };
  renderAllLanes();
}

globalThis.TimestampChatterReactOverlay = {
  mountOverlay,
  unmountOverlay,
  setOverlayState,
  setThemeCatalog,
  setActiveThemeId,
  updateRuntimeConfig: setRuntimeDisplayConfig,
  hasBridge: true
};

// Backward-compat alias for one release.
globalThis.TimestampChatterReactNotifications = {
  hasBridge: true,
  mountCard() {},
  unmountCard() {},
  mountOverlay,
  unmountOverlay,
  setOverlayState,
  setThemeCatalog,
  setActiveThemeId,
  updateRuntimeConfig: setRuntimeDisplayConfig
};
