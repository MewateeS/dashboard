"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Calendar,
  Brain,
  Users,
  FolderKanban,
  Home,
} from 'lucide-react';

const ROUTES = [
  { id: 'tasks',    label: 'Tasks',    path: '/tasks',    icon: <FolderKanban size={16} /> },
  { id: 'calendar', label: 'Calendar', path: '/calendar', icon: <Calendar size={16} /> },
  { id: 'memory',   label: 'Memory',   path: '/memory',   icon: <Brain size={16} /> },
  { id: 'team',     label: 'Team',     path: '/team',     icon: <Users size={16} /> },
  { id: 'projects', label: 'Projects', path: '/projects', icon: <LayoutDashboard size={16} /> },
];

const COLORS: Record<string, string> = {
  tasks:    'border-greenBright text-greenBright',
  calendar: 'border-amberBright text-amberBright',
  memory:   'border-yellowBright text-yellowBright',
  team:     'border-blue-400 text-blue-400',
  projects: 'border-emberGlow text-emberGlow',
};

const AGENTS = [
  { label: 'OVEROWA', color: 'bg-yellowBright' },
  { label: 'FIREFLY', color: 'bg-greenBright' },
  { label: 'STINGER', color: 'bg-amberBright' },
];

type BotStatus = 'checking' | 'online' | 'offline';

const HEARTBEAT_TIMEOUT_MS = 60_000;

function useBotStatus(): BotStatus {
  const [status, setStatus] = useState<BotStatus>('checking');

  useEffect(() => {
    let cancelled = false;

    async function check() {
      try {
        const res = await fetch('/api/heartbeat');
        const { ts } = await res.json();
        if (cancelled) return;
        if (ts && Date.now() - ts < HEARTBEAT_TIMEOUT_MS) {
          setStatus('online');
        } else {
          setStatus('offline');
        }
      } catch {
        if (!cancelled) setStatus('offline');
      }
    }

    check();
    const interval = setInterval(check, 20_000);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, []);

  return status;
}

const Sidebar: React.FC = () => {
  const pathname = usePathname();
  const botStatus = useBotStatus();

  const dotColor =
    botStatus === 'online'   ? 'bg-greenBright shadow-[0_0_6px_#4ade80]' :
    botStatus === 'offline'  ? 'bg-emberGlow' :
    'bg-smoke animate-pulse';

  return (
    <aside className="w-[220px] h-screen bg-surface border-r border-border flex flex-col font-mono text-white">
      {/* Top Logo Area */}
      <div className="p-4 border-b border-border flex items-center gap-3">
        <div className="w-6 h-6 bg-yellowBright rounded-sm flex items-center justify-center">
          <div className="w-3 h-3 bg-base rounded-full" />
        </div>
        <span className="text-[11px] font-bold tracking-wider">MISSION CONTROL</span>
      </div>

      {/* Bot Status */}
      <div className="px-4 py-4 border-b border-border space-y-2">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[9px] uppercase tracking-widest text-smoke opacity-50">Bot Process</span>
          <span className={`text-[9px] uppercase font-bold tracking-widest ${
            botStatus === 'online' ? 'text-greenBright' :
            botStatus === 'offline' ? 'text-emberGlow' : 'text-smoke'
          }`}>
            {botStatus === 'checking' ? '…' : botStatus}
          </span>
        </div>

        {AGENTS.map(a => (
          <div key={a.label} className="flex items-center gap-2 text-[11px] text-smoke">
            <div className={`w-2 h-2 rounded-full flex-shrink-0 transition-all duration-500 ${
              botStatus === 'online' ? a.color : botStatus === 'offline' ? 'bg-emberGlow/40' : 'bg-smoke/30 animate-pulse'
            }`} />
            <span>{a.label}</span>
            {botStatus === 'offline' && (
              <span className="text-[9px] text-emberGlow ml-auto">OFF</span>
            )}
          </div>
        ))}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-0 py-2">
        <Link
          href="/"
          className={`w-full flex items-center justify-between px-4 py-3 transition-all group
            ${pathname === '/' ? 'bg-raised border-l-2 border-yellowBright' : 'text-smoke hover:bg-raised/50'}
          `}
        >
          <div className="flex items-center gap-3">
            <span className={pathname === '/' ? 'text-white' : 'text-smoke group-hover:text-white'}>
              <Home size={16} />
            </span>
            <span className="text-[11px] uppercase tracking-tight">Main</span>
          </div>
          {pathname === '/' && <div className="w-1 h-1 rounded-full bg-yellowBright" />}
        </Link>

        {ROUTES.map((route) => {
          const isActive = pathname === route.path || pathname.startsWith(route.path + '/');
          const activeColor = COLORS[route.id];

          return (
            <Link
              key={route.id}
              href={route.path}
              className={`w-full flex items-center justify-between px-4 py-3 transition-all group
                ${isActive ? `bg-raised border-l-2 ${activeColor.split(' ')[0]}` : 'text-smoke hover:bg-raised/50'}
              `}
            >
              <div className="flex items-center gap-3">
                <span className={isActive ? 'text-white' : 'text-smoke group-hover:text-white'}>
                  {route.icon}
                </span>
                <span className="text-[11px] uppercase tracking-tight">
                  {route.label}
                </span>
              </div>
              {isActive && (
                <div className={`w-1 h-1 rounded-full ${activeColor.split(' ')[1].replace('text-', 'bg-')}`} />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer port indicator */}
      <div className="px-4 py-3 border-t border-border flex items-center gap-2">
        <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 transition-all duration-500 ${dotColor}`} />
        <span className="text-[9px] text-smoke opacity-50 font-mono">bot heartbeat</span>
      </div>
    </aside>
  );
};

export default Sidebar;
