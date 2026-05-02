"use client";
import React from 'react';
import Link from 'next/link';
import PixelSprite from '@/components/sprites/PixelSprite';
import { FolderKanban, Calendar, Brain, Users, LayoutDashboard } from 'lucide-react';

const GROUND = 90;   // px from bottom where grass line sits
const GRASS  = 14;   // grass strip height

/* ── pixel art pieces ───────────────────────────── */

function Tree({ tall }: { tall?: boolean }) {
  const scale = tall ? 1.5 : 1;
  const w = Math.round(26 * scale), h = Math.round(48 * scale);
  return (
    <svg width={w} height={h} viewBox="0 0 13 24" fill="none" style={{ imageRendering: 'pixelated', display: 'block' }}>
      <rect x="5"  y="17" width="3" height="7"  fill="#4a2c0a" />
      <rect x="1"  y="11" width="11" height="7" fill="#1a4a1a" />
      <rect x="2"  y="6"  width="9"  height="6" fill="#256b25" />
      <rect x="4"  y="2"  width="5"  height="5" fill="#2d7a2d" />
      <rect x="5"  y="0"  width="3"  height="3" fill="#39a839" />
    </svg>
  );
}

function Bush() {
  return (
    <svg width="30" height="18" viewBox="0 0 30 18" fill="none" style={{ imageRendering: 'pixelated', display: 'block' }}>
      <rect x="0"  y="8"  width="12" height="10" fill="#1a4a1a" />
      <rect x="9"  y="4"  width="14" height="14" fill="#256b25" />
      <rect x="20" y="8"  width="10" height="10" fill="#1a4a1a" />
      <rect x="4"  y="6"  width="8"  height="8"  fill="#2d7a2d" />
      <rect x="12" y="1"  width="7"  height="6"  fill="#2d7a2d" />
    </svg>
  );
}

function Flower({ color }: { color: string }) {
  return (
    <svg width="10" height="16" viewBox="0 0 10 16" fill="none" style={{ imageRendering: 'pixelated', display: 'block' }}>
      <rect x="4" y="7"  width="2" height="9" fill="#256b25" />
      <rect x="2" y="3"  width="2" height="2" fill={color} />
      <rect x="6" y="3"  width="2" height="2" fill={color} />
      <rect x="4" y="1"  width="2" height="2" fill={color} />
      <rect x="4" y="5"  width="2" height="2" fill={color} />
      <rect x="4" y="3"  width="2" height="2" fill="#FFE135" />
    </svg>
  );
}

function Mushroom() {
  return (
    <svg width="10" height="14" viewBox="0 0 10 14" fill="none" style={{ imageRendering: 'pixelated', display: 'block' }}>
      <rect x="3" y="8"  width="4" height="6" fill="#c8a87a" />
      <rect x="0" y="3"  width="10" height="6" fill="#cc3300" />
      <rect x="2" y="1"  width="6" height="4" fill="#cc3300" />
      <rect x="2" y="4"  width="2" height="2" fill="#fff" opacity="0.6" />
      <rect x="6" y="5"  width="2" height="2" fill="#fff" opacity="0.6" />
    </svg>
  );
}

function Rock() {
  return (
    <svg width="18" height="12" viewBox="0 0 18 12" fill="none" style={{ imageRendering: 'pixelated', display: 'block' }}>
      <rect x="2"  y="4"  width="14" height="8" fill="#2a2e35" />
      <rect x="0"  y="6"  width="18" height="6" fill="#252d3a" />
      <rect x="4"  y="2"  width="10" height="4" fill="#2a2e35" />
      <rect x="3"  y="4"  width="3"  height="2" fill="#3a4050" />
    </svg>
  );
}

function Cloud() {
  return (
    <svg width="56" height="26" viewBox="0 0 56 26" fill="none" style={{ imageRendering: 'pixelated', display: 'block' }}>
      <rect x="8"  y="16" width="40" height="8"  fill="#1c2230" />
      <rect x="4"  y="10" width="16" height="12" fill="#1c2230" />
      <rect x="18" y="6"  width="22" height="16" fill="#252d3a" />
      <rect x="36" y="10" width="16" height="12" fill="#1c2230" />
      <rect x="22" y="2"  width="12" height="6"  fill="#252d3a" />
    </svg>
  );
}

/* ── scene layout ────────────────────────────────── */

const DECORATIONS = [
  { type: 'tree',     x: 4,   tall: true },
  { type: 'bush',     x: 11 },
  { type: 'flower',   x: 17,  color: '#FF6B9D' },
  { type: 'flower',   x: 19,  color: '#FFE135' },
  { type: 'tree',     x: 26 },
  { type: 'mushroom', x: 33 },
  { type: 'rock',     x: 38 },
  { type: 'flower',   x: 43,  color: '#39FF6A' },
  { type: 'bush',     x: 50 },
  { type: 'tree',     x: 59,  tall: true },
  { type: 'flower',   x: 66,  color: '#FF8C32' },
  { type: 'flower',   x: 69,  color: '#c084fc' },
  { type: 'rock',     x: 73 },
  { type: 'tree',     x: 78 },
  { type: 'bush',     x: 85 },
  { type: 'mushroom', x: 90 },
  { type: 'flower',   x: 94,  color: '#FF6B9D' },
  { type: 'tree',     x: 97,  tall: true },
];

const STARS = [
  { x: 8,  y: 6,  d: 1.2 }, { x: 22, y: 3,  d: 2.1 }, { x: 38, y: 9,  d: 1.8 },
  { x: 55, y: 4,  d: 2.4 }, { x: 70, y: 11, d: 1.5 }, { x: 85, y: 5,  d: 2.0 },
  { x: 15, y: 20, d: 1.7 }, { x: 32, y: 15, d: 2.3 }, { x: 48, y: 22, d: 1.4 },
  { x: 62, y: 8,  d: 1.9 }, { x: 78, y: 18, d: 2.2 }, { x: 92, y: 13, d: 1.6 },
  { x: 5,  y: 30, d: 2.0 }, { x: 42, y: 28, d: 1.3 }, { x: 68, y: 25, d: 1.8 },
  { x: 88, y: 35, d: 2.1 }, { x: 25, y: 40, d: 1.5 }, { x: 75, y: 38, d: 1.9 },
];

/* ── css keyframes ───────────────────────────────── */

const STYLES = `
  @keyframes walk-right {
    from { transform: translateX(-80px); }
    to   { transform: translateX(calc(100vw - 220px + 80px)); }
  }
  @keyframes walk-left {
    from { transform: translateX(calc(100vw - 220px + 80px)) scaleX(-1); }
    to   { transform: translateX(-80px) scaleX(-1); }
  }
  @keyframes bob {
    0%, 100% { transform: translateY(0px); }
    50%       { transform: translateY(-6px); }
  }
  @keyframes cloud-r {
    from { transform: translateX(-80px); }
    to   { transform: translateX(calc(100vw - 220px + 80px)); }
  }
  @keyframes cloud-l {
    from { transform: translateX(calc(100vw - 220px + 80px)); }
    to   { transform: translateX(-80px); }
  }
  @keyframes twinkle {
    0%, 100% { opacity: 0.15; transform: scale(1); }
    50%       { opacity: 1;    transform: scale(1.4); }
  }
  @keyframes grass-sway {
    0%, 100% { transform: skewX(0deg); }
    50%       { transform: skewX(3deg); }
  }
`;

export default function Page() {
  return (
    <>
      <style>{STYLES}</style>

      <div className="relative w-full h-full overflow-hidden select-none" style={{ background: 'linear-gradient(180deg, #06080a 0%, #0c0e10 60%, #111822 100%)' }}>

        {/* ── stars ── */}
        {STARS.map((s, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white"
            style={{
              width: 2, height: 2,
              left: `${s.x}%`, top: `${s.y}%`,
              animation: `twinkle ${s.d}s ease-in-out infinite`,
              animationDelay: `${(i * 0.37).toFixed(2)}s`,
            }}
          />
        ))}

        {/* ── clouds ── */}
        <div style={{ position: 'absolute', top: '12%', animation: 'cloud-r 45s linear infinite' }}>
          <Cloud />
        </div>
        <div style={{ position: 'absolute', top: '28%', animation: 'cloud-l 60s linear infinite' }}>
          <Cloud />
        </div>
        <div style={{ position: 'absolute', top: '18%', animation: 'cloud-r 70s linear infinite', animationDelay: '-25s' }}>
          <Cloud />
        </div>

        {/* ── title + route selector ── */}
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-6" style={{ bottom: GROUND }}>
          <div className="flex flex-col items-center gap-2 pointer-events-none">
            <div className="font-mono font-bold tracking-[0.35em] uppercase text-yellowBright" style={{ fontSize: 13 }}>
              ★ MISSION CONTROL ★
            </div>
            <div className="font-mono tracking-widest uppercase text-smoke" style={{ fontSize: 9, opacity: 0.45 }}>
              3 AGENTS ONLINE · ALL SYSTEMS GO
            </div>
          </div>

          <div className="flex gap-3">
            {[
              { href: '/tasks',    label: 'Tasks',    icon: <FolderKanban size={14} />, color: 'text-greenBright  border-greenBright  hover:bg-green-dim' },
              { href: '/calendar', label: 'Calendar', icon: <Calendar      size={14} />, color: 'text-amberBright border-amberBright hover:bg-amber-dim' },
              { href: '/memory',   label: 'Memory',   icon: <Brain         size={14} />, color: 'text-yellowBright border-yellowBright hover:bg-[#3a3510]' },
              { href: '/team',     label: 'Team',     icon: <Users         size={14} />, color: 'text-blue-400   border-blue-400   hover:bg-blue-400/10' },
              { href: '/projects', label: 'Projects', icon: <LayoutDashboard size={14} />, color: 'text-emberGlow  border-emberGlow  hover:bg-emberGlow/10' },
            ].map(route => (
              <Link
                key={route.href}
                href={route.href}
                className={`flex items-center gap-2 px-3 py-2 border rounded font-mono uppercase tracking-widest transition-all bg-surface/80 backdrop-blur-sm ${route.color}`}
                style={{ fontSize: 10 }}
              >
                {route.icon}
                {route.label}
              </Link>
            ))}
          </div>
        </div>

        {/* ── decorations (trees, flowers, etc.) ── */}
        {DECORATIONS.map((d, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              bottom: GROUND,
              left: `${d.x}%`,
              transform: 'translateX(-50%)',
              zIndex: 10,
            }}
          >
            {d.type === 'tree'     && <Tree tall={(d as any).tall} />}
            {d.type === 'bush'     && <Bush />}
            {d.type === 'flower'   && <Flower color={(d as any).color} />}
            {d.type === 'mushroom' && <Mushroom />}
            {d.type === 'rock'     && <Rock />}
          </div>
        ))}

        {/* ── OverOwa · walks right · slow ── */}
        <div style={{ position: 'absolute', bottom: GROUND, zIndex: 20, animation: 'walk-right 18s linear infinite' }}>
          <PixelSprite agentId="overowa" isActive={true} className="w-12 h-12" />
        </div>

        {/* ── Stinger · walks left · medium ── */}
        <div style={{ position: 'absolute', bottom: GROUND, zIndex: 20, animation: 'walk-left 12s linear infinite', animationDelay: '-5s' }}>
          <PixelSprite agentId="stinger" isActive={true} className="w-10 h-10" />
        </div>

        {/* ── Firefly · flies right · fast + bobbing ── */}
        <div style={{ position: 'absolute', bottom: GROUND + 20, zIndex: 20, animation: 'walk-right 9s linear infinite', animationDelay: '-3s' }}>
          <div style={{ animation: 'bob 0.5s ease-in-out infinite' }}>
            <PixelSprite agentId="firefly" isActive={true} className="w-10 h-10" />
          </div>
        </div>

        {/* ── grass strip ── */}
        <div
          className="absolute left-0 right-0"
          style={{ bottom: GROUND - GRASS, height: GRASS, background: '#2d5c1a', zIndex: 5 }}
        />

        {/* ── dirt ── */}
        <div
          className="absolute left-0 right-0 bottom-0"
          style={{ height: GROUND - GRASS, background: 'linear-gradient(180deg, #4a3520 0%, #3d2b1a 40%, #2e1e0e 100%)', zIndex: 5 }}
        />

        {/* dirt texture dots */}
        {[8,18,28,36,45,53,62,71,80,88,95].map((x, i) => (
          <div
            key={i}
            className="absolute rounded-full"
            style={{ bottom: 8 + (i % 3) * 10, left: `${x}%`, width: 4, height: 3, background: '#2a1a0a', zIndex: 6, opacity: 0.6 }}
          />
        ))}

      </div>
    </>
  );
}
