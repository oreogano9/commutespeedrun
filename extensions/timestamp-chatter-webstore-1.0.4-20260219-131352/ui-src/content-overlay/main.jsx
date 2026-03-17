import React from 'react';
import { createRoot } from 'react-dom/client';
import overlayCssText from '../shared/shared.css?inline';
import { NotificationCard } from '../shared/NotificationCard.jsx';

const LANE_KEYS = ['top-left', 'top-right', 'bottom-left', 'bottom-right'];
const laneRoots = new Map();
let mountedOverlayElement = null;
let mountedOverlayRootElement = null;
let overlayCallbacks = {};
let overlayState = {
  lanes: Object.fromEntries(LANE_KEYS.map((k) => [k, []])),
  globalVisible: true,
  runtimeConfig: {}
};
let themeCatalogV2 = null;
let activeThemeId = 'default';
const SHADOW_HOST_CLASS = 'tc-react-overlay-shadow-host';
const SHADOW_ROOT_CLASS = 'tc-react-overlay-root';
const SHADOW_STYLE_ATTR = 'data-tc-react-overlay-style';
const SHADOW_LAYOUT_CSS = `
:host {
  position: absolute;
  inset: 0;
  display: block;
  pointer-events: none;
}

.${SHADOW_ROOT_CLASS} {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.overlay-lane {
  position: absolute;
  display: flex;
  flex-direction: column;
  gap: 12px;
  align-items: flex-start;
  width: calc(100% - 8rem);
  max-width: calc(100% - 8rem);
  overflow: visible;
  pointer-events: none;
}

.overlay-lane.hidden {
  display: none;
}

.overlay-lane.custom-position {
  transition: left 0.04s linear, top 0.04s linear;
}

.overlay-lane.bottom-left {
  bottom: 4rem;
  left: 4rem;
  align-items: flex-start;
}

.overlay-lane.top-left {
  top: 4rem;
  left: 4rem;
  align-items: flex-start;
  transform-origin: top left;
}

.overlay-lane.bottom-right {
  bottom: 4rem;
  right: 4rem;
  align-items: flex-end;
  transform-origin: bottom right;
}

.overlay-lane.top-right {
  top: 4rem;
  right: 4rem;
  align-items: flex-end;
  transform-origin: top right;
}

:host-context(.html5-video-player:not(.ytp-autohide)) .overlay-lane.bottom-left,
:host-context(.html5-video-player:not(.ytp-autohide)) .overlay-lane.bottom-right {
  bottom: 8rem;
}

.overlay-lane.bottom-left .overlay-comment,
.overlay-lane.top-left .overlay-comment {
  transform-origin: left center;
}

.overlay-lane.bottom-right .overlay-comment,
.overlay-lane.top-right .overlay-comment {
  transform-origin: right center;
}

.overlay-comment {
  --overlay-tier-scale: 1;
  display: flex;
  align-items: center;
  margin-top: 0;
  margin-bottom: 0;
  opacity: 0;
  transform: translate3d(0, 10px, 0);
  scale: var(--overlay-tier-scale);
  transition: opacity 0.25s ease, transform 0.25s ease, scale 0.25s ease;
  pointer-events: auto;
  cursor: pointer;
  isolation: isolate;
  contain: paint;
  backface-visibility: hidden;
  will-change: opacity, transform;
  outline: 1px solid transparent;
}

.overlay-comment.visible {
  opacity: 1;
  transform: translate3d(0, 0, 0);
}

.overlay-comment.hiding {
  transition: opacity 1s ease;
  opacity: 0;
  transform: translate3d(0, 0, 0);
  scale: var(--overlay-tier-scale);
}
`;

function ensureShadowOverlayRoot(overlayElement) {
  if (!overlayElement) return null;
  let host = overlayElement.querySelector(`:scope > .${SHADOW_HOST_CLASS}`);
  if (!host) {
    host = document.createElement('div');
    host.className = SHADOW_HOST_CLASS;
    overlayElement.insertBefore(host, overlayElement.firstChild || null);
  }

  const shadowRoot = host.shadowRoot || host.attachShadow({ mode: 'open' });
  let style = shadowRoot.querySelector(`style[${SHADOW_STYLE_ATTR}]`);
  if (!style) {
    style = document.createElement('style');
    style.setAttribute(SHADOW_STYLE_ATTR, '1');
    style.textContent = `${SHADOW_LAYOUT_CSS}\n${overlayCssText}`;
    shadowRoot.appendChild(style);
  }

  let root = shadowRoot.querySelector(`.${SHADOW_ROOT_CLASS}`);
  if (!root) {
    root = document.createElement('div');
    root.className = SHADOW_ROOT_CLASS;
    shadowRoot.appendChild(root);
  }

  return root;
}

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
  if (!mountedOverlayRootElement) return;
  const lanes = ensureLaneContainers(mountedOverlayRootElement);
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

function clampNumber(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function getStackCardOpacity(stackIndexFromAnchor, runtimeConfig) {
  const fadeEnabled = runtimeConfig?.stackOpacityFadeEnabled !== false;
  if (!fadeEnabled) {
    return 1;
  }
  const fadeStart = clampNumber(
    Number(runtimeConfig?.stackOpacityFadeStart ?? 6),
    0,
    50
  );
  const stepPercent = clampNumber(
    Number(runtimeConfig?.stackOpacityFadeStepPercent ?? 20),
    0,
    25
  );
  if (stackIndexFromAnchor < fadeStart || stepPercent <= 0) {
    return 1;
  }
  const steps = stackIndexFromAnchor - fadeStart + 1;
  const cumulativePercentDrop =
    (steps * stepPercent) + ((steps - 1) * steps) / 2;
  return clampNumber(1 - cumulativePercentDrop / 100, 0, 1);
}

function getAnchorStackIndex(index, total, laneKey) {
  const isBottomLane = laneKey === 'bottom-left' || laneKey === 'bottom-right';
  if (isBottomLane) {
    return Math.max(0, total - 1 - index);
  }
  return index;
}

function getCardOpacity(entry, index, total, laneKey, runtimeConfig) {
  const baseOpacity = getStackCardOpacity(
    getAnchorStackIndex(index, total, laneKey),
    runtimeConfig
  );
  return entry?.phase === 'hiding' ? 0 : baseOpacity;
}

function LaneCards({ laneKey, cards, runtimeConfig, onCardClick }) {
  return (
    <>
      {cards.map((entry, index) => (
        <div
          key={entry.id}
          className={[
            'overlay-comment',
            'tc-react-hosted-card',
            phaseClass(entry.phase),
            entry.accentClass || '',
            entry.rubberbandPulse ? 'accent-rubberband' : '',
            entry.rubberbandPulse ? 'accent-landing-glow' : ''
          ].filter(Boolean).join(' ')}
          style={{
            order: String(entry.order ?? 0),
            opacity: getCardOpacity(entry, index, cards.length, laneKey, runtimeConfig),
            pointerEvents: 'auto'
          }}
          onClick={() => onCardClick?.(entry.id)}
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
          />
        </div>
      ))}
    </>
  );
}

function mountOverlay(overlayElement, callbacks = {}) {
  mountedOverlayElement = overlayElement || null;
  mountedOverlayRootElement = ensureShadowOverlayRoot(mountedOverlayElement);
  overlayCallbacks = callbacks || {};
  if (!mountedOverlayRootElement) return;
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
  mountedOverlayRootElement = null;
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

function getLaneElement(laneKey) {
  if (!mountedOverlayRootElement) {
    return null;
  }
  const safeKey = String(laneKey || '');
  return mountedOverlayRootElement.querySelector(`:scope > .overlay-lane.${CSS.escape(safeKey)}`);
}

globalThis.TimestampChatterReactOverlay = {
  mountOverlay,
  unmountOverlay,
  setOverlayState,
  setThemeCatalog,
  setActiveThemeId,
  updateRuntimeConfig: setRuntimeDisplayConfig,
  getLaneElement,
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
  updateRuntimeConfig: setRuntimeDisplayConfig,
  getLaneElement
};
