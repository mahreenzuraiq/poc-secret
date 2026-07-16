'use client';

import React from 'react';
import Link from 'next/link';
import { Leaf, Bell } from 'lucide-react';
import { usePathname } from 'next/navigation';

export default function Header() {
  const pathname = usePathname();

  // Hide on login screen — it renders its own branding
  if (pathname === '/login') return null;

  return (
    <header
      className="sticky top-0 z-50 bg-white border-b border-gray-100"
      style={{ boxShadow: '0 1px 8px rgba(0,0,0,0.06)' }}
    >
      <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between gap-3">

        {/* Brand */}
        <Link
          href="/"
          className="flex items-center gap-2.5 focus:outline-none focus:ring-2 focus:ring-green-300 rounded-lg"
          aria-label="WardConnect — go to home"
        >
          <span
            className="w-8 h-8 rounded-xl flex items-center justify-center"
            style={{ background: '#E8F5E9' }}
          >
            <Leaf className="w-4 h-4" style={{ color: '#2E7D32' }} strokeWidth={2.5} aria-hidden="true" />
          </span>
          <span
            className="text-lg font-bold tracking-tight"
            style={{ color: '#1F2937' }}
          >
            WardConnect
          </span>
        </Link>

        {/* Notification bell (placeholder) */}
        <button
          type="button"
          aria-label="Notifications"
          className="w-9 h-9 rounded-full flex items-center justify-center transition-colors hover:bg-gray-100"
          style={{ color: '#6B7280' }}
        >
          <Bell className="w-5 h-5" strokeWidth={1.75} aria-hidden="true" />
        </button>

      </div>
    </header>
  );
}
