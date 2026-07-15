'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Header() {
  const pathname = usePathname();

  const getLinkClass = (path: string) => {
    const base = "text-sm font-bold py-2 px-3 transition-all ";
    if (pathname === path) {
      return base + "text-dark-teal border-b-2 border-dark-teal font-extrabold rounded-none";
    }
    return base + "text-slate-650 hover:text-dark-teal hover:bg-slate-100/50 rounded-md";
  };

  return (
    <header className="bg-white text-slate-800 shadow-xs border-b border-slate-200 py-3 px-6 sticky top-0 z-50">
      <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Branding */}
        <Link 
          href="/" 
          className="flex items-center gap-3 focus:outline-none focus:ring-4 focus:ring-air-force/20 rounded-md p-1"
        >
          <div className="flex flex-col text-left">
            <h1 className="text-xl sm:text-2xl font-black tracking-tight leading-none text-dark-teal">Kowdiar Ward</h1>
            <span className="text-slate-500 text-xs font-bold uppercase tracking-wider mt-0.5">Citizens' Portal</span>
          </div>
        </Link>

        {/* Navigation Menu */}
        <nav className="flex items-center gap-1.5 flex-wrap justify-center md:justify-end">
          <Link href="/" className={getLinkClass('/')}>
            Home
          </Link>
          <Link href="/raise-complaint" className={getLinkClass('/raise-complaint')}>
            Report Issue
          </Link>
          <Link href="/complaints" className={getLinkClass('/complaints')}>
            My Grievances
          </Link>
          <Link href="/updates" className={getLinkClass('/updates')}>
            Updates
          </Link>
          <Link href="/contact" className={getLinkClass('/contact')}>
            Contacts
          </Link>
          <Link href="/profile" className={getLinkClass('/profile')}>
            Profile
          </Link>
        </nav>
      </div>
    </header>
  );
}
