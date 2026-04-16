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

  if (loading) return <div className="min-h-screen flex items-center justify-center text-gray-400">Loading…</div>;
  if (!user) return null;

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xl">🏭</span>
          <span className="font-semibold text-gray-800">Warehouse App</span>
        </div>
        <div className="flex items-center gap-4">
          {user.picture && <img src={user.picture as string} alt={user.name as string} className="w-8 h-8 rounded-full" />}
          <span className="text-sm text-gray-600">{String(user.name || user.email || '')}</span>
          <button onClick={logout} className="text-sm text-gray-500 hover:text-red-500 transition cursor-pointer">
            Logout
          </button>
        </div>
      </header>
      <main className="flex-1 p-6 max-w-6xl mx-auto w-full">{children}</main>
    </div>
  );
}
