'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      if (res.ok) {
        router.push('/');
        router.refresh();
      } else {
        const data = await res.json();
        setError(data.error || 'Wrong password');
      }
    } catch {
      setError('Connection error');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#0a0a0f',
      fontFamily: '"Courier New", monospace',
    }}>
      <div style={{
        background: '#111118',
        border: '1px solid #2a2a3a',
        borderRadius: 12,
        padding: '40px 48px',
        width: 340,
        boxShadow: '0 0 40px rgba(100,80,255,0.15)',
      }}>
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{ fontSize: 32, marginBottom: 8 }}>🛸</div>
          <div style={{ color: '#9090c0', fontSize: 13, letterSpacing: 3, textTransform: 'uppercase' }}>
            Mission Control
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 16 }}>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Enter password"
              autoFocus
              style={{
                width: '100%',
                background: '#0d0d16',
                border: `1px solid ${error ? '#ff4466' : '#2a2a3a'}`,
                borderRadius: 6,
                color: '#e0e0ff',
                fontSize: 15,
                padding: '10px 14px',
                outline: 'none',
                boxSizing: 'border-box',
                letterSpacing: 4,
              }}
            />
          </div>

          {error && (
            <div style={{ color: '#ff4466', fontSize: 12, marginBottom: 12, textAlign: 'center' }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !password}
            style={{
              width: '100%',
              background: loading ? '#2a2a3a' : 'linear-gradient(135deg, #4040aa, #6040cc)',
              border: 'none',
              borderRadius: 6,
              color: '#fff',
              fontSize: 14,
              fontFamily: 'inherit',
              padding: '10px 0',
              cursor: loading || !password ? 'not-allowed' : 'pointer',
              letterSpacing: 1,
              opacity: !password ? 0.5 : 1,
            }}
          >
            {loading ? 'Verifying...' : 'Enter'}
          </button>
        </form>
      </div>
    </div>
  );
}
