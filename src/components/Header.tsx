'use client';

import React from 'react';
import { useTheme } from './ThemeProvider';
import Link from 'next/link';

export default function Header() {
  const { textSize, setTextSize } = useTheme();

  return (
    <header className="bg-dark-teal text-beige shadow-md border-b-4 border-air-force py-4 px-6 sticky top-0 z-50">
      <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Branding */}
        <Link 
          href="/" 
          className="flex items-center gap-3 focus:outline-none focus:ring-4 focus:ring-air-force/50 rounded-md p-1.5"
        >
          <div className="flex flex-col text-left">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight leading-none text-white">Greenfield Ward</h1>
            <span className="text-ash-grey text-sm font-bold uppercase tracking-wider mt-0.5">Citizens' Portal</span>
          </div>
        </Link>

        {/* Accessibility control */}
        <div className="flex items-center gap-3 bg-ink-black/40 p-2 rounded-lg border border-ash-grey/30">
          <span className="text-base font-bold text-beige px-1">Aa Text Size:</span>
          
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setTextSize('normal')}
              className={`px-4 py-2 font-bold rounded-md transition-all border ${
                textSize === 'normal'
                  ? 'bg-beige border-beige text-dark-teal shadow-md font-extrabold scale-105'
                  : 'bg-dark-teal/50 border-ash-grey/40 text-beige hover:bg-dark-teal/80'
              }`}
              style={{ minHeight: '48px', minWidth: '48px' }}
              title="Normal text size"
            >
              Small
            </button>
            
            <button
              type="button"
              onClick={() => setTextSize('large')}
              className={`px-4 py-2 font-bold rounded-md transition-all border ${
                textSize === 'large'
                  ? 'bg-beige border-beige text-dark-teal shadow-md font-extrabold scale-105'
                  : 'bg-dark-teal/50 border-ash-grey/40 text-beige hover:bg-dark-teal/80'
              }`}
              style={{ minHeight: '48px', minWidth: '48px' }}
              title="Large text size"
            >
              Medium
            </button>
            
            <button
              type="button"
              onClick={() => setTextSize('xlarge')}
              className={`px-4 py-2 font-bold rounded-md transition-all border ${
                textSize === 'xlarge'
                  ? 'bg-beige border-beige text-dark-teal shadow-md font-extrabold scale-105'
                  : 'bg-dark-teal/50 border-ash-grey/40 text-beige hover:bg-dark-teal/80'
              }`}
              style={{ minHeight: '48px', minWidth: '48px' }}
              title="Extra large text size"
            >
              Largest
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
