"use client";
import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { FolderKanban, Calendar, Brain, Users, LayoutDashboard } from 'lucide-react';

const GROUND = 90;
const GRASS  = 14;

type Mode = 'night' | 'winter' | 'storm';

/* ── scenery ────────────────────────────────────────────────────────── */

function Tree({ tall, mode }: { tall?: boolean; mode?: Mode }) {
  const scale = tall ? 1.5 : 1;
  const w = Math.round(26 * scale), h = Math.round(48 * scale);
  const trunk  = mode === 'winter' ? '#6b4a1a' : mode === 'storm' ? '#2a1a08' : '#4a2c0a';
  const dark   = mode === 'winter' ? '#2a6a2a' : mode === 'storm' ? '#0e2a0e' : '#1a4a1a';
  const mid    = mode === 'winter' ? '#369636' : mode === 'storm' ? '#152a15' : '#256b25';
  const light  = mode === 'winter' ? '#3ea03e' : mode === 'storm' ? '#1a301a' : '#2d7a2d';
  const tip    = mode === 'winter' ? '#4ec84e' : mode === 'storm' ? '#1e381e' : '#39a839';
  return (
    <svg width={w} height={h} viewBox="0 0 13 24" fill="none" style={{ imageRendering: 'pixelated', display: 'block' }}>
      <rect x="5" y="17" width="3" height="7"  fill={trunk} />
      <rect x="1" y="11" width="11" height="7" fill={dark} />
      <rect x="2" y="6"  width="9"  height="6" fill={mid} />
      <rect x="4" y="2"  width="5"  height="5" fill={light} />
      <rect x="5" y="0"  width="3"  height="3" fill={tip} />
      {mode === 'winter' && <>
        <rect x="1" y="11" width="11" height="2" fill="#ddeef8" opacity="0.85" />
        <rect x="2" y="6"  width="9"  height="2" fill="#ddeef8" opacity="0.8" />
        <rect x="4" y="2"  width="5"  height="2" fill="#ddeef8" opacity="0.75" />
        <rect x="5" y="0"  width="3"  height="1" fill="#eef6fc" opacity="0.9" />
      </>}
    </svg>
  );
}
function Bush({ mode }: { mode?: Mode }) {
  const dark  = mode === 'winter' ? '#2a6a2a' : mode === 'storm' ? '#0e2a0e' : '#1a4a1a';
  const light = mode === 'winter' ? '#369636' : mode === 'storm' ? '#152a15' : '#256b25';
  const mid   = mode === 'winter' ? '#3ea03e' : mode === 'storm' ? '#1a301a' : '#2d7a2d';
  return (
    <svg width="30" height="18" viewBox="0 0 30 18" fill="none" style={{ imageRendering: 'pixelated', display: 'block' }}>
      <rect x="0"  y="8"  width="12" height="10" fill={dark} />
      <rect x="9"  y="4"  width="14" height="14" fill={light} />
      <rect x="20" y="8"  width="10" height="10" fill={dark} />
      <rect x="4"  y="6"  width="8"  height="8"  fill={mid} />
      <rect x="12" y="1"  width="7"  height="6"  fill={mid} />
      {mode === 'winter' && <rect x="9" y="4" width="14" height="3" fill="#ddeef8" opacity="0.8" />}
    </svg>
  );
}
function Flower({ color, mode }: { color: string; mode?: Mode }) {
  if (mode === 'winter' || mode === 'storm') return null;
  return (
    <svg width="10" height="16" viewBox="0 0 10 16" fill="none" style={{ imageRendering: 'pixelated', display: 'block' }}>
      <rect x="4" y="7" width="2" height="9" fill="#256b25" />
      <rect x="2" y="3" width="2" height="2" fill={color} />
      <rect x="6" y="3" width="2" height="2" fill={color} />
      <rect x="4" y="1" width="2" height="2" fill={color} />
      <rect x="4" y="5" width="2" height="2" fill={color} />
      <rect x="4" y="3" width="2" height="2" fill="#FFE135" />
    </svg>
  );
}
function Mushroom({ glowing, mode }: { glowing?: boolean; mode?: Mode }) {
  if (mode === 'winter') return (
    <svg width="10" height="14" viewBox="0 0 10 14" fill="none" style={{ imageRendering: 'pixelated', display: 'block' }}>
      <rect x="3" y="8" width="4" height="6" fill="#c8d8e8" />
      <rect x="2" y="6" width="6" height="4" fill="#ddeef8" />
      <rect x="1" y="4" width="8" height="4" fill="#eef6fc" />
    </svg>
  );
  return (
    <svg width={glowing ? 16 : 10} height={glowing ? 22 : 14} viewBox="0 0 10 14" fill="none"
      style={{ imageRendering: 'pixelated', display: 'block', transition: 'width 0.15s, height 0.15s', filter: glowing ? 'drop-shadow(0 0 5px #FF4D1A)' : 'none' }}
    >
      <rect x="3" y="8"  width="4" height="6" fill={mode === 'storm' ? '#8a7060' : '#c8a87a'} />
      <rect x="0" y="3"  width="10" height="6" fill={glowing ? '#FF4D1A' : (mode === 'storm' ? '#8a2200' : '#cc3300')} />
      <rect x="2" y="1"  width="6" height="4" fill={glowing ? '#ff6b3a' : (mode === 'storm' ? '#8a2200' : '#cc3300')} />
      <rect x="2" y="4"  width="2" height="2" fill="#fff" opacity={glowing ? 1 : 0.6} />
      <rect x="6" y="5"  width="2" height="2" fill="#fff" opacity={glowing ? 1 : 0.6} />
    </svg>
  );
}
function Rock() {
  return (
    <svg width="18" height="12" viewBox="0 0 18 12" fill="none" style={{ imageRendering: 'pixelated', display: 'block' }}>
      <rect x="2" y="4"  width="14" height="8" fill="#2a2e35" />
      <rect x="0" y="6"  width="18" height="6" fill="#252d3a" />
      <rect x="4" y="2"  width="10" height="4" fill="#2a2e35" />
      <rect x="3" y="4"  width="3"  height="2" fill="#3a4050" />
    </svg>
  );
}
function Fence({ mode }: { mode?: Mode }) {
  const post = mode === 'winter' ? '#c4b898' : mode === 'storm' ? '#4a3a2a' : '#9e7b5a';
  const rail = mode === 'winter' ? '#d8ccb0' : mode === 'storm' ? '#5a4838' : '#b89068';
  return (
    <svg width="40" height="24" viewBox="0 0 40 24" fill="none" style={{ imageRendering: 'pixelated', display: 'block' }}>
      <rect x="3"  y="4"  width="3" height="16" fill={post} />
      <rect x="17" y="4"  width="3" height="16" fill={post} />
      <rect x="31" y="4"  width="3" height="16" fill={post} />
      <rect x="2"  y="2"  width="5" height="3"  fill={rail} />
      <rect x="16" y="2"  width="5" height="3"  fill={rail} />
      <rect x="30" y="2"  width="5" height="3"  fill={rail} />
      <rect x="1"  y="8"  width="38" height="3" fill={rail} />
      <rect x="1"  y="15" width="38" height="3" fill={rail} />
      {mode === 'winter' && <>
        <rect x="1"  y="8"  width="38" height="2" fill="#ddeef8" opacity="0.7" />
        <rect x="2"  y="2"  width="36" height="1" fill="#eef6fc" opacity="0.8" />
      </>}
    </svg>
  );
}
function Lantern({ mode }: { mode?: Mode }) {
  const lit     = mode === 'night' || mode === 'storm';
  const postCol = mode === 'winter' ? '#7a8898' : '#383e4a';
  const glowBg  = mode === 'storm'
    ? 'radial-gradient(circle, rgba(80,120,200,0.22) 0%, transparent 65%)'
    : 'radial-gradient(circle, rgba(255,225,53,0.30) 0%, transparent 65%)';
  const lampFill = lit ? (mode === 'storm' ? '#5070a0' : '#FFE135') : '#1a1e26';
  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      {lit && (
        <div style={{ position: 'absolute', top: -6, left: '50%', transform: 'translateX(-50%)', width: 46, height: 46, borderRadius: '50%', background: glowBg, pointerEvents: 'none' }} />
      )}
      <svg width="14" height="40" viewBox="0 0 14 40" fill="none" style={{ imageRendering: 'pixelated', display: 'block', position: 'relative' }}>
        <rect x="6"  y="15" width="2" height="25" fill={postCol} />
        <rect x="4"  y="13" width="6" height="2"  fill={postCol} />
        <rect x="2"  y="2"  width="10" height="13" fill={mode === 'storm' ? '#1e2430' : '#252c3a'} />
        <rect x="3"  y="3"  width="8"  height="10" fill={lampFill} opacity={lit ? 0.9 : 1} />
        <rect x="1"  y="1"  width="12" height="2"  fill={postCol} />
        <rect x="1"  y="14" width="12" height="2"  fill={postCol} />
        <rect x="4"  y="38" width="6"  height="2"  fill={postCol} />
        {mode === 'winter' && <rect x="1" y="1" width="12" height="2" fill="#ddeef8" opacity="0.7" />}
      </svg>
    </div>
  );
}
function Snowman() {
  return (
    <svg width="30" height="38" viewBox="0 0 30 38" fill="none" style={{ imageRendering: 'pixelated', display: 'block' }}>
      <rect x="4"  y="22" width="22" height="16" rx="8" fill="#e4f0f8" />
      <rect x="6"  y="23" width="18" height="13" rx="6" fill="#eef6fc" />
      <rect x="7"  y="11" width="16" height="13" rx="6" fill="#e4f0f8" />
      <rect x="8"  y="12" width="14" height="11" rx="5" fill="#eef6fc" />
      <rect x="10" y="2"  width="10" height="10" rx="4" fill="#eef6fc" />
      <rect x="8"  y="2"  width="14" height="2"  fill="#1a1a2a" />
      <rect x="10" y="0"  width="10" height="4"  fill="#1a1a2a" />
      <rect x="12" y="4"  width="2"  height="2"  fill="#1a1a2a" />
      <rect x="17" y="4"  width="2"  height="2"  fill="#1a1a2a" />
      <rect x="15" y="6"  width="4"  height="1"  fill="#e06020" />
      <rect x="16" y="7"  width="3"  height="1"  fill="#e06020" />
      <rect x="13" y="9"  width="1"  height="1"  fill="#2a2a3a" opacity="0.6" />
      <rect x="15" y="10" width="1"  height="1"  fill="#2a2a3a" opacity="0.6" />
      <rect x="17" y="9"  width="1"  height="1"  fill="#2a2a3a" opacity="0.6" />
      <rect x="14" y="14" width="2"  height="2"  fill="#3a4050" opacity="0.7" />
      <rect x="14" y="18" width="2"  height="2"  fill="#3a4050" opacity="0.7" />
      <rect x="1"  y="16" width="6"  height="1"  fill="#5a3010" />
      <rect x="23" y="16" width="6"  height="1"  fill="#5a3010" />
      <rect x="1"  y="14" width="2"  height="3"  fill="#5a3010" />
      <rect x="27" y="14" width="2"  height="3"  fill="#5a3010" />
    </svg>
  );
}
function Cloud({ mode }: { mode?: Mode }) {
  const c1 = mode === 'winter' ? '#c8dce8' : mode === 'storm' ? '#1e202a' : '#1c2230';
  const c2 = mode === 'winter' ? '#ddeaf4' : mode === 'storm' ? '#28303e' : '#252d3a';
  return (
    <svg width="56" height="26" viewBox="0 0 56 26" fill="none" style={{ imageRendering: 'pixelated', display: 'block' }}>
      <rect x="8"  y="16" width="40" height="8"  fill={c1} />
      <rect x="4"  y="10" width="16" height="12" fill={c1} />
      <rect x="18" y="6"  width="22" height="16" fill={c2} />
      <rect x="36" y="10" width="16" height="12" fill={c1} />
      <rect x="22" y="2"  width="12" height="6"  fill={c2} />
    </svg>
  );
}

/* ── sky objects ─────────────────────────────────────────────────────── */
function Sun() {
  return (
    <svg width="40" height="40" viewBox="0 0 20 20" fill="none" style={{ imageRendering: 'pixelated', display: 'block' }}>
      <rect x="8" y="0" width="4" height="3" fill="#FFE135" /><rect x="8" y="17" width="4" height="3" fill="#FFE135" />
      <rect x="0" y="8" width="3" height="4" fill="#FFE135" /><rect x="17" y="8" width="3" height="4" fill="#FFE135" />
      <rect x="2" y="2" width="2" height="2" fill="#FFE135" /><rect x="16" y="2" width="2" height="2" fill="#FFE135" />
      <rect x="2" y="16" width="2" height="2" fill="#FFE135" /><rect x="16" y="16" width="2" height="2" fill="#FFE135" />
      <rect x="5" y="5" width="10" height="10" fill="#FFE135" />
      <rect x="6" y="4" width="8" height="12" fill="#FFE135" />
      <rect x="4" y="6" width="12" height="8" fill="#FFE135" />
      <rect x="7" y="7" width="6" height="6" fill="#fff" opacity="0.35" />
    </svg>
  );
}
function Moon() {
  return (
    <svg width="38" height="38" viewBox="0 0 20 20" fill="none" style={{ imageRendering: 'pixelated', display: 'block' }}>
      <rect x="6"  y="2"  width="8"  height="2"  fill="#d4dfe8" />
      <rect x="4"  y="4"  width="12" height="2"  fill="#d4dfe8" />
      <rect x="2"  y="6"  width="14" height="8"  fill="#d4dfe8" />
      <rect x="4"  y="14" width="12" height="2"  fill="#d4dfe8" />
      <rect x="6"  y="16" width="8"  height="2"  fill="#d4dfe8" />
      <rect x="10" y="2"  width="6"  height="2"  fill="#06080a" />
      <rect x="9"  y="4"  width="7"  height="2"  fill="#06080a" />
      <rect x="10" y="6"  width="6"  height="2"  fill="#06080a" />
      <rect x="11" y="8"  width="5"  height="4"  fill="#06080a" />
      <rect x="10" y="12" width="6"  height="2"  fill="#06080a" />
      <rect x="9"  y="14" width="7"  height="2"  fill="#06080a" />
      <rect x="10" y="16" width="6"  height="2"  fill="#06080a" />
      <rect x="4"  y="8"  width="2"  height="2"  fill="#b8c8d8" opacity="0.6" />
      <rect x="6"  y="13" width="2"  height="2"  fill="#b8c8d8" opacity="0.5" />
      <rect x="3"  y="11" width="1"  height="1"  fill="#b8c8d8" opacity="0.5" />
    </svg>
  );
}
function SnowMoon() {
  return (
    <svg width="38" height="38" viewBox="0 0 20 20" fill="none" style={{ imageRendering: 'pixelated', display: 'block' }}>
      <rect x="4" y="4" width="12" height="12" rx="6" fill="#e8f2fa" />
      <rect x="6" y="2" width="8"  height="2"  fill="#e8f2fa" />
      <rect x="6" y="16" width="8" height="2"  fill="#e8f2fa" />
      <rect x="2" y="6" width="2"  height="8"  fill="#e8f2fa" />
      <rect x="16" y="6" width="2" height="8"  fill="#e8f2fa" />
      <rect x="7" y="7" width="2"  height="2"  fill="#c0d4e8" opacity="0.6" />
      <rect x="11" y="10" width="2" height="2" fill="#c0d4e8" opacity="0.5" />
    </svg>
  );
}

/* ── houses ─────────────────────────────────────────────────────────── */
function HouseA({ mode }: { mode?: Mode }) {
  const winter  = mode === 'winter';
  const storm   = mode === 'storm';
  const wl      = mode === 'night' ? 0.12 : 0;
  const wall    = winter ? '#d8b888' : storm ? '#8a7860' : '#c8a87a';
  const roofTop = winter ? '#a83020' : storm ? '#5a1a10' : '#8B2020';
  const roofBot = winter ? '#882818' : storm ? '#481410' : '#6b1818';
  return (
    <svg width="64" height="60" viewBox="0 0 64 60" fill="none" style={{ imageRendering: 'pixelated', display: 'block' }}>
      <rect x="42" y="6"  width="8"  height="18" fill="#5a3a2a" />
      <rect x="40" y="4"  width="12" height="4"  fill="#4a2a1a" />
      {mode === 'night' && <><circle cx="46" cy="2" r="2" fill="#8896a8" opacity="0.3" /><circle cx="48" cy="0" r="1" fill="#8896a8" opacity="0.2" /></>}
      <polygon points="32,4 4,26 60,26" fill={roofTop} />
      <rect x="4"  y="22" width="56" height="4"  fill={roofBot} />
      {winter && <rect x="4" y="22" width="56" height="4" fill="#ddeef8" opacity="0.9" />}
      <rect x="6"  y="26" width="52" height="32" fill={wall} />
      {storm && <rect x="6" y="26" width="52" height="32" fill="#4a3820" />}
      <rect x="6"  y="30" width="52" height="1"  fill="#b09060" opacity="0.4" />
      <rect x="6"  y="36" width="52" height="1"  fill="#b09060" opacity="0.4" />
      <rect x="6"  y="42" width="52" height="1"  fill="#b09060" opacity="0.4" />
      <rect x="6"  y="48" width="52" height="1"  fill="#b09060" opacity="0.4" />
      <rect x="9"  y="30" width="14" height="11" fill={storm ? '#2a3a5a' : '#1c3a6a'} />
      <rect x="10" y="31" width="5"  height="9"  fill={storm ? '#3a5070' : '#2a5a9a'} />
      <rect x="17" y="31" width="5"  height="9"  fill={storm ? '#3a5070' : '#2a5a9a'} />
      <rect x="10" y="35" width="13" height="1"  fill={storm ? '#2a3a5a' : '#1c3a6a'} />
      <rect x="10" y="31" width="13" height="9"  fill="#FFE135" opacity={wl} />
      <rect x="41" y="30" width="14" height="11" fill={storm ? '#2a3a5a' : '#1c3a6a'} />
      <rect x="42" y="31" width="5"  height="9"  fill={storm ? '#3a5070' : '#2a5a9a'} />
      <rect x="49" y="31" width="5"  height="9"  fill={storm ? '#3a5070' : '#2a5a9a'} />
      <rect x="42" y="35" width="13" height="1"  fill={storm ? '#2a3a5a' : '#1c3a6a'} />
      <rect x="42" y="31" width="13" height="9"  fill="#FFE135" opacity={wl} />
      <rect x="26" y="40" width="12" height="18" fill="#5a3a2a" />
      <rect x="27" y="41" width="10" height="16" fill="#4a2a1a" />
      <rect x="35" y="49" width="2"  height="2"  fill="#FFE135" />
      <rect x="24" y="56" width="16" height="2"  fill="#9a8060" />
      {winter && <>
        <rect x="4"  y="22" width="58" height="5" fill="#eef6fc" opacity="0.95" />
        <rect x="6"  y="25" width="3"  height="4" fill="#ddeef8" opacity="0.7" />
        <rect x="14" y="25" width="3"  height="5" fill="#ddeef8" opacity="0.7" />
        <rect x="22" y="25" width="3"  height="4" fill="#ddeef8" opacity="0.7" />
        <rect x="34" y="25" width="3"  height="5" fill="#ddeef8" opacity="0.7" />
        <rect x="46" y="25" width="3"  height="4" fill="#ddeef8" opacity="0.7" />
        <rect x="54" y="25" width="4"  height="5" fill="#ddeef8" opacity="0.7" />
      </>}
    </svg>
  );
}
function HouseB({ mode }: { mode?: Mode }) {
  const winter = mode === 'winter';
  const storm  = mode === 'storm';
  const wl     = mode === 'night' ? 0.12 : 0;
  const wall   = winter ? '#c8a87a' : storm ? '#7a6850' : '#9e7b5a';
  return (
    <svg width="54" height="52" viewBox="0 0 54 52" fill="none" style={{ imageRendering: 'pixelated', display: 'block' }}>
      <rect x="12" y="2"  width="30" height="6"  fill={winter ? '#3ea03e' : storm ? '#1a301a' : '#2d7a2d'} />
      <rect x="8"  y="8"  width="38" height="6"  fill={winter ? '#369636' : storm ? '#152a15' : '#256b25'} />
      <rect x="4"  y="14" width="46" height="6"  fill={winter ? '#2a6a2a' : storm ? '#0e2a0e' : '#1a4a1a'} />
      <rect x="2"  y="20" width="50" height="4"  fill={winter ? '#3a7020' : storm ? '#0e200e' : '#2d5c1a'} />
      {!storm && <><rect x="14" y="4" width="2" height="2" fill="#FF6B9D" /><rect x="26" y="2" width="2" height="2" fill="#FFE135" /><rect x="36" y="4" width="2" height="2" fill="#FF6B9D" /></>}
      <rect x="4"  y="24" width="46" height="26" fill={wall} />
      <rect x="21" y="32" width="12" height="18" fill="#5a3220" />
      <rect x="22" y="28" width="10" height="6"  fill="#5a3220" />
      <rect x="30" y="40" width="2"  height="2"  fill="#FF8C32" />
      <rect x="6"  y="28" width="12" height="10" fill={storm ? '#2a3a5a' : '#1c3a6a'} />
      <rect x="7"  y="29" width="10" height="8"  fill={storm ? '#3a5070' : '#2a5a9a'} />
      <rect x="7"  y="29" width="10" height="8"  fill="#FFE135" opacity={wl} />
      <rect x="36" y="28" width="12" height="10" fill={storm ? '#2a3a5a' : '#1c3a6a'} />
      <rect x="37" y="29" width="10" height="8"  fill={storm ? '#3a5070' : '#2a5a9a'} />
      <rect x="37" y="29" width="10" height="8"  fill="#FFE135" opacity={wl} />
      {!storm && <><rect x="2" y="48" width="2" height="4" fill="#256b25" /><rect x="1" y="46" width="4" height="2" fill="#FF6B9D" /><rect x="50" y="48" width="2" height="4" fill="#256b25" /><rect x="49" y="46" width="4" height="2" fill="#FF6B9D" /></>}
      {winter && <>
        <rect x="2"  y="20" width="50" height="5" fill="#eef6fc" opacity="0.95" />
        <rect x="4"  y="23" width="3"  height="4" fill="#ddeef8" opacity="0.7" />
        <rect x="12" y="23" width="3"  height="5" fill="#ddeef8" opacity="0.7" />
        <rect x="24" y="23" width="3"  height="4" fill="#ddeef8" opacity="0.7" />
        <rect x="36" y="23" width="3"  height="5" fill="#ddeef8" opacity="0.7" />
        <rect x="46" y="23" width="4"  height="4" fill="#ddeef8" opacity="0.7" />
      </>}
    </svg>
  );
}

/* ── agent sprites ───────────────────────────────────────────────────── */
function AgentSprite({ id }: { id: 'overowa' | 'firefly' | 'stinger' }) {
  if (id === 'overowa') return (
    <svg width="48" height="48" viewBox="0 0 32 32" fill="none" style={{ imageRendering: 'pixelated', display: 'block' }}>
      <rect x="8"  y="10" width="16" height="16" rx="4" fill="#FFE135" />
      <rect x="12" y="14" width="2"  height="2"  fill="#0c0e10" />
      <rect x="18" y="14" width="2"  height="2"  fill="#0c0e10" />
      <rect x="14" y="18" width="4"  height="2"  fill="#FF8C32" />
      <rect x="10" y="26" width="2"  height="2"  fill="#FF8C32" />
      <rect x="20" y="26" width="2"  height="2"  fill="#FF8C32" />
    </svg>
  );
  if (id === 'firefly') return (
    <svg width="48" height="48" viewBox="0 0 32 32" fill="none" style={{ imageRendering: 'pixelated', display: 'block' }}>
      <rect x="10" y="12" width="12" height="12" rx="2" fill="#2d5a3c" />
      <rect x="14" y="8"  width="4"  height="4"  fill="#39FF6A" />
      <rect x="6"  y="12" width="4"  height="6"  rx="1" fill="#8896a8" opacity="0.6" />
      <rect x="22" y="12" width="4"  height="6"  rx="1" fill="#8896a8" opacity="0.6" />
      <rect x="12" y="20" width="8"  height="4"  fill="#39FF6A" />
    </svg>
  );
  return (
    <svg width="48" height="48" viewBox="0 0 32 32" fill="none" style={{ imageRendering: 'pixelated', display: 'block' }}>
      <rect x="10" y="10" width="12" height="14" rx="2" fill="#FF8C32" />
      <rect x="10" y="14" width="12" height="2"  fill="#0c0e10" />
      <rect x="10" y="18" width="12" height="2"  fill="#0c0e10" />
      <rect x="12" y="6"  width="8"  height="4"  fill="#FF8C32" />
      <rect x="14" y="24" width="4"  height="4"  fill="#FF8C32" />
      <rect x="6"  y="10" width="4"  height="6"  rx="1" fill="#e8edf2" opacity="0.4" />
      <rect x="22" y="10" width="4"  height="6"  rx="1" fill="#e8edf2" opacity="0.4" />
    </svg>
  );
}

/* ── critter sprites ─────────────────────────────────────────────────── */
function ButterbearSprite() {
  return (
    <svg width="44" height="44" viewBox="0 0 32 32" fill="none" style={{ imageRendering: 'pixelated', display: 'block' }}>
      <rect x="5"  y="4"  width="6" height="6" rx="3" fill="#f5d070" />
      <rect x="21" y="4"  width="6" height="6" rx="3" fill="#f5d070" />
      <rect x="7"  y="6"  width="2" height="2" fill="#e8b050" />
      <rect x="23" y="6"  width="2" height="2" fill="#e8b050" />
      <rect x="7"  y="8"  width="18" height="13" rx="4" fill="#f5d070" />
      <rect x="10" y="11" width="3" height="3" rx="1" fill="#2a1a0a" />
      <rect x="19" y="11" width="3" height="3" rx="1" fill="#2a1a0a" />
      <rect x="11" y="11" width="1" height="1" fill="#fff" />
      <rect x="20" y="11" width="1" height="1" fill="#fff" />
      <rect x="12" y="16" width="8" height="4" rx="2" fill="#e8b050" />
      <rect x="15" y="17" width="2" height="2" fill="#c07030" />
      <rect x="8"  y="21" width="16" height="9" rx="3" fill="#f5d070" />
      <rect x="11" y="22" width="10" height="7" rx="2" fill="#fae8a0" />
      <rect x="9"  y="28" width="5" height="4" rx="1" fill="#f5d070" />
      <rect x="18" y="28" width="5" height="4" rx="1" fill="#f5d070" />
    </svg>
  );
}
function DogSprite() {
  return (
    <svg width="44" height="44" viewBox="0 0 32 32" fill="none" style={{ imageRendering: 'pixelated', display: 'block' }}>
      <rect x="4"  y="7"  width="6" height="11" rx="3" fill="#7a4820" />
      <rect x="22" y="7"  width="6" height="11" rx="3" fill="#7a4820" />
      <rect x="7"  y="5"  width="18" height="14" rx="4" fill="#a06030" />
      <rect x="10" y="13" width="12" height="6" rx="2" fill="#c08050" />
      <rect x="13" y="13" width="6" height="3" rx="1" fill="#2a1a0a" />
      <rect x="14" y="14" width="1" height="1" fill="#0c0e10" opacity="0.6" />
      <rect x="17" y="14" width="1" height="1" fill="#0c0e10" opacity="0.6" />
      <rect x="9"  y="8"  width="4" height="4" rx="2" fill="#2a1a0a" />
      <rect x="19" y="8"  width="4" height="4" rx="2" fill="#2a1a0a" />
      <rect x="10" y="9"  width="1" height="1" fill="#fff" />
      <rect x="20" y="9"  width="1" height="1" fill="#fff" />
      <rect x="7"  y="19" width="16" height="10" rx="3" fill="#a06030" />
      <rect x="23" y="15" width="4" height="9" rx="2" fill="#a06030" />
      <rect x="24" y="13" width="4" height="5" rx="2" fill="#a06030" />
      <rect x="8"  y="27" width="5" height="5" rx="1" fill="#a06030" />
      <rect x="19" y="27" width="5" height="5" rx="1" fill="#a06030" />
    </svg>
  );
}
function CatSprite() {
  return (
    <svg width="44" height="44" viewBox="0 0 32 32" fill="none" style={{ imageRendering: 'pixelated', display: 'block' }}>
      <rect x="5"  y="2"  width="7" height="9" rx="1" fill="#9aa8b8" />
      <rect x="20" y="2"  width="7" height="9" rx="1" fill="#9aa8b8" />
      <rect x="7"  y="3"  width="3" height="6" fill="#d0a0b8" opacity="0.5" />
      <rect x="22" y="3"  width="3" height="6" fill="#d0a0b8" opacity="0.5" />
      <rect x="6"  y="8"  width="20" height="14" rx="5" fill="#b0bac8" />
      <rect x="10" y="12" width="12" height="8"  rx="3" fill="#d8e0e8" />
      <rect x="9"  y="10" width="5" height="5" rx="2" fill="#4aaa4a" />
      <rect x="18" y="10" width="5" height="5" rx="2" fill="#4aaa4a" />
      <rect x="11" y="10" width="2" height="4" rx="1" fill="#0c0e10" />
      <rect x="20" y="10" width="2" height="4" rx="1" fill="#0c0e10" />
      <rect x="10" y="11" width="1" height="1" fill="#fff" opacity="0.7" />
      <rect x="19" y="11" width="1" height="1" fill="#fff" opacity="0.7" />
      <rect x="14" y="16" width="4" height="3" rx="1" fill="#e87090" />
      <rect x="8"  y="17" width="2" height="1" fill="#9aa8b8" opacity="0.7" />
      <rect x="22" y="17" width="2" height="1" fill="#9aa8b8" opacity="0.7" />
      <rect x="8"  y="22" width="16" height="8" rx="3" fill="#b0bac8" />
      <rect x="11" y="23" width="10" height="6" rx="2" fill="#e0e8f0" />
      <rect x="24" y="18" width="4" height="10" rx="2" fill="#b0bac8" />
      <rect x="22" y="26" width="6" height="3"  rx="1" fill="#b0bac8" />
      <rect x="9"  y="28" width="5" height="4" rx="1" fill="#b0bac8" />
      <rect x="18" y="28" width="5" height="4" rx="1" fill="#b0bac8" />
    </svg>
  );
}

function TornadoSprite({ mode }: { mode: Mode }) {
  const [d, l, md] = mode === 'winter'
    ? ['#7ab0d0', '#a4cce4', '#c0dff2']
    : mode === 'storm'
    ? ['#080a10', '#10121a', '#181c26']
    : ['#1c1e2e', '#2e3048', '#3a3c52'];
  const debris = mode === 'winter' ? '#b0cce0' : '#6a5030';
  return (
    <svg width="120" height="290" viewBox="0 0 60 145" fill="none" style={{ imageRendering: 'pixelated', display: 'block' }}>
      <rect x="0"  y="0"   width="60" height="12" fill={d}  opacity="0.93" />
      <rect x="2"  y="12"  width="56" height="11" fill={l}  opacity="0.91" />
      <rect x="5"  y="23"  width="50" height="11" fill={md} opacity="0.90" />
      <rect x="8"  y="34"  width="44" height="10" fill={d}  opacity="0.91" />
      <rect x="12" y="44"  width="36" height="10" fill={l}  opacity="0.92" />
      <rect x="16" y="54"  width="28" height="9"  fill={md} opacity="0.93" />
      <rect x="20" y="63"  width="20" height="9"  fill={d}  opacity="0.94" />
      <rect x="23" y="72"  width="14" height="8"  fill={l}  opacity="0.95" />
      <rect x="26" y="80"  width="8"  height="8"  fill={md} opacity="0.96" />
      <rect x="28" y="88"  width="4"  height="8"  fill={d}  opacity="0.97" />
      <rect x="29" y="96"  width="2"  height="16" fill={l}  opacity="0.98" />
      {/* swirl stripes */}
      <rect x="6"  y="8"   width="9"  height="2" fill={l}  opacity="0.45" />
      <rect x="38" y="20"  width="8"  height="2" fill={l}  opacity="0.40" />
      <rect x="10" y="30"  width="7"  height="2" fill={md} opacity="0.38" />
      <rect x="33" y="42"  width="6"  height="2" fill={md} opacity="0.35" />
      <rect x="15" y="51"  width="5"  height="2" fill={d}  opacity="0.30" />
      <rect x="30" y="62"  width="4"  height="2" fill={d}  opacity="0.28" />
      {/* debris */}
      <rect x="3"  y="24"  width="5" height="4" fill={debris} opacity="0.80" />
      <rect x="46" y="16"  width="4" height="3" fill={debris} opacity="0.75" />
      <rect x="9"  y="48"  width="4" height="3" fill={debris} opacity="0.65" />
      <rect x="40" y="40"  width="4" height="4" fill={debris} opacity="0.70" />
      <rect x="17" y="64"  width="3" height="3" fill={debris} opacity="0.55" />
      {mode === 'winter' && <>
        <rect x="2"  y="5"  width="3" height="2" fill="#e8f6ff" opacity="0.7" />
        <rect x="50" y="28" width="2" height="2" fill="#e8f6ff" opacity="0.6" />
        <rect x="14" y="56" width="2" height="2" fill="#ddf0ff" opacity="0.55" />
      </>}
    </svg>
  );
}
function BigMeteoriteSprite({ mode }: { mode: Mode }) {
  const t1   = mode === 'winter' ? '#4898d8' : mode === 'storm' ? '#404870' : '#d83800';
  const t2   = mode === 'winter' ? '#70b8f0' : mode === 'storm' ? '#606090' : '#f06000';
  const t3   = mode === 'winter' ? '#98d4ff' : mode === 'storm' ? '#8080b0' : '#ffa020';
  const t4   = mode === 'winter' ? '#c4ecff' : mode === 'storm' ? '#9898c8' : '#ffd040';
  const r1   = mode === 'winter' ? '#2858a0' : mode === 'storm' ? '#181830' : '#5a2800';
  const r2   = mode === 'winter' ? '#4878c0' : mode === 'storm' ? '#282850' : '#804010';
  const r3   = mode === 'winter' ? '#6898e0' : mode === 'storm' ? '#383870' : '#ac6420';
  const core = mode === 'winter' ? '#e0f8ff' : mode === 'storm' ? '#c0c0ff' : '#fff8b0';
  return (
    <svg width="100" height="280" viewBox="0 0 50 140" fill="none" style={{ imageRendering: 'pixelated', display: 'block' }}>
      {/* long outer trail */}
      <rect x="22" y="0"   width="6"  height="76" fill={t1} opacity="0.07" />
      <rect x="21" y="8"   width="8"  height="64" fill={t1} opacity="0.11" />
      <rect x="20" y="20"  width="10" height="50" fill={t2} opacity="0.17" />
      <rect x="19" y="34"  width="12" height="36" fill={t2} opacity="0.24" />
      <rect x="18" y="50"  width="14" height="24" fill={t3} opacity="0.34" />
      <rect x="17" y="64"  width="16" height="14" fill={t4} opacity="0.50" />
      {/* outer glow halo */}
      <rect x="9"  y="72"  width="32" height="42" rx="14" fill={t4} opacity="0.16" />
      <rect x="12" y="76"  width="26" height="34" rx="11" fill={t3} opacity="0.18" />
      {/* rock outer shell */}
      <rect x="14" y="82"  width="22" height="30" rx="8"  fill={r1} />
      <rect x="15" y="80"  width="20" height="28" rx="7"  fill={r2} />
      <rect x="16" y="78"  width="18" height="26" rx="6"  fill={r3} />
      {/* crater pits */}
      <rect x="18" y="84"  width="5"  height="4"  fill={r1} opacity="0.95" />
      <rect x="27" y="90"  width="4"  height="4"  fill={r1} opacity="0.85" />
      <rect x="17" y="92"  width="4"  height="3"  fill={r2} opacity="0.75" />
      <rect x="24" y="98"  width="3"  height="3"  fill={r2} opacity="0.70" />
      {/* blazing core */}
      <rect x="18" y="79"  width="14" height="10" rx="3" fill={core} opacity="0.65" />
      <rect x="20" y="80"  width="10" height="7"  rx="2" fill="#fff"  opacity="0.32" />
    </svg>
  );
}

/* ── ui widgets ──────────────────────────────────────────────────────── */
function SpeechBubble({ text }: { text: string }) {
  return (
    <div style={{
      position: 'absolute', bottom: '110%', left: '50%', transform: 'translateX(-50%)',
      background: '#e8edf2', color: '#0c0e10',
      fontSize: 10, fontFamily: 'monospace', fontWeight: 'bold',
      padding: '3px 8px', borderRadius: 4, whiteSpace: 'nowrap',
      pointerEvents: 'none', zIndex: 300, boxShadow: '0 2px 6px rgba(0,0,0,0.5)',
    }}>
      {text}
      <div style={{ position: 'absolute', top: '100%', left: '50%', transform: 'translateX(-50%)', width: 0, height: 0, borderLeft: '4px solid transparent', borderRight: '4px solid transparent', borderTop: '4px solid #e8edf2' }} />
    </div>
  );
}
function ScoreFlash({ x, y, pts }: { x: number; y: number; pts: number }) {
  return (
    <div style={{ position: 'fixed', left: x, top: y, zIndex: 400, color: pts > 1 ? '#FF8C32' : '#FFE135', fontFamily: 'monospace', fontWeight: 'bold', fontSize: pts > 1 ? 18 : 15, pointerEvents: 'none', animation: 'score-rise 0.85s ease-out forwards' }}>+{pts}</div>
  );
}
function MilestoneBanner({ text }: { text: string }) {
  return (
    <div style={{ position: 'fixed', top: '20%', left: '50%', transform: 'translateX(-50%)', zIndex: 600, fontFamily: 'monospace', fontWeight: 'bold', fontSize: 16, color: '#FFE135', letterSpacing: '0.2em', background: 'rgba(12,14,16,0.92)', border: '2px solid #FFE135', padding: '8px 22px', borderRadius: 6, pointerEvents: 'none', animation: 'milestone 2s ease-out forwards' }}>{text}</div>
  );
}

/* ── constants ───────────────────────────────────────────────────────── */
type HeldId  = 'overowa' | 'firefly' | 'stinger' | 'bear' | 'dog' | 'cat';
type Disaster = 'freeze' | 'tornado' | 'meteor' | null;

const GRAB_BUBBLES: Record<HeldId, string[]> = {
  overowa: ['routing!!', 'hey!!', 'put me down!', 'i am chief!!', 'nooo!'],
  firefly: [':D', 'my bug!!', 'wheee~', 'help!', 'coding!!'],
  stinger: ['data!!', 'bzzzz!', 'spin!!', 'ouch~', 'hm!!'],
  bear:    ['mrrph!', 'honey?!', 'sleepy!', 'bwah!', 'warm~'],
  dog:     ['woof!!', 'bork!', 'arf arf!', 'pls no!', 'wag~'],
  cat:     ['mrrrow!', 'hiss!', 'purrr~', 'no thx', 'mew!'],
};
const DROP_BUBBLES: Record<HeldId, string[]> = {
  overowa: ['oof!', 'thud!', 'routing...', 'back to work'],
  firefly: ['oof!', 'wee!', 'landed!', 'phew~'],
  stinger: ['oof!', 'bzz!', 'dizzy~', 'home!'],
  bear:    ['oomph!', 'honey!', 'thud~', 'back to nap'],
  dog:     ['boof!', 'arf!', 'wheee!', 'wag wag~'],
  cat:     ['hmpf!', 'rude.', 'mew~', 'fine.'],
};
const SHAKE_BUBBLES: Record<HeldId, string[]> = {
  overowa: ['DIZZY!!', 'stop!!', '!!!', 'whirlll'],
  firefly: ['AHHH!', 'too fast!', '!!!'],
  stinger: ['BZZZZ!!', 'dizzy~', 'waah!'],
  bear:    ['WOAH!!', 'dizzy bear!', 'mrrrp!!'],
  dog:     ['BORKKK!!', 'woozy!', 'ARF ARF!!'],
  cat:     ['MRROW!!', 'I HATE THIS', 'hisssss!'],
};
const PASSIVE_BUBBLES: Record<HeldId, string[]> = {
  overowa: ['routing...', 'all systems go', 'on patrol'],
  firefly: ['...', 'glowing~', 'bug fixed!'],
  stinger: ['researching', '...', 'collecting data'],
  bear:    ['zzz...', '...honey', '*sniff*'],
  dog:     ['*sniff*', '...', 'wag wag'],
  cat:     ['...', '*lick*', 'zzzz'],
};
const STORM_BUBBLES: Record<HeldId, string[]> = {
  overowa: ['storm alert!', 'take cover!', 'routing...'],
  firefly: ['too wet!', 'my circuits!', 'soggy~'],
  stinger: ['bzz~wet', 'shelter!', '...rain'],
  bear:    ['cozy inside', 'thunder!', 'scared~'],
  dog:     ['scared!!', 'thunder!', 'woof!'],
  cat:     ['hate rain.', 'WET', 'inside pls'],
};
const DISASTER_BUBBLES: Record<NonNullable<Disaster>, Record<HeldId, string[]>> = {
  freeze: {
    overowa: ['FREEZING!!', 'systems frozen!', 'ICE!!'],
    firefly: ['my circuits!!', 'COLD!!', 'frozen~'],
    stinger: ['bzz-brr!!', 'ICE WAVE!!', 'COLD!'],
    bear:    ['BRRR!!', 'too cold!', 'HIDE!!'],
    dog:     ['AWOOO!!', 'cold paws!!', 'BRRR!!'],
    cat:     ['HISS!!', 'COLD!!!', 'inside NOW'],
  },
  tornado: {
    overowa: ['TORNADO!!', 'take cover!!', 'RUN!!'],
    firefly: ['SPINNING!!', 'TOO WINDY!', 'HELP!!'],
    stinger: ['BZZZZ!!', 'TOO WINDY!', 'RUN RUN!'],
    bear:    ['WOAH!!', 'SCARY!!', 'RUN!!'],
    dog:     ['BORKKK!!', 'WOAH!!', 'RUN RUN!!'],
    cat:     ['NO!!', 'TORNADO!!', 'HIDE NOW!!'],
  },
  meteor: {
    overowa: ['METEOR!!', 'INCOMING!!', 'EVACUATE!!'],
    firefly: ['AHHH!!', 'METEOR!!', 'RUN!!'],
    stinger: ['IMPACT!!', 'bzz FLEE!!', 'RUN!!'],
    bear:    ['ROOAR!!', 'METEOR!!', 'RUN!!'],
    dog:     ['WOOF WOOF!!', 'AWOOO!!', 'RUN!!'],
    cat:     ['MRROW!!', 'SKY FALLING!!', 'FLEE!!'],
  },
};
const MILESTONES: Record<number, string> = {
  5: '★ NICE CATCH! ★', 10: '★★ GREAT WORK ★★',
  20: '★★★ UNSTOPPABLE ★★★', 50: '★★★★ LEGENDARY ★★★★',
};
const MUSHROOM_INDICES = [7, 23];
const DECORATIONS = [
  { type: 'tree',     x: 4,   tall: true },
  { type: 'fence',    x: 8  },
  { type: 'bush',     x: 11 },
  { type: 'flower',   x: 17,  color: '#FF6B9D' },
  { type: 'flower',   x: 19,  color: '#FFE135' },
  { type: 'tree',     x: 26 },
  { type: 'fence',    x: 30 },
  { type: 'mushroom', x: 34 },
  { type: 'rock',     x: 38 },
  { type: 'lantern',  x: 42 },
  { type: 'house_b',  x: 45 },
  { type: 'fence',    x: 50 },
  { type: 'snowman',  x: 53 },
  { type: 'flower',   x: 55,  color: '#39FF6A' },
  { type: 'lantern',  x: 58 },
  { type: 'house_a',  x: 60 },
  { type: 'fence',    x: 65 },
  { type: 'bush',     x: 68 },
  { type: 'tree',     x: 73,  tall: true },
  { type: 'flower',   x: 78,  color: '#FF8C32' },
  { type: 'flower',   x: 80,  color: '#c084fc' },
  { type: 'rock',     x: 84 },
  { type: 'fence',    x: 86 },
  { type: 'mushroom', x: 89 },
  { type: 'flower',   x: 92,  color: '#FF6B9D' },
  { type: 'tree',     x: 97,  tall: true },
];
const STARS_BG = [
  { x: 8,  y: 6,  d: 1.2 }, { x: 22, y: 3,  d: 2.1 }, { x: 38, y: 9,  d: 1.8 },
  { x: 55, y: 4,  d: 2.4 }, { x: 70, y: 11, d: 1.5 }, { x: 85, y: 5,  d: 2.0 },
  { x: 15, y: 20, d: 1.7 }, { x: 32, y: 15, d: 2.3 }, { x: 48, y: 22, d: 1.4 },
  { x: 62, y: 8,  d: 1.9 }, { x: 78, y: 18, d: 2.2 }, { x: 92, y: 13, d: 1.6 },
];

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
    to   { transform: translateX(calc(100vw + 80px)); }
  }
  @keyframes cloud-l {
    from { transform: translateX(calc(100vw + 80px)); }
    to   { transform: translateX(-80px); }
  }
  @keyframes twinkle {
    0%, 100% { opacity: 0.15; transform: scale(1); }
    50%       { opacity: 1;    transform: scale(1.4); }
  }
  @keyframes score-rise {
    0%   { opacity: 1; transform: translateY(0); }
    100% { opacity: 0; transform: translateY(-44px); }
  }
  @keyframes obj-fall {
    from { top: -50px; }
    to   { top: calc(100vh - 110px); }
  }
  @keyframes obj-pop {
    0%   { opacity: 1; transform: scale(1) rotate(0deg); }
    100% { opacity: 0; transform: scale(2.8) rotate(180deg); }
  }
  @keyframes held-wobble {
    0%, 100% { transform: scale(1.35) rotate(-9deg); }
    50%       { transform: scale(1.35) rotate(9deg); }
  }
  @keyframes held-shake {
    0%   { transform: scale(1.35) rotate(-22deg); }
    25%  { transform: scale(1.35) rotate(22deg); }
    50%  { transform: scale(1.35) rotate(-22deg); }
    75%  { transform: scale(1.35) rotate(22deg); }
    100% { transform: scale(1.35) rotate(-9deg); }
  }
  @keyframes bounce-land {
    0%   { transform: translateY(0); }
    30%  { transform: translateY(-14px); }
    60%  { transform: translateY(4px); }
    80%  { transform: translateY(-4px); }
    100% { transform: translateY(0); }
  }
  @keyframes heart-pop {
    0%   { opacity: 1; transform: scale(0.5) translateY(0); }
    60%  { opacity: 1; transform: scale(1.4) translateY(-14px); }
    100% { opacity: 0; transform: scale(1)   translateY(-26px); }
  }
  @keyframes mushroom-pulse {
    0%, 100% { transform: translateY(0) scale(1); }
    50%       { transform: translateY(-4px) scale(1.12); }
  }
  @keyframes milestone {
    0%   { opacity: 0; transform: translateX(-50%) scale(0.7); }
    15%  { opacity: 1; transform: translateX(-50%) scale(1.05); }
    80%  { opacity: 1; transform: translateX(-50%) scale(1); }
    100% { opacity: 0; transform: translateX(-50%) scale(1); }
  }
  @keyframes sun-spin {
    from { transform: rotate(0deg); }
    to   { transform: rotate(360deg); }
  }
  @keyframes lightning-flash {
    0%   { opacity: 0; }
    5%   { opacity: 0.35; }
    10%  { opacity: 0; }
    15%  { opacity: 0.2; }
    20%  { opacity: 0; }
    100% { opacity: 0; }
  }
  @keyframes snow-drift {
    0%   { transform: translateX(0px) rotate(0deg); }
    33%  { transform: translateX(6px) rotate(120deg); }
    66%  { transform: translateX(-4px) rotate(240deg); }
    100% { transform: translateX(0px) rotate(360deg); }
  }
  @keyframes shoot-star {
    0%   { opacity: 0;   transform: translate(0px, 0px)     rotate(30deg); }
    8%   { opacity: 1;   transform: translate(0px, 0px)     rotate(30deg); }
    92%  { opacity: 0.9; transform: translate(200px, 92px)  rotate(30deg); }
    100% { opacity: 0;   transform: translate(225px, 104px) rotate(30deg); }
  }
  @keyframes freeze-sweep {
    0%   { transform: translateX(-100%); }
    100% { transform: translateX(320%); }
  }
  @keyframes freeze-bg {
    0%   { opacity: 0; }
    20%  { opacity: 1; }
    75%  { opacity: 0.7; }
    100% { opacity: 0; }
  }
  @keyframes tornado-move {
    0%   { transform: translateX(0px); }
    100% { transform: translateX(calc(-110vw - 200px)); }
  }
  @keyframes tornado-sway {
    0%, 100% { transform: skewX(-3deg) scaleX(0.95); }
    50%       { transform: skewX(3deg)  scaleX(1.05); }
  }
  @keyframes big-meteor-fall {
    0%   { opacity: 0; transform: translate(0, 0)               rotate(23deg); }
    5%   { opacity: 1; transform: translate(0, 0)               rotate(23deg); }
    100% { opacity: 1; transform: translate(-46vw, calc(108vh)) rotate(23deg); }
  }
  @keyframes impact-ring {
    0%   { transform: scale(0.05); opacity: 1; }
    40%  { opacity: 0.8; }
    100% { transform: scale(14);   opacity: 0; }
  }
  @keyframes impact-ring2 {
    0%   { transform: scale(0.1);  opacity: 0.6; }
    100% { transform: scale(9);    opacity: 0; }
  }
  @keyframes crater-appear {
    0%   { opacity: 0; transform: scaleX(0.2); }
    60%  { opacity: 1; transform: scaleX(1); }
    100% { opacity: 0.7; transform: scaleX(1); }
  }
  @keyframes scene-shake {
    0%   { transform: translate(0,0); }
    12%  { transform: translate(-9px,-5px); }
    25%  { transform: translate(9px, 5px); }
    37%  { transform: translate(-6px, 3px); }
    50%  { transform: translate(6px,-3px); }
    62%  { transform: translate(-3px,0); }
    75%  { transform: translate(3px, 2px); }
    87%  { transform: translate(-1px,0); }
    100% { transform: translate(0,0); }
  }
  .scene-shaking { animation: scene-shake 0.55s ease-out forwards; }
  .agent-held  { animation: held-wobble 0.4s ease-in-out infinite !important; }
  .agent-shake { animation: held-shake  0.3s ease-in-out !important; }
  .agent-land  { animation: bounce-land 0.5s ease-out forwards !important; }
  .shroom-pop  { animation: mushroom-pulse 0.5s ease-in-out infinite; cursor: pointer; }
`;

type FallObj   = { id: number; x: number; duration: number; popped: boolean };
type Flash     = { id: number; x: number; y: number; pts: number };
type Heart     = { id: number; x: number; y: number };
type ShootStar = { id: number; x: number; y: number };

/* ── page ────────────────────────────────────────────────────────────── */
export default function Page() {
  const [mode, setMode] = useState<Mode>('night');

  /* drag */
  const [held,    setHeld]    = useState<HeldId | null>(null);
  const [heldPos, setHeldPos] = useState({ x: 0, y: 0 });
  const [shaking, setShaking] = useState(false);
  const [landing, setLanding] = useState<HeldId | null>(null);

  /* bubbles */
  const [bubbles, setBubbles] = useState<Record<HeldId, string | null>>({
    overowa: null, firefly: null, stinger: null, bear: null, dog: null, cat: null,
  });

  /* games */
  const [score,     setScore]     = useState(0);
  const [fallObjs,  setFallObjs]  = useState<FallObj[]>([]);
  const [flashes,   setFlashes]   = useState<Flash[]>([]);
  const [hearts,    setHearts]    = useState<Heart[]>([]);
  const [milestone, setMilestone] = useState<string | null>(null);
  const [popShroom,  setPopShroom]  = useState<number | null>(null);
  const [lightning,  setLightning]  = useState(false);
  const [shootStars, setShootStars] = useState<ShootStar[]>([]);
  const [disaster,    setDisaster]    = useState<Disaster>(null);
  const [mobsHidden,  setMobsHidden]  = useState(false);
  const [impactFlash, setImpactFlash] = useState(false);
  const [shakeScene,  setShakeScene]  = useState(false);
  const [corrupted,   setCorrupted]   = useState<Set<HeldId>>(new Set());

  const heldRef      = useRef<HeldId | null>(null);
  const modeRef      = useRef<Mode>('night');
  const prevMouse    = useRef({ x: 0, y: 0, t: 0 });
  const shakeTimer   = useRef<ReturnType<typeof setTimeout> | null>(null);
  const disasterTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const objId        = useRef(0);
  const flashId      = useRef(0);
  const heartId      = useRef(0);
  const shootId      = useRef(0);

  useEffect(() => { heldRef.current = held; }, [held]);
  useEffect(() => { modeRef.current = mode; }, [mode]);

  /* mouse */
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const now = Date.now(), dx = e.clientX - prevMouse.current.x, dy = e.clientY - prevMouse.current.y;
      const dt = Math.max(1, now - prevMouse.current.t), speed = Math.sqrt(dx*dx+dy*dy)/dt;
      prevMouse.current = { x: e.clientX, y: e.clientY, t: now };
      if (heldRef.current) {
        setHeldPos({ x: e.clientX, y: e.clientY });
        if (speed > 1.8 && !shakeTimer.current) {
          setShaking(true);
          shakeTimer.current = setTimeout(() => { setShaking(false); shakeTimer.current = null; }, 350);
          triggerBubble(heldRef.current, SHAKE_BUBBLES[heldRef.current]);
        }
      }
    };
    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  const triggerBubble = useCallback((id: HeldId, pool: string[]) => {
    const text = pool[Math.floor(Math.random() * pool.length)];
    setBubbles(b => ({ ...b, [id]: text }));
    setTimeout(() => setBubbles(b => ({ ...b, [id]: null })), 1700);
  }, []);

  /* passive chatter */
  useEffect(() => {
    const ids: HeldId[] = ['overowa', 'firefly', 'stinger', 'bear', 'dog', 'cat'];
    const t = setInterval(() => {
      const id = ids[Math.floor(Math.random() * ids.length)];
      if (heldRef.current !== id) {
        const pool = modeRef.current === 'storm' ? STORM_BUBBLES[id] : PASSIVE_BUBBLES[id];
        triggerBubble(id, pool);
      }
    }, 4500);
    return () => clearInterval(t);
  }, [triggerBubble]);

  /* pick up */
  function pickUp(id: HeldId, e: React.MouseEvent) {
    e.stopPropagation();
    if (held) return;
    setHeld(id); setHeldPos({ x: e.clientX, y: e.clientY });
    triggerBubble(id, GRAB_BUBBLES[id]);
  }

  /* drop */
  const heldPosRef = useRef(heldPos);
  useEffect(() => { heldPosRef.current = heldPos; }, [heldPos]);

  function drop(e?: React.MouseEvent) {
    e?.stopPropagation();
    if (!held) return;
    const id = held, pos = heldPosRef.current;
    setHeld(null); setShaking(false);
    if (shakeTimer.current) { clearTimeout(shakeTimer.current); shakeTimer.current = null; }
    setLanding(id); setTimeout(() => setLanding(null), 500);
    triggerBubble(id, DROP_BUBBLES[id]);
    for (let i = 0; i < 3; i++) {
      const hid = heartId.current++;
      setHearts(h => [...h, { id: hid, x: pos.x + (Math.random()-0.5)*40, y: pos.y + (Math.random()-0.5)*20 }]);
      setTimeout(() => setHearts(h => h.filter(x => x.id !== hid)), 720);
    }
  }
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') drop(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [held]);

  /* disasters */
  function triggerDisaster(type: NonNullable<Disaster>) {
    if (disaster) return;
    setDisaster(type);
    setMobsHidden(true);
    // all characters panic
    const pool = DISASTER_BUBBLES[type];
    (['overowa', 'firefly', 'stinger', 'bear', 'dog', 'cat'] as HeldId[]).forEach(id =>
      triggerBubble(id, pool[id])
    );
    // meteor-specific: impact flash + screen shake at end of fall
    if (type === 'meteor') {
      setTimeout(() => {
        setImpactFlash(true);
        setShakeScene(true);
        setTimeout(() => setImpactFlash(false), 650);
        setTimeout(() => setShakeScene(false),  750);
      }, 2700);
    }
    const dur = type === 'tornado' ? 9000 : 6000;
    if (disasterTimer.current) clearTimeout(disasterTimer.current);
    disasterTimer.current = setTimeout(() => {
      setDisaster(null);
      setMobsHidden(false);
      // permanently corrupt every mob that wasn't being held (they don't return)
      const survivor = heldRef.current;
      const all: HeldId[] = ['overowa', 'firefly', 'stinger', 'bear', 'dog', 'cat'];
      setCorrupted(prev => {
        const next = new Set(prev);
        all.forEach(id => { if (id !== survivor) next.add(id); });
        return next;
      });
      const survivorMsg = survivor ? ` · ${survivor} survived` : '';
      setMilestone(`☠ ALL CORRUPTED${survivorMsg} ☠`);
      setTimeout(() => setMilestone(null), 3200);
    }, dur);
  }

  /* falling objects (stars / snowflakes / rain) */
  useEffect(() => {
    const spawnInterval = () => mode === 'storm' ? 280 + Math.random() * 120 : mode === 'winter' ? 1800 + Math.random() * 1000 : 2000 + Math.random() * 800;
    const fallDuration  = () => mode === 'storm' ? 0.6 + Math.random() * 0.6 : mode === 'winter' ? 5 + Math.random() * 4 : 3.5 + Math.random() * 3.5;

    const spawn = () => {
      const id = objId.current++, x = 3 + Math.random() * 92, dur = fallDuration();
      setFallObjs(s => [...s, { id, x, duration: dur, popped: false }]);
      setTimeout(() => setFallObjs(s => s.filter(o => o.id !== id)), (dur + 0.5) * 1000);
    };
    spawn();
    let interval: ReturnType<typeof setTimeout>;
    const schedule = () => { interval = setTimeout(() => { spawn(); schedule(); }, spawnInterval()); };
    schedule();
    return () => clearTimeout(interval);
  }, [mode]);

  function catchObj(e: React.MouseEvent, oid: number) {
    e.stopPropagation();
    setFallObjs(s => s.map(o => o.id === oid ? { ...o, popped: true } : o));
    setTimeout(() => setFallObjs(s => s.filter(o => o.id !== oid)), 380);
    addScore(1, e.clientX - 8, e.clientY - 22);
  }

  /* mushroom */
  useEffect(() => {
    const t = setInterval(() => {
      const idx = MUSHROOM_INDICES[Math.floor(Math.random() * MUSHROOM_INDICES.length)];
      setPopShroom(idx); setTimeout(() => setPopShroom(null), 3200);
    }, 7000 + Math.random() * 4000);
    return () => clearInterval(t);
  }, []);
  function whackMushroom(e: React.MouseEvent, idx: number) {
    e.stopPropagation(); if (popShroom !== idx) return;
    setPopShroom(null); addScore(2, e.clientX - 8, e.clientY - 22);
  }

  /* lightning */
  useEffect(() => {
    if (mode !== 'storm') { setLightning(false); return; }
    const t = setInterval(() => {
      setLightning(true); setTimeout(() => setLightning(false), 400);
    }, 4000 + Math.random() * 6000);
    return () => clearInterval(t);
  }, [mode]);

  /* shooting stars (night only) */
  useEffect(() => {
    if (mode !== 'night') { setShootStars([]); return; }
    let timer: ReturnType<typeof setTimeout>;
    const schedule = () => {
      timer = setTimeout(() => {
        const id = shootId.current++;
        const x  = 8  + Math.random() * 52;
        const y  = 3  + Math.random() * 22;
        setShootStars(s => [...s, { id, x, y }]);
        setTimeout(() => setShootStars(s => s.filter(ss => ss.id !== id)), 1100);
        schedule();
      }, 5000 + Math.random() * 9000);
    };
    schedule();
    return () => clearTimeout(timer);
  }, [mode]);

  function addScore(pts: number, x: number, y: number) {
    setScore(prev => {
      const next = prev + pts;
      if (MILESTONES[next]) { setMilestone(MILESTONES[next]); setTimeout(() => setMilestone(null), 2000); }
      return next;
    });
    const fid = flashId.current++;
    setFlashes(f => [...f, { id: fid, x, y, pts }]);
    setTimeout(() => setFlashes(f => f.filter(fl => fl.id !== fid)), 850);
  }

  /* colours per mode */
  const SKY = mode === 'night'
    ? 'linear-gradient(180deg, #06080a 0%, #0c0e10 60%, #111822 100%)'
    : mode === 'winter'
    ? 'linear-gradient(180deg, #a8c8e8 0%, #c0d8f0 40%, #d8ecf8 80%, #eef6fc 100%)'
    : 'linear-gradient(180deg, #0a0c14 0%, #12141e 40%, #1a1c28 80%, #12141e 100%)';
  const GRASS_COL = mode === 'winter' ? '#c8dce8' : mode === 'storm' ? '#1a241a' : '#2d5c1a';
  const DIRT_GRAD = mode === 'winter'
    ? 'linear-gradient(180deg, #d0e4f4 0%, #b8d0e8 40%, #a0c0da 100%)'
    : mode === 'storm'
    ? 'linear-gradient(180deg, #1e1a14 0%, #181410 100%)'
    : 'linear-gradient(180deg, #4a3520 0%, #3d2b1a 40%, #2e1e0e 100%)';

  const MODE_LABELS: Record<Mode, string> = { night: 'Night', winter: 'Winter', storm: 'Storm' };
  const NEXT_MODE:  Record<Mode, Mode>    = { night: 'winter', winter: 'storm', storm: 'night' };
  const SCORE_ICON: Record<Mode, string>  = { night: '★', winter: '❄', storm: '💧' };

  return (
    <>
      <style>{STYLES}</style>

      {/* lightning overlay */}
      {lightning && (
        <div style={{ position: 'fixed', inset: 0, background: '#e8f0ff', zIndex: 800, pointerEvents: 'none', animation: 'lightning-flash 0.4s ease-out forwards' }} />
      )}

      {/* ── disaster overlays ──────────────────────────────────────────── */}

      {/* freeze wave — colors vary by mode */}
      {disaster === 'freeze' && (
        <>
          <div style={{
            position: 'fixed', inset: 0, zIndex: 720, pointerEvents: 'none',
            background: mode === 'winter'
              ? 'rgba(225,246,255,0.55)'
              : mode === 'storm'
              ? 'rgba(55,75,120,0.48)'
              : 'rgba(155,198,240,0.36)',
            animation: 'freeze-bg 6s ease-out forwards',
          }} />
          <div style={{
            position: 'fixed', top: 0, left: 0, width: '50vw', height: '100vh', zIndex: 730, pointerEvents: 'none',
            background: mode === 'winter'
              ? 'linear-gradient(90deg,transparent,rgba(248,254,255,0.97),transparent)'
              : mode === 'storm'
              ? 'linear-gradient(90deg,transparent,rgba(90,120,180,0.88),transparent)'
              : 'linear-gradient(90deg,transparent,rgba(195,228,255,0.96),transparent)',
            animation: 'freeze-sweep 2s ease-in-out forwards',
          }} />
        </>
      )}

      {/* tornado — sprite is mode-aware */}
      {disaster === 'tornado' && (
        <div style={{ position: 'fixed', bottom: '90px', right: '-140px', zIndex: 700, pointerEvents: 'none', animation: 'tornado-move 9s linear forwards' }}>
          <div style={{ animation: 'tornado-sway 0.32s ease-in-out infinite' }}>
            <TornadoSprite mode={mode} />
          </div>
        </div>
      )}

      {/* big meteorite — sprite + glow tint are mode-aware */}
      {disaster === 'meteor' && (
        <div style={{
          position: 'fixed', right: '9%', top: '-12%', zIndex: 720, pointerEvents: 'none',
          animation: 'big-meteor-fall 2.8s ease-in forwards',
          filter: mode === 'winter'
            ? 'drop-shadow(0 0 24px rgba(80,170,255,0.9))'
            : mode === 'storm'
            ? 'drop-shadow(0 0 20px rgba(140,130,230,0.85))'
            : 'drop-shadow(0 0 30px rgba(255,130,20,0.95))',
        }}>
          <BigMeteoriteSprite mode={mode} />
        </div>
      )}
      {impactFlash && (
        <>
          <div style={{
            position: 'fixed', inset: 0, zIndex: 740, pointerEvents: 'none',
            background: mode === 'winter' ? '#d8f0ff' : mode === 'storm' ? '#d0d0ff' : '#fff4c0',
            animation: 'lightning-flash 0.65s ease-out forwards',
          }} />
          {/* primary ring */}
          <div style={{
            position: 'fixed', bottom: '90px', left: '41%', transform: 'translateX(-50%)',
            width: 110, height: 110, borderRadius: '50%',
            border: `8px solid ${mode === 'winter' ? '#60b0ff' : mode === 'storm' ? '#9090dd' : '#FF8C32'}`,
            background: mode === 'winter' ? 'rgba(80,160,255,0.12)' : mode === 'storm' ? 'rgba(120,120,220,0.12)' : 'rgba(255,160,40,0.14)',
            zIndex: 752, pointerEvents: 'none', animation: 'impact-ring 1.1s ease-out forwards',
          }} />
          {/* secondary ring */}
          <div style={{
            position: 'fixed', bottom: '90px', left: '41%', transform: 'translateX(-50%)',
            width: 60, height: 60, borderRadius: '50%',
            border: `5px solid ${mode === 'winter' ? '#a0d8ff' : mode === 'storm' ? '#b8b8ee' : '#FFD060'}`,
            zIndex: 753, pointerEvents: 'none', animation: 'impact-ring2 0.9s ease-out forwards',
          }} />
        </>
      )}

      {/* HUD */}
      <div style={{ position: 'fixed', top: 8, right: 12, zIndex: 50, display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 5 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <button
            onClick={() => setMode(m => NEXT_MODE[m])}
            style={{
              background: mode === 'winter' ? 'rgba(200,230,250,0.9)' : mode === 'storm' ? 'rgba(14,16,28,0.9)' : 'rgba(20,24,32,0.85)',
              border: `1px solid ${mode === 'winter' ? '#90bcd8' : mode === 'storm' ? '#2a304a' : '#252d3a'}`,
              borderRadius: 5, padding: '3px 10px', cursor: 'pointer',
              fontFamily: 'monospace', fontSize: 9,
              color: mode === 'winter' ? '#1a4060' : mode === 'storm' ? '#6080a0' : '#8896a8',
              transition: 'all 0.3s',
            }}
          >{MODE_LABELS[mode]}</button>
          <div style={{ fontFamily: 'monospace', fontSize: 11, color: mode === 'winter' ? '#4488bb' : mode === 'storm' ? '#4a6080' : '#FFE135', pointerEvents: 'none', letterSpacing: '0.1em' }}>
            {SCORE_ICON[mode]} {score}
          </div>
        </div>
        {/* disaster buttons */}
        <div style={{ display: 'flex', gap: 4 }}>
          {([
            { key: 'freeze',  icon: '❄',  label: 'Freeze',  bg: 'rgba(190,225,255,0.88)', col: '#1a4060', bc: '#70aacc' },
            { key: 'tornado', icon: '🌀', label: 'Tornado', bg: 'rgba(28,22,44,0.90)',    col: '#9080d0', bc: '#4a3878' },
            { key: 'meteor',  icon: '☄',  label: 'Meteor',  bg: 'rgba(40,14,6,0.90)',     col: '#ff7030', bc: '#882010' },
          ] as const).map(d => (
            <button key={d.key}
              onClick={() => triggerDisaster(d.key)}
              disabled={!!disaster}
              style={{
                background: disaster ? 'rgba(20,22,28,0.7)' : d.bg,
                border: `1px solid ${disaster ? '#2a2e38' : d.bc}`,
                borderRadius: 5, padding: '2px 7px', cursor: disaster ? 'not-allowed' : 'pointer',
                fontFamily: 'monospace', fontSize: 9,
                color: disaster ? '#3a4050' : d.col,
                opacity: disaster ? 0.45 : 1,
                transition: 'all 0.25s',
              }}
            >{d.icon} {d.label}</button>
          ))}
        </div>
        {/* respawn button — only visible when animals are corrupted */}
        {corrupted.size > 0 && !disaster && (
          <button
            onClick={() => {
              setCorrupted(new Set());
              setMilestone('✦ ALL RESPAWNED ✦');
              setTimeout(() => setMilestone(null), 2000);
            }}
            style={{
              background: 'rgba(20,40,20,0.90)',
              border: '1px solid #2a6a2a',
              borderRadius: 5, padding: '2px 10px', cursor: 'pointer',
              fontFamily: 'monospace', fontSize: 9, color: '#39FF6A',
              transition: 'all 0.25s', alignSelf: 'flex-end',
            }}
          >↺ Respawn</button>
        )}
      </div>

      <div style={{ position: 'fixed', top: 10, left: '50%', transform: 'translateX(-50%)', zIndex: 50, fontFamily: 'monospace', fontSize: 9, color: mode === 'winter' ? '#4a6a80' : mode === 'storm' ? '#4a5060' : '#8896a8', pointerEvents: 'none', opacity: 0.8, whiteSpace: 'nowrap' }}>
        grab anyone · catch {SCORE_ICON[mode]} · whack glowing mushrooms
      </div>

      {milestone && <MilestoneBanner text={milestone} />}
      {flashes.map(f => <ScoreFlash key={f.id} x={f.x} y={f.y} pts={f.pts} />)}
      {hearts.map(h => (
        <div key={h.id} style={{ position: 'fixed', left: h.x, top: h.y, zIndex: 400, fontSize: 14, color: '#FF6B9D', pointerEvents: 'none', animation: 'heart-pop 0.72s ease-out forwards' }}>♥</div>
      ))}

      {/* held sprite */}
      {held && (
        <div onClick={drop} style={{ position: 'fixed', left: heldPos.x - 24, top: heldPos.y - 24, zIndex: 500, cursor: 'grabbing', filter: 'drop-shadow(0 6px 18px rgba(0,0,0,0.9))' }} className={shaking ? 'agent-shake' : 'agent-held'}>
          {held === 'overowa' && <AgentSprite id="overowa" />}
          {held === 'firefly' && <AgentSprite id="firefly" />}
          {held === 'stinger' && <AgentSprite id="stinger" />}
          {held === 'bear'    && <ButterbearSprite />}
          {held === 'dog'     && <DogSprite />}
          {held === 'cat'     && <CatSprite />}
          {bubbles[held] && <SpeechBubble text={bubbles[held]!} />}
        </div>
      )}

      {/* falling objects with large hitbox */}
      {fallObjs.map(obj => (
        <div key={obj.id} onClick={e => !obj.popped && catchObj(e, obj.id)}
          style={{
            position: 'fixed', left: `${obj.x}vw`, zIndex: 45,
            cursor: obj.popped ? 'default' : 'pointer', userSelect: 'none',
            padding: '22px', marginLeft: '-22px', marginTop: '-22px',
            animation: obj.popped ? 'obj-pop 0.38s ease-out forwards' : `obj-fall ${obj.duration}s linear forwards`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >
          {mode === 'night' && (
            <span style={{ fontSize: 20, lineHeight: 1, color: '#FFE135', filter: obj.popped ? 'none' : 'drop-shadow(0 0 6px #FFE135)' }}>★</span>
          )}
          {mode === 'winter' && (
            <span style={{ fontSize: 20, lineHeight: 1, color: '#a8d8f8', filter: obj.popped ? 'none' : 'drop-shadow(0 0 5px #80c8f0)', display: 'inline-block', animation: obj.popped ? 'none' : 'snow-drift 3s linear infinite' }}>❄</span>
          )}
          {mode === 'storm' && (
            <span style={{ fontSize: 14, lineHeight: 1, color: '#6888aa', filter: obj.popped ? 'none' : 'none', display: 'inline-block', transform: 'rotate(12deg)', letterSpacing: 0 }}>╷</span>
          )}
        </div>
      ))}

      {/* scene */}
      <div className={`relative w-full h-full overflow-hidden select-none${shakeScene ? ' scene-shaking' : ''}`} style={{ background: SKY, cursor: held ? 'grabbing' : 'default', transition: 'background 0.8s' }}>

        {/* sky objects */}
        {mode === 'night'   && <div style={{ position: 'absolute', top: '7%', right: '9%', zIndex: 3 }}><Moon /></div>}
        {mode === 'winter'  && <div style={{ position: 'absolute', top: '6%', right: '8%', zIndex: 3 }}><SnowMoon /></div>}
        {mode === 'night'   && STARS_BG.map((s, i) => (
          <div key={i} className="absolute rounded-full bg-white" style={{ width: 2, height: 2, left: `${s.x}%`, top: `${s.y}%`, animation: `twinkle ${s.d}s ease-in-out infinite`, animationDelay: `${(i * 0.37).toFixed(2)}s` }} />
        ))}

        {/* shooting stars */}
        {shootStars.map(ss => (
          <div key={ss.id} style={{
            position: 'absolute', left: `${ss.x}%`, top: `${ss.y}%`, zIndex: 4,
            pointerEvents: 'none', width: 55, height: 2, borderRadius: 1,
            background: 'linear-gradient(to right, rgba(255,240,150,0) 0%, rgba(255,240,150,0.95) 100%)',
            animation: 'shoot-star 1.05s ease-in forwards',
          }} />
        ))}

        {/* clouds — storm clouds faster */}
        <div style={{ position: 'absolute', top: '12%', animation: `cloud-r ${mode === 'storm' ? '12s' : '45s'} linear infinite` }}><Cloud mode={mode} /></div>
        <div style={{ position: 'absolute', top: '22%', animation: `cloud-l ${mode === 'storm' ? '9s'  : '60s'} linear infinite` }}><Cloud mode={mode} /></div>
        <div style={{ position: 'absolute', top: '6%',  animation: `cloud-r ${mode === 'storm' ? '15s' : '70s'} linear infinite`, animationDelay: '-7s' }}><Cloud mode={mode} /></div>
        {mode === 'storm' && <>
          <div style={{ position: 'absolute', top: '30%', animation: 'cloud-l 10s linear infinite', animationDelay: '-4s' }}><Cloud mode={mode} /></div>
          <div style={{ position: 'absolute', top: '16%', animation: 'cloud-r 8s linear infinite',  animationDelay: '-2s' }}><Cloud mode={mode} /></div>
        </>}

        {/* title + nav */}
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-6" style={{ paddingBottom: GROUND }}>
          <div className="flex flex-col items-center gap-2 pointer-events-none">
            <div className="font-mono font-bold tracking-[0.35em] uppercase" style={{ fontSize: 13, color: mode === 'night' ? '#FFE135' : mode === 'winter' ? '#1a4060' : '#3a4870' }}>★ MISSION CONTROL ★</div>
            <div className="font-mono tracking-widest uppercase" style={{ fontSize: 9, opacity: 0.55, color: mode === 'night' ? '#8896a8' : mode === 'winter' ? '#3a6080' : '#3a4060' }}>3 AGENTS · 3 CRITTERS · ALL SYSTEMS GO</div>
          </div>
          <div className="flex gap-3">
            {[
              { href: '/tasks',    label: 'Tasks',    icon: <FolderKanban size={14} />,   color: 'text-greenBright border-greenBright' },
              { href: '/calendar', label: 'Calendar', icon: <Calendar size={14} />,        color: 'text-amberBright border-amberBright' },
              { href: '/memory',   label: 'Memory',   icon: <Brain size={14} />,           color: mode === 'night' ? 'text-yellowBright border-yellowBright' : 'text-amber-600 border-amber-600' },
              { href: '/team',     label: 'Team',     icon: <Users size={14} />,            color: 'text-blue-400 border-blue-400' },
              { href: '/projects', label: 'Projects', icon: <LayoutDashboard size={14} />, color: 'text-emberGlow border-emberGlow' },
            ].map(route => (
              <Link key={route.href} href={route.href} onClick={e => e.stopPropagation()}
                className={`flex items-center gap-2 px-3 py-2 border rounded font-mono uppercase tracking-widest transition-all backdrop-blur-sm ${route.color}`}
                style={{ fontSize: 10, background: mode === 'winter' ? 'rgba(255,255,255,0.6)' : mode === 'storm' ? 'rgba(10,12,20,0.85)' : 'rgba(20,24,32,0.8)' }}
              >
                {route.icon}{route.label}
              </Link>
            ))}
          </div>
        </div>

        {/* decorations */}
        {DECORATIONS.map((d, i) => {
          const glowing = popShroom === i;
          return (
            <div key={i} style={{ position: 'absolute', bottom: GROUND, left: `${d.x}%`, transform: 'translateX(-50%)', zIndex: 10 }}
              onClick={glowing ? e => whackMushroom(e, i) : undefined}
            >
              {d.type === 'tree'     && <Tree tall={(d as any).tall} mode={mode} />}
              {d.type === 'bush'     && <Bush mode={mode} />}
              {d.type === 'flower'   && <Flower color={(d as any).color} mode={mode} />}
              {d.type === 'mushroom' && (
                <div className={glowing ? 'shroom-pop' : ''} style={{ position: 'relative' }}>
                  <Mushroom glowing={glowing} mode={mode} />
                  {glowing && <div style={{ position: 'absolute', bottom: '110%', left: '50%', transform: 'translateX(-50%)', fontSize: 9, fontFamily: 'monospace', color: '#FF4D1A', fontWeight: 'bold', whiteSpace: 'nowrap', pointerEvents: 'none' }}>CLICK! +2</div>}
                </div>
              )}
              {d.type === 'rock'    && <Rock />}
              {d.type === 'fence'   && <Fence mode={mode} />}
              {d.type === 'lantern' && <Lantern mode={mode} />}
              {d.type === 'snowman' && mode === 'winter' && <Snowman />}
              {d.type === 'house_a' && <HouseA mode={mode} />}
              {d.type === 'house_b' && <HouseB mode={mode} />}
            </div>
          );
        })}

        {/* OverOwa */}
        {!corrupted.has('overowa') && (
        <div style={{ position: 'absolute', bottom: GROUND, zIndex: 20, animation: held === 'overowa' ? 'none' : 'walk-right 18s linear infinite', opacity: held === 'overowa' || mobsHidden ? 0 : 1, transition: 'opacity 0.3s' }}>
          <div onClick={e => pickUp('overowa', e)} className={landing === 'overowa' ? 'agent-land' : ''} style={{ cursor: 'grab', position: 'relative' }}>
            <AgentSprite id="overowa" />
            {bubbles.overowa && held !== 'overowa' && <SpeechBubble text={bubbles.overowa} />}
          </div>
        </div>
        )}

        {/* Stinger */}
        {!corrupted.has('stinger') && (
        <div style={{ position: 'absolute', bottom: GROUND, zIndex: 20, animation: held === 'stinger' ? 'none' : 'walk-left 12s linear infinite', animationDelay: '-5s', opacity: held === 'stinger' || mobsHidden ? 0 : 1, transition: 'opacity 0.3s' }}>
          <div onClick={e => pickUp('stinger', e)} className={landing === 'stinger' ? 'agent-land' : ''} style={{ cursor: 'grab', position: 'relative' }}>
            <AgentSprite id="stinger" />
            {bubbles.stinger && held !== 'stinger' && <SpeechBubble text={bubbles.stinger} />}
          </div>
        </div>
        )}

        {/* Firefly */}
        {!corrupted.has('firefly') && (
        <div style={{ position: 'absolute', bottom: GROUND + 22, zIndex: 20, animation: held === 'firefly' ? 'none' : 'walk-right 9s linear infinite', animationDelay: '-3s', opacity: held === 'firefly' || mobsHidden ? 0 : 1, transition: 'opacity 0.3s' }}>
          <div style={{ animation: held === 'firefly' ? 'none' : 'bob 0.5s ease-in-out infinite' }}>
            <div onClick={e => pickUp('firefly', e)} className={landing === 'firefly' ? 'agent-land' : ''} style={{ cursor: 'grab', position: 'relative' }}>
              <AgentSprite id="firefly" />
              {bubbles.firefly && held !== 'firefly' && <SpeechBubble text={bubbles.firefly} />}
            </div>
          </div>
        </div>
        )}

        {/* Butterbear */}
        {!corrupted.has('bear') && (
        <div style={{ position: 'absolute', bottom: GROUND, zIndex: 20, animation: held === 'bear' ? 'none' : 'walk-left 22s linear infinite', animationDelay: '-8s', opacity: held === 'bear' || mobsHidden ? 0 : 1, transition: 'opacity 0.3s' }}>
          <div onClick={e => pickUp('bear', e)} className={landing === 'bear' ? 'agent-land' : ''} style={{ cursor: 'grab', position: 'relative' }}>
            <ButterbearSprite />
            {bubbles.bear && held !== 'bear' && <SpeechBubble text={bubbles.bear} />}
          </div>
        </div>
        )}

        {/* Dog */}
        {!corrupted.has('dog') && (
        <div style={{ position: 'absolute', bottom: GROUND, zIndex: 20, animation: held === 'dog' ? 'none' : 'walk-right 14s linear infinite', animationDelay: '-6s', opacity: held === 'dog' || mobsHidden ? 0 : 1, transition: 'opacity 0.3s' }}>
          <div onClick={e => pickUp('dog', e)} className={landing === 'dog' ? 'agent-land' : ''} style={{ cursor: 'grab', position: 'relative' }}>
            <DogSprite />
            {bubbles.dog && held !== 'dog' && <SpeechBubble text={bubbles.dog} />}
          </div>
        </div>
        )}

        {/* Cat */}
        {!corrupted.has('cat') && (
        <div style={{ position: 'absolute', bottom: GROUND, zIndex: 20, animation: held === 'cat' ? 'none' : 'walk-left 8s linear infinite', animationDelay: '-2s', opacity: held === 'cat' || mobsHidden ? 0 : 1, transition: 'opacity 0.3s' }}>
          <div onClick={e => pickUp('cat', e)} className={landing === 'cat' ? 'agent-land' : ''} style={{ cursor: 'grab', position: 'relative' }}>
            <CatSprite />
            {bubbles.cat && held !== 'cat' && <SpeechBubble text={bubbles.cat} />}
          </div>
        </div>
        )}

        {/* snow on ground (winter) */}
        {mode === 'winter' && (
          <div className="absolute left-0 right-0" style={{ bottom: GROUND - GRASS, height: 6, background: '#eef6fc', zIndex: 8, opacity: 0.95 }} />
        )}

        {/* grass */}
        <div className="absolute left-0 right-0" style={{ bottom: GROUND - GRASS, height: GRASS, background: GRASS_COL, zIndex: 5, transition: 'background 0.8s' }} />
        {/* dirt */}
        <div className="absolute left-0 right-0 bottom-0" style={{ height: GROUND - GRASS, background: DIRT_GRAD, zIndex: 5, transition: 'background 0.8s' }} />
        {[8,18,28,36,45,53,62,71,80,88,95].map((x, i) => (
          <div key={i} className="absolute rounded-full" style={{ bottom: 8 + (i % 3) * 10, left: `${x}%`, width: 4, height: 3, background: mode === 'winter' ? '#b8d0e8' : '#2a1a0a', zIndex: 6, opacity: 0.5 }} />
        ))}
      </div>
    </>
  );
}
