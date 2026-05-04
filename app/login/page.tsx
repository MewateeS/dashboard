'use client';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

// --- Starfield ---
function useStars(count: number) {
  const [stars] = useState(() =>
    Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 1.8 + 0.4,
      delay: Math.random() * 4,
      dur: Math.random() * 3 + 2,
    }))
  );
  return stars;
}

// --- Shooting star state ---
function useShooting() {
  const [shots, setShots] = useState<{ id: number; top: number }[]>([]);
  useEffect(() => {
    let id = 0;
    const interval = setInterval(() => {
      const sid = id++;
      setShots(s => [...s, { id: sid, top: Math.random() * 60 + 5 }]);
      setTimeout(() => setShots(s => s.filter(x => x.id !== sid)), 1200);
    }, 2200);
    return () => clearInterval(interval);
  }, []);
  return shots;
}

export default function LoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [shake, setShake] = useState(false);
  const [glowing, setGlowing] = useState(false);
  const [typed, setTyped] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const stars = useStars(120);
  const shots = useShooting();

  // Typewriter for subtitle
  const SUBTITLE = 'MISSION CONTROL';
  useEffect(() => {
    let i = 0;
    const t = setInterval(() => {
      i++;
      setTyped(SUBTITLE.slice(0, i));
      if (i >= SUBTITLE.length) clearInterval(t);
    }, 80);
    return () => clearInterval(t);
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    setGlowing(false);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      if (res.ok) {
        setSuccess(true);
        setGlowing(true);
        setTimeout(() => {
          router.push('/');
          router.refresh();
        }, 900);
      } else {
        const data = await res.json();
        setError(data.error || 'Wrong password');
        setShake(true);
        setTimeout(() => setShake(false), 600);
        inputRef.current?.select();
      }
    } catch {
      setError('Connection error');
      setShake(true);
      setTimeout(() => setShake(false), 600);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <style>{`
        @keyframes twinkle {
          0%, 100% { opacity: 0.2; }
          50%       { opacity: 1; }
        }
        @keyframes shoot {
          0%   { transform: translateX(0)   scaleX(1);   opacity: 1; }
          100% { transform: translateX(22vw) scaleX(0.2); opacity: 0; }
        }
        @keyframes shake {
          0%,100% { transform: translateX(0); }
          15%     { transform: translateX(-8px); }
          35%     { transform: translateX(8px); }
          55%     { transform: translateX(-5px); }
          75%     { transform: translateX(5px); }
        }
        @keyframes pulse-ring {
          0%   { box-shadow: 0 0 0 0 rgba(100,80,255,0.6), 0 0 30px rgba(100,80,255,0.2); }
          70%  { box-shadow: 0 0 0 14px rgba(100,80,255,0), 0 0 50px rgba(100,80,255,0.35); }
          100% { box-shadow: 0 0 0 0 rgba(100,80,255,0),   0 0 30px rgba(100,80,255,0.2); }
        }
        @keyframes success-glow {
          0%   { box-shadow: 0 0 20px rgba(80,255,160,0.3); border-color: #40cc88; }
          50%  { box-shadow: 0 0 60px rgba(80,255,160,0.7); border-color: #60ffaa; }
          100% { box-shadow: 0 0 80px rgba(80,255,160,1);   border-color: #80ffcc; }
        }
        @keyframes scan {
          0%   { top: -4px; }
          100% { top: 100%; }
        }
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .login-card {
          animation: fade-in-up 0.5s ease both;
        }
        .login-card.shake {
          animation: shake 0.55s ease both;
        }
        .login-card.success {
          animation: success-glow 0.8s ease forwards;
        }
        .login-card.idle {
          animation: pulse-ring 2.6s ease-in-out infinite;
        }
        .input-field:focus {
          border-color: #6040cc !important;
          box-shadow: 0 0 12px rgba(96,64,204,0.4);
        }
        .enter-btn:hover:not(:disabled) {
          background: linear-gradient(135deg, #5050bb, #7050dd) !important;
          box-shadow: 0 0 18px rgba(100,80,255,0.5);
          transform: translateY(-1px);
        }
        .enter-btn { transition: all 0.2s ease; }
      `}</style>

      {/* Background */}
      <div style={{
        position: 'fixed', inset: 0,
        background: 'radial-gradient(ellipse at 50% 40%, #0d0820 0%, #060610 60%, #020208 100%)',
        overflow: 'hidden',
      }}>
        {/* Stars */}
        {stars.map(s => (
          <div key={s.id} style={{
            position: 'absolute',
            left: `${s.x}%`, top: `${s.y}%`,
            width: s.size, height: s.size,
            borderRadius: '50%',
            background: '#fff',
            animation: `twinkle ${s.dur}s ${s.delay}s ease-in-out infinite`,
          }} />
        ))}

        {/* Shooting stars */}
        {shots.map(s => (
          <div key={s.id} style={{
            position: 'absolute',
            left: '10%', top: `${s.top}%`,
            width: 90, height: 1.5,
            background: 'linear-gradient(90deg, transparent, #c0b0ff, #fff)',
            borderRadius: 2,
            animation: 'shoot 1.1s ease-out forwards',
          }} />
        ))}

        {/* Subtle grid overlay */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'linear-gradient(rgba(80,60,180,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(80,60,180,0.04) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }} />
      </div>

      {/* Card */}
      <div style={{
        minHeight: '100vh',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: '"Courier New", monospace',
        position: 'relative', zIndex: 1,
      }}>
        <div
          className={`login-card ${shake ? 'shake' : success ? 'success' : 'idle'}`}
          style={{
            background: 'rgba(14,12,28,0.92)',
            border: `1px solid ${success ? '#40cc88' : error ? '#ff4466' : '#2a2a4a'}`,
            borderRadius: 14,
            padding: '44px 52px',
            width: 360,
            backdropFilter: 'blur(12px)',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Scan line */}
          <div style={{
            position: 'absolute', left: 0, right: 0, height: 2,
            background: 'linear-gradient(90deg, transparent, rgba(100,80,255,0.18), transparent)',
            animation: 'scan 3.5s linear infinite',
            pointerEvents: 'none',
          }} />

          {/* Icon */}
          <div style={{ textAlign: 'center', marginBottom: 24 }}>
            <div style={{
              fontSize: 44,
              filter: success ? 'drop-shadow(0 0 12px #60ffaa)' : 'drop-shadow(0 0 8px rgba(120,100,255,0.6))',
              transition: 'filter 0.4s',
              userSelect: 'none',
            }}>
              {success ? '✅' : '🛸'}
            </div>
            <div style={{
              color: success ? '#60ffaa' : '#7060c0',
              fontSize: 12,
              letterSpacing: 4,
              marginTop: 10,
              minHeight: 16,
              transition: 'color 0.3s',
            }}>
              {success ? 'ACCESS GRANTED' : typed}
              {!success && typed.length < SUBTITLE.length && (
                <span style={{ opacity: 0.6 }}>▋</span>
              )}
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 14, position: 'relative' }}>
              <input
                ref={inputRef}
                type="password"
                value={password}
                onChange={e => { setPassword(e.target.value); setError(''); }}
                placeholder="••••••"
                autoFocus
                className="input-field"
                style={{
                  width: '100%',
                  background: '#08081a',
                  border: `1px solid ${error ? '#ff4466' : '#2a2a4a'}`,
                  borderRadius: 7,
                  color: '#e0e0ff',
                  fontSize: 20,
                  padding: '11px 16px',
                  outline: 'none',
                  boxSizing: 'border-box',
                  letterSpacing: 8,
                  transition: 'border-color 0.2s, box-shadow 0.2s',
                  fontFamily: 'inherit',
                }}
              />
            </div>

            <div style={{ minHeight: 20, marginBottom: 10 }}>
              {error && (
                <div style={{
                  color: '#ff4466',
                  fontSize: 11,
                  textAlign: 'center',
                  letterSpacing: 1,
                  textTransform: 'uppercase',
                }}>
                  ⚠ {error}
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={loading || !password || success}
              className="enter-btn"
              style={{
                width: '100%',
                background: success
                  ? 'linear-gradient(135deg, #206040, #30aa70)'
                  : loading
                    ? '#1e1e30'
                    : 'linear-gradient(135deg, #3a3a99, #5a3acc)',
                border: 'none',
                borderRadius: 7,
                color: '#fff',
                fontSize: 13,
                fontFamily: 'inherit',
                padding: '12px 0',
                cursor: loading || !password || success ? 'not-allowed' : 'pointer',
                letterSpacing: 3,
                textTransform: 'uppercase',
                opacity: !password && !success ? 0.45 : 1,
              }}
            >
              {success ? '✓ Granted' : loading ? 'Verifying...' : 'Enter'}
            </button>
          </form>

          {/* Corner decorations */}
          {(['0,0', '0,100', '100,0', '100,100'] as const).map(pos => {
            const [x, y] = pos.split(',').map(Number);
            return (
              <div key={pos} style={{
                position: 'absolute',
                left: x === 0 ? 8 : undefined,
                right: x === 100 ? 8 : undefined,
                top: y === 0 ? 8 : undefined,
                bottom: y === 100 ? 8 : undefined,
                width: 10, height: 10,
                borderTop: y === 0 ? '1px solid #3a3a6a' : undefined,
                borderBottom: y === 100 ? '1px solid #3a3a6a' : undefined,
                borderLeft: x === 0 ? '1px solid #3a3a6a' : undefined,
                borderRight: x === 100 ? '1px solid #3a3a6a' : undefined,
              }} />
            );
          })}
        </div>
      </div>
    </>
  );
}
