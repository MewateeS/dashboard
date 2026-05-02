"use client";
import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';

export default function MemoryPage() {
  const [tab, setTab] = useState<'daily' | 'longterm'>('daily');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [content, setContent] = useState('');
  const [dailyLogs, setDailyLogs] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/memory')
      .then(res => res.json())
      .then(data => setDailyLogs(data.daily || []));
  }, []);

  useEffect(() => {
    if (!selectedDate) return;
    fetch(`/api/memory/${selectedDate}`)
      .then(res => res.json())
      .then(data => setContent(data.content || ''));
  }, [selectedDate]);

  const filteredLogs = dailyLogs.filter(log => 
    log.date.includes(searchQuery) || 
    log.preview.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Escape regex special chars to prevent ReDoS
  const escapeRegex = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

  // Split text by bold markers and return React nodes — no dangerouslySetInnerHTML
  const renderBold = (text: string): React.ReactNode[] => {
    const parts = text.split(/\*\*(.*?)\*\*/g);
    return parts.map((part, i) =>
      i % 2 === 1
        ? <span key={i} className="text-amberBright">{part}</span>
        : renderHighlight(part)
    );
  };

  // Highlight search matches as React nodes — no dangerouslySetInnerHTML
  const renderHighlight = (text: string): React.ReactNode => {
    if (!searchQuery.trim()) return text;
    const parts = text.split(new RegExp(`(${escapeRegex(searchQuery)})`, 'gi'));
    return (
      <>
        {parts.map((part, i) =>
          part.toLowerCase() === searchQuery.toLowerCase()
            ? <span key={i} className="bg-yellowBright text-base">{part}</span>
            : part
        )}
      </>
    );
  };

  const renderMarkdown = (text: string) => {
    if (!text) return null;
    return text.split('\n').map((line, i) => {
      if (line.startsWith('## '))
        return <div key={i} className="text-greenBright font-bold text-lg mb-2 mt-4">{line.slice(3)}</div>;
      if (line.startsWith('# '))
        return <div key={i} className="text-greenBright font-bold text-2xl mb-4 mt-6">{line.slice(2)}</div>;
      return <div key={i} className="text-smoke mb-1">{renderBold(line)}</div>;
    });
  };

  return (
    <div className="flex h-full bg-base font-mono text-white">
      {/* Left Panel */}
      <div className="w-[280px] border-r border-border bg-surface flex flex-col">
        <div className="p-4 space-y-4">
          <div className="flex gap-2 p-1 bg-base rounded border border-border">
            <button 
              onClick={() => setTab('daily')}
              className={`flex-1 py-1 text-[10px] uppercase rounded transition-all ${tab === 'daily' ? 'bg-green-dim text-greenBright' : 'text-smoke'}`}
            >
              Daily Log
            </button>
            <button 
              onClick={() => setTab('longterm')}
              className={`flex-1 py-1 text-[10px] uppercase rounded transition-all ${tab === 'longterm' ? 'bg-green-dim text-greenBright' : 'text-smoke'}`}
            >
              Long-term
            </button>
          </div>

          <div className="relative">
            <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3 text-smoke" />
            <input 
              type="text" 
              placeholder="SEARCH MEMORIES..."
              className="w-full bg-base border border-border pl-8 pr-3 py-1.5 text-[11px] text-white outline-none focus:border-greenBright transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {tab === 'daily' ? (
            <div className="flex flex-col">
              {filteredLogs.map(log => (
                <div 
                  key={log.date}
                  onClick={() => setSelectedDate(log.date)}
                  className={`p-3 cursor-pointer border-l-2 transition-all
                    ${selectedDate === log.date ? 'bg-green-dim border-greenBright' : 'border-transparent hover:bg-raised/50'}
                  `}
                >
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-white text-xs font-bold">{log.date}</span>
                    <span className="text-[9px] text-smoke">{log.wordCount} words</span>
                  </div>
                  <div className="text-[11px] text-smoke opacity-60 truncate">
                    {log.preview}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div 
              onClick={() => setSelectedDate('longterm')}
              className={`p-3 cursor-pointer border-l-2 transition-all ${selectedDate === 'longterm' ? 'bg-green-dim border-greenBright' : 'border-transparent hover:bg-raised/50'}`}
            >
              <div className="text-white text-xs font-bold">Long-term Memory</div>
              <div className="text-[11px] text-smoke opacity-60">The distilled essence of the mission.</div>
            </div>
          )}
        </div>
      </div>

      {/* Right Panel */}
      <div className="flex-1 overflow-y-auto p-8 bg-base">
        {selectedDate ? (
          <div className="max-w-3xl mx-auto font-mono text-sm leading-relaxed">
            {renderMarkdown(content)}
          </div>
        ) : (
          <div className="h-full flex items-center justify-center text-smoke opacity-30 uppercase text-xs">
            Select a memory entry to read
          </div>
        )}
      </div>
    </div>
  );
}
