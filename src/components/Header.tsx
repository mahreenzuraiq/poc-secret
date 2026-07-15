'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Header() {
  const pathname = usePathname();

  const getLinkClass = (path: string) => {
    const base = "text-base font-extrabold py-2 px-3 rounded-md transition-all ";
    if (pathname === path) {
      return base + "bg-beige text-dark-teal shadow-sm";
    }
    return base + "text-white hover:text-beige hover:bg-white/10";
  };

  return (
    <header className="bg-dark-teal text-beige shadow-md border-b-4 border-air-force py-4 px-6 sticky top-0 z-50">
      <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Branding */}
        <Link 
          href="/" 
          className="flex items-center gap-3 focus:outline-none focus:ring-4 focus:ring-air-force/50 rounded-md p-1.5"
        >
          <div className="flex flex-col text-left">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight leading-none text-white">Kowdiar Ward</h1>
            <span className="text-ash-grey text-sm font-bold uppercase tracking-wider mt-0.5">Citizens' Portal</span>
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
