'use client';
import { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

function Callback() {
  const router = useRouter();
  const params = useSearchParams();

  useEffect(() => {
    const token = params.get('token');
    if (token) {
      localStorage.setItem('token', token);
      router.replace('/dashboard/items');
    } else {
      router.replace('/login');
    }
  }, [params, router]);

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ color: 'var(--text-soft)' }}>
      Signing you in…
    </div>
  );
}

export default function AuthCallbackPage() {
  return <Suspense><Callback /></Suspense>;
}