
'use client';

import * as React from 'react';
import { auth } from '@/lib/firebase';
import type { User } from 'firebase/auth';
import { onAuthStateChanged } from 'firebase/auth';
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Skeleton } from './ui/skeleton';

export const AuthContext = createContext<{ user: User | null }>({ user: null });

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
      if (!user && pathname.startsWith('/dashboard')) {
        router.push('/login');
      }
      if (user && pathname === '/login') {
        router.push('/dashboard');
      }
    });

    return () => unsubscribe();
  }, [router, pathname]);

  if (loading) {
    return (
        <div className="flex flex-col min-h-screen">
            <header className="flex items-center justify-between p-4 border-b">
                <Skeleton className="h-8 w-32" />
                <Skeleton className="h-8 w-24" />
            </header>
            <main className="flex-grow p-8">
                <div className="space-y-4">
                    <Skeleton className="h-10 w-64" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                </div>
            </main>
        </div>
    )
  }

  return <AuthContext.Provider value={{ user }}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  return useContext(AuthContext);
};
