import React, { useMemo } from 'react';

const CSS_EFFECTS = new Set([
  'neon-pulse','scanlines','frost','plasma','rainbow','prism-sheen','holo-grid','ember-glow','comet-trail',
  'velvet-bloom','crystal-shift','ac-leaf-drift','ac-petal-breeze','ac-bell-shimmer','ac-river-ripple',
  'ac-sunbeam','ac-cloud-soft','ac-woodgrain','ac-paper-fiber','ac-night-cricket','ac-museum-glow'
]);

export function EffectLayer({ effect, color, bodyColor }) {
  const galaxyStars = useMemo(() => {
    if (effect !== 'galaxy') return [];
    return Array.from({ length: 180 }, (_, i) => ({
      key: i,
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      animationDelay: `${Math.random() * 4}s`,
      boxShadow: Math.random() > 0.9 ? `0 0 6px 1px ${color}` : 'none',
      opacity: Math.random() * 0.5 + 0.3
    }));
  }, [effect, color, bodyColor]);

  const shaderBlobs = useMemo(() => {
    if (effect !== 'shader') return [];
    return Array.from({ length: 4 }, (_, i) => ({
      key: i,
      width: 38 + Math.random() * 28,
      height: 26 + Math.random() * 20,
      top: 10 + Math.random() * 70,
      left: 8 + Math.random() * 76,
      duration: 8 + Math.random() * 8,
      delay: Math.random() * 4,
      opacity: 0.18 + Math.random() * 0.2
    }));
  }, [effect, bodyColor]);

  if (!effect || effect === 'none') return null;
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-[inherit]">
      {CSS_EFFECTS.has(effect) && (
        <div
          className={`tc-css-effect tc-css-effect-${effect} absolute inset-0 rounded-[inherit]`}
          style={{
            '--tc-effect-color': color,
            '--tc-effect-body': bodyColor
          }}
        >
          <span className="tc-css-effect-layer tc-css-effect-layer-a" />
          <span className="tc-css-effect-layer tc-css-effect-layer-b" />
          <span className="tc-css-effect-layer tc-css-effect-layer-c" />
        </div>
      )}
      {effect === 'galaxy' && (
        <div className="absolute inset-0">
          <div
            className="absolute inset-0 opacity-40 transition-colors duration-500"
            style={{
              backgroundImage: `radial-gradient(circle at 20% 30%, ${bodyColor}cc 0%, transparent 60%), radial-gradient(circle at 80% 70%, ${color}66 0%, transparent 60%)`
            }}
          />
          <div className="absolute inset-[-50%] tc-notif-galaxy">
            {galaxyStars.map((star) => (
              <div
                key={star.key}
                className="absolute bg-white rounded-full tc-anim-twinkle"
                style={{
                  width: '2px',
                  height: '2px',
                  top: star.top,
                  left: star.left,
                  animationDelay: star.animationDelay,
                  boxShadow: star.boxShadow,
                  opacity: star.opacity
                }}
              />
            ))}
          </div>
        </div>
      )}
      {effect === 'aurora' && (
        <div
          className="absolute -inset-20 tc-notif-aurora opacity-70 transition-all duration-500"
          style={{
            backgroundImage: `linear-gradient(135deg, ${color}cc, ${bodyColor}00, ${color}aa, ${bodyColor}00, ${color}dd)`,
            backgroundSize: '200% 200%'
          }}
        />
      )}
      {effect === 'shader' && (
        <div className="absolute inset-0">
          <div
            className="absolute inset-0"
            style={{
              background: `radial-gradient(120% 180% at 15% 30%, ${bodyColor}44 0%, transparent 55%), radial-gradient(120% 180% at 85% 75%, ${color}33 0%, transparent 60%)`
            }}
          />
          {shaderBlobs.map((blob) => (
            <div
              key={blob.key}
              className="absolute rounded-full tc-notif-shader-blob"
              style={{
                width: `${blob.width}%`,
                height: `${blob.height}%`,
                top: `${blob.top}%`,
                left: `${blob.left}%`,
                opacity: blob.opacity,
                background: `radial-gradient(circle at 30% 30%, ${color}88 0%, ${bodyColor}55 45%, transparent 75%)`,
                filter: 'blur(14px)',
                animationDuration: `${blob.duration}s`,
                animationDelay: `${blob.delay}s`
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
