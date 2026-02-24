import React from 'react';
import { EffectLayer } from './EffectLayer.jsx';
import { hexToRgba } from './theme-ui-utils.js';

export function NotificationCard({
  tier,
  text,
  likesLabel,
  avatarUrl,
  author = '@User',
  compact = false,
  mode = 'live',
  contentMode,
  isSelected = false,
  showTierControls = false,
  onDeleteTier,
  onDragStart,
  onDragOver,
  onDrop,
  tierIndex = 0,
  draggable = false,
  className = '',
  onClick,
  showMeta = true,
  runtimeConfig = null,
  style = {}
}) {
  if (!tier) return null;
  const radius = Number(tier.radius ?? 8);
  const borderWidth = Number(tier.borderWidth ?? 2);
  const body = tier.body || '#222222';
  const border = tier.border || '#ffffff';
  const borderOpacity = Number(tier.borderOpacity ?? 100);
  const borderStroke = hexToRgba(border, borderOpacity);
  const textColor = tier.text || '#ffffff';
  const opacity = Number(tier.opacity ?? 90);
  const textOpacity = Number(tier.textOpacity ?? 100);
  const isEditor = mode === 'editor';
  const usesLiveLayout = (contentMode || mode) === 'live';
  const liveAvatarSize = Math.max(24, Math.min(72, Number(runtimeConfig?.overlayAvatarSize ?? 40)));
  const avatarPx = usesLiveLayout ? liveAvatarSize : 32;
  const rootClass = (isEditor && !usesLiveLayout)
    ? `relative flex items-center group w-full max-w-[460px] transition-all ${className}`
    : `${isEditor ? 'relative flex items-center group transition-all' : ''} ${className}`.trim();
  const cardInnerClass = (isEditor && !usesLiveLayout)
    ? `w-full transition-all duration-300 shadow-2xl relative flex flex-col gap-1 overflow-hidden shrink-0 cursor-pointer ${isSelected ? '' : 'hover:scale-[1.02] active:scale-95'}`
    : `w-auto max-w-full shadow-2xl relative flex flex-col gap-1 overflow-hidden shrink-0 ${isEditor ? `cursor-pointer ${isSelected ? '' : 'hover:scale-[1.02] active:scale-95'} transition-all duration-300` : ''}`;
  const displayLikesLabel = String(likesLabel || '').trim();
  const displayAuthorLabel = String(author || '').trim();
  const showAuthorInLiveMeta = Boolean(runtimeConfig?.showAuthorInNotifications ?? false);
  const liveMetaParts = [];
  if (showAuthorInLiveMeta && displayAuthorLabel) {
    liveMetaParts.push(displayAuthorLabel);
  }
  if (displayLikesLabel) {
    liveMetaParts.push(displayLikesLabel);
  }
  const liveMetaText = liveMetaParts.join(' • ');

  return (
    <div
      draggable={Boolean(isEditor && draggable)}
      onDragStart={isEditor ? (e) => onDragStart?.(e, tierIndex) : undefined}
      onDragOver={isEditor ? (e) => onDragOver?.(e, tierIndex) : undefined}
      onDrop={isEditor ? (e) => onDrop?.(e, tierIndex) : undefined}
      className={rootClass}
    >
      {isEditor && isSelected && (
        <div className="absolute -left-6 w-3 h-3 bg-white rounded-full shadow-[0_0_10px_white] z-20 transition-all animate-pulse" />
      )}
      <div
        onClick={onClick}
        className={cardInnerClass}
        style={{
          ...style,
          background: hexToRgba(body, opacity),
          backgroundImage: 'none',
          borderColor: 'transparent',
          borderWidth: '0px',
          borderStyle: 'none',
          borderRadius: `${radius}px`,
          boxSizing: 'border-box',
          padding: compact ? '8px 12px' : (usesLiveLayout ? '10px 16px' : '12px 16px'),
          color: textColor
        }}
        data-tc-tier-body={body}
        data-tc-tier-border={border}
      >
        <EffectLayer effect={tier.effect} color={border} bodyColor={body} />
        {borderWidth > 0 && (
          <div
            className="absolute inset-0 pointer-events-none z-20 rounded-[inherit]"
            style={{
              boxShadow: `inset 0 0 0 ${borderWidth}px ${borderStroke}`
            }}
          />
        )}
        {isEditor && showTierControls && (
          <div className="absolute top-2 right-2 flex flex-col items-center gap-1 z-30 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); onDeleteTier?.(tierIndex); }}
              className="p-1 rounded-full bg-black/20 hover:bg-red-500 text-white transition-all shadow-sm"
              title="Remove Tier"
            >
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M6 6 18 18" />
                <path d="M18 6 6 18" />
              </svg>
            </button>
            <div
              className="p-1 cursor-grab active:cursor-grabbing text-white/40 hover:text-white transition-colors"
              title="Drag to reorder"
            >
              <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true">
                <circle cx="9" cy="5" r="1.6" />
                <circle cx="15" cy="5" r="1.6" />
                <circle cx="9" cy="12" r="1.6" />
                <circle cx="15" cy="12" r="1.6" />
                <circle cx="9" cy="19" r="1.6" />
                <circle cx="15" cy="19" r="1.6" />
              </svg>
            </div>
          </div>
        )}
        <div className={`flex gap-3 relative z-10 items-center w-full`} style={{ fontFamily: 'Roboto, Arial, sans-serif' }}>
          <div
            className="rounded-full bg-slate-600 ring-1 ring-white/10 shrink-0 overflow-hidden shadow-inner"
            style={{ width: `${avatarPx}px`, height: `${avatarPx}px` }}
          >
            {avatarUrl ? <img src={avatarUrl} alt="avatar" className="w-full h-full object-cover" /> : null}
          </div>
          <div className={`flex-1 min-w-0 flex flex-col gap-1 ${(isEditor && showTierControls) ? 'pr-6' : ''}`}>
            <p
              className={`${compact ? 'text-xs' : 'text-[13px]'} leading-snug font-medium ${usesLiveLayout ? 'line-clamp-2' : ''}`}
              style={{ color: hexToRgba(textColor, textOpacity) }}
            >
              {text}
            </p>
            {showMeta && (
              usesLiveLayout ? (
                <div
                  className="text-[10px] font-bold tracking-tight opacity-70 truncate"
                  style={{ color: textColor }}
                >
                  {liveMetaText}
                </div>
              ) : (
                <div
                  className="flex items-center justify-between text-[10px] font-bold tracking-tight opacity-60"
                  style={{ color: textColor }}
                >
                  <div className="flex gap-2 min-w-0">
                    <span className="truncate">{author}</span>
                    <span>•</span>
                    <span className="truncate">{displayLikesLabel}</span>
                  </div>
                  <div className="flex items-center gap-1 tracking-widest ml-2 truncate">{tier.name}</div>
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
