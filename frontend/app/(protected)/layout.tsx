'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../lib/useAuth';

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const { user, loading, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) router.replace('/login');
  }, [user, loading, router]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--cream)' }}>
      <div className="flex items-center gap-3" style={{ color: 'var(--text-soft)' }}>
        <div className="w-5 h-5 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: 'var(--orange)', borderTopColor: 'transparent' }} />
        Loading…
      </div>
    </div>
  );
  if (!user) return null;

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--cream)' }}>
      <header className="sticky top-0 z-10 px-6 py-4 flex items-center justify-between"
        style={{ background: 'rgba(255,248,240,0.85)', backdropFilter: 'blur(12px)', borderBottom: '1.5px solid var(--border)' }}>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center text-lg shadow-sm"
            style={{ background: 'linear-gradient(135deg, #FF7A35, #FFB380)' }}>
            🏭
          </div>
          <span className="font-bold text-lg" style={{ fontFamily: 'Sora, sans-serif', color: 'var(--text)' }}>
            Warehouse
          </span>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-4 py-2 rounded-2xl text-sm"
            style={{ background: 'var(--orange-light)', color: 'var(--brown)' }}>
            <span>👤</span>
            <span className="font-medium">{String(user.name || user.email || '')}</span>
          </div>
          <button onClick={logout}
            className="text-sm px-4 py-2 rounded-2xl font-medium transition-all hover:scale-105 cursor-pointer"
            style={{ background: 'var(--white)', border: '1.5px solid var(--border)', color: 'var(--text-soft)' }}>
            Logout
          </button>
        </div>
      </header>
      <main className="flex-1 p-6 max-w-6xl mx-auto w-full">{children}</main>
    </div>
  );
}
