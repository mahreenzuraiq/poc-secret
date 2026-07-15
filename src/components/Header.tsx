'use client';

import React from 'react';
import { useTheme } from './ThemeProvider';
import Link from 'next/link';

export default function Header() {
  const { textSize, setTextSize } = useTheme();

  return (
    <header className="bg-emerald-800 text-white shadow-md border-b-4 border-amber-500 py-4 px-6 sticky top-0 z-50">
      <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Branding */}
        <Link 
          href="/" 
          className="flex items-center gap-3 focus:outline-none focus:ring-4 focus:ring-amber-300 rounded-xl p-1.5"
        >
          <span className="text-4xl" aria-hidden="true">🏛️</span>
          <div className="flex flex-col text-left">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight leading-none">Greenfield Ward</h1>
            <span className="text-amber-300 text-sm font-bold uppercase tracking-wider mt-0.5">Citizens' Portal</span>
          </div>
        </Link>

        {/* Accessibility control */}
        <div className="flex items-center gap-3 bg-emerald-950/65 p-2 rounded-2xl border border-emerald-700/50">
          <span className="text-base font-bold text-emerald-100 px-1">Aa Text Size:</span>
          
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setTextSize('normal')}
              className={`px-4 py-2 font-bold rounded-xl transition-all border ${
                textSize === 'normal'
                  ? 'bg-amber-400 border-amber-500 text-emerald-950 shadow-md font-extrabold scale-105'
                  : 'bg-emerald-900 border-emerald-800 text-emerald-150 hover:bg-emerald-850'
              }`}
              style={{ minHeight: '48px', minWidth: '48px' }}
              title="Normal text size"
            >
              Small
            </button>
            
            <button
              type="button"
              onClick={() => setTextSize('large')}
              className={`px-4 py-2 font-bold rounded-xl transition-all border ${
                textSize === 'large'
                  ? 'bg-amber-400 border-amber-500 text-emerald-950 shadow-md font-extrabold scale-105'
                  : 'bg-emerald-900 border-emerald-800 text-emerald-150 hover:bg-emerald-850'
              }`}
              style={{ minHeight: '48px', minWidth: '48px' }}
              title="Large text size"
            >
              Medium
            </button>
            
            <button
              type="button"
              onClick={() => setTextSize('xlarge')}
              className={`px-4 py-2 font-bold rounded-xl transition-all border ${
                textSize === 'xlarge'
                  ? 'bg-amber-400 border-amber-500 text-emerald-950 shadow-md font-extrabold scale-105'
                  : 'bg-emerald-900 border-emerald-800 text-emerald-150 hover:bg-emerald-850'
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
