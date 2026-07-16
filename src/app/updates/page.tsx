'use client';

import React, { useState, useEffect } from 'react';
import { getNews, NewsItem } from '@/utils/storage';
import NewsCard from '@/components/NewsCard';
import { Newspaper } from 'lucide-react';

export default function UpdatesPage() {
  const [newsList, setNewsList] = useState<NewsItem[]>([]);

  useEffect(() => {
    setNewsList(getNews());
    return () => { if (typeof window !== 'undefined') window.speechSynthesis.cancel(); };
  }, []);

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-base font-bold" style={{ color: '#1F2937' }}>Updates & Notices</h1>
        <p className="text-xs mt-0.5" style={{ color: '#9CA3AF' }}>
          Sales, medical camps, and maintenance schedules in Kowdiar Ward.
        </p>
      </div>

      {newsList.length === 0 ? (
        <div className="flex flex-col items-center gap-3 py-12 text-center rounded-2xl" style={{ background: '#fff', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ background: '#F2F4F3' }}>
            <Newspaper className="w-7 h-7" style={{ color: '#9CA3AF' }} />
          </div>
          <div>
            <p className="text-sm font-semibold" style={{ color: '#1F2937' }}>No updates yet</p>
            <p className="text-xs mt-1" style={{ color: '#9CA3AF' }}>Ward announcements will appear here.</p>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {newsList.map(item => <NewsCard key={item.id} news={item} />)}
        </div>
      )}
    </div>
  );
}
