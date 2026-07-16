'use client';

import React, { useState, useEffect } from 'react';
import { NewsItem } from '@/utils/storage';
import { Tag, Activity, Wrench, Megaphone, MapPin, Volume2, VolumeX, Calendar } from 'lucide-react';

interface NewsCardProps { news: NewsItem; }

const CAT_STYLE: Record<string, { bg: string; color: string }> = {
  Sale:        { bg: '#E8F5E9', color: '#2E7D32' },
  Health:      { bg: '#FCE4EC', color: '#C2185B' },
  Maintenance: { bg: '#E3F2FD', color: '#1976D2' },
  default:     { bg: '#F3E5F5', color: '#7B1FA2' },
};

const PRIORITY_STYLE: Record<string, { bg: string; color: string }> = {
  High:    { bg: '#FFEBEE', color: '#D32F2F' },
  Medium:  { bg: '#FFF8E1', color: '#F57F17' },
  Low:     { bg: '#E8F5E9', color: '#2E7D32' },
};

const CAT_ICON: Record<string, React.ReactNode> = {
  Sale:        <Tag className="w-3.5 h-3.5" />,
  Health:      <Activity className="w-3.5 h-3.5" />,
  Maintenance: <Wrench className="w-3.5 h-3.5" />,
  default:     <Megaphone className="w-3.5 h-3.5" />,
};

export default function NewsCard({ news }: NewsCardProps) {
  const [isSpeaking, setIsSpeaking] = useState(false);

  useEffect(() => () => { if (typeof window !== 'undefined') window.speechSynthesis.cancel(); }, []);

  const toggleSpeech = () => {
    if (typeof window === 'undefined') return;
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(
      `${news.title}. ${news.description}. Date: ${news.date}. Location: ${news.location}.`
    );
    utterance.lang = 'en-US';
    utterance.rate = 0.9;
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  const catStyle = CAT_STYLE[news.category] ?? CAT_STYLE.default;
  const priorityStyle = PRIORITY_STYLE[news.priority] ?? PRIORITY_STYLE.Medium;
  const catIcon = CAT_ICON[news.category] ?? CAT_ICON.default;

  return (
    <div
      className="rounded-2xl overflow-hidden transition-all"
      style={{
        background: '#fff',
        boxShadow: isSpeaking ? '0 0 0 2px #2E7D32, 0 4px 16px rgba(46,125,50,0.12)' : '0 1px 4px rgba(0,0,0,0.06)',
      }}
    >
      {/* Header row */}
      <div className="flex items-center justify-between gap-2 px-4 py-3" style={{ borderBottom: '1px solid #F2F4F3' }}>
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full" style={{ background: catStyle.bg, color: catStyle.color }}>
            {catIcon} {news.category}
          </span>
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ background: priorityStyle.bg, color: priorityStyle.color }}>
            {news.priority}
          </span>
        </div>
        <span className="flex items-center gap-1 text-xs" style={{ color: '#9CA3AF' }}>
          <Calendar className="w-3 h-3" /> {news.date}
        </span>
      </div>

      {/* Body */}
      <div className="px-4 py-3 flex flex-col gap-2">
        <h3 className="text-sm font-bold leading-snug" style={{ color: '#1F2937' }}>{news.title}</h3>
        <p className="flex items-center gap-1.5 text-xs" style={{ color: '#9CA3AF' }}>
          <MapPin className="w-3 h-3 shrink-0" /> {news.location}
        </p>
        <p className="text-xs leading-relaxed" style={{ color: '#6B7280' }}>{news.description}</p>
      </div>

      {/* TTS button */}
      <div className="px-4 pb-3">
        <button
          type="button"
          onClick={toggleSpeech}
          className="flex items-center gap-2 text-xs font-semibold px-3 py-2 rounded-xl transition-all w-full justify-center"
          style={{
            background: isSpeaking ? '#E8F5E9' : '#F2F4F3',
            color: isSpeaking ? '#2E7D32' : '#6B7280',
          }}
        >
          {isSpeaking ? <><VolumeX className="w-3.5 h-3.5" /> Stop</> : <><Volume2 className="w-3.5 h-3.5" /> Listen</>}
        </button>
      </div>
    </div>
  );
}
