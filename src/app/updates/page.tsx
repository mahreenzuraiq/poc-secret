'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { getNews, NewsItem } from '@/utils/storage';
import NewsCard from '@/components/NewsCard';

export default function UpdatesPage() {
  const [newsList, setNewsList] = useState<NewsItem[]>([]);

  useEffect(() => {
    setNewsList(getNews());
    
    // Stop any ongoing speech when page transitions
    return () => {
      if (typeof window !== 'undefined') {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  return (
    <div className="flex flex-col gap-6 py-2">
      {/* Page Header */}
      <div className="flex items-center gap-4">
        <Link 
          href="/" 
          className="p-3.5 bg-gray-150 hover:bg-gray-200 text-gray-700 font-extrabold rounded-lg border-2 border-gray-250 transition-colors flex items-center justify-center active:scale-[0.95]"
          style={{ minHeight: '56px', minWidth: '80px' }}
          title="Back to dashboard"
        >
          Back
        </Link>
        <h2 className="text-3xl font-black text-gray-900">
          Ward Updates & Notices
        </h2>
      </div>

      <p className="text-gray-550 text-base leading-relaxed font-semibold mt-[-8px]">
        Stay updated on sales, medical camps, and maintenance schedules in Greenfield Ward. Press "Listen to News" on any card to play it out loud.
      </p>

      {/* Grid listing */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-2">
        {newsList.map((item) => (
          <NewsCard key={item.id} news={item} />
        ))}
      </div>
    </div>
  );
}
