'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from './AuthContext';
import { useRouter, usePathname } from 'next/navigation';

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isLoggedIn } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      if (!isLoggedIn && pathname !== '/login') {
        setAuthorized(false);
        router.push('/login');
      } else if (isLoggedIn && pathname === '/login') {
        setAuthorized(false);
        router.push('/');
      } else {
        setAuthorized(true);
      }
    };

    checkAuth();
  }, [isLoggedIn, pathname, router]);

  if (!authorized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-beige text-dark-teal">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-dark-teal border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xl font-bold font-sans">Checking session...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
