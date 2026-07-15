'use client';

import React, { useState, useEffect } from 'react';
import { NewsItem } from '@/utils/storage';

interface NewsCardProps {
  news: NewsItem;
}

export default function NewsCard({ news }: NewsCardProps) {
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Stop speech if card unmounts
  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined') {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const toggleSpeech = () => {
    if (typeof window === 'undefined') return;

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    } else {
      // Cancel any ongoing speech across the browser
      window.speechSynthesis.cancel();

      // Format text clearly for the speaker to read it slowly and naturally
      const textToSpeak = `${news.title}. Announcement details: ${news.description}. Date of event: ${news.date}. Location: ${news.location}. End of announcement.`;
      
      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      utterance.lang = 'en-US';
      utterance.rate = 0.9; // Read slightly slower than normal speed for elderly clarity
      utterance.pitch = 1.05; // Slightly higher pitch for audio clarity on mobile speakers

      utterance.onend = () => {
        setIsSpeaking(false);
      };

      utterance.onerror = (e) => {
        console.error('Speech synthesis error:', e);
        setIsSpeaking(false);
      };

      // Set state and read text
      setIsSpeaking(true);
      window.speechSynthesis.speak(utterance);
    }
  };

  // Set category pill colors
  const getCategoryStyles = (category: string) => {
    switch (category) {
      case 'Sale':
        return 'bg-ash-grey/25 text-ink-black border-ash-grey/55';
      case 'Health':
        return 'bg-air-force/25 text-dark-teal border-air-force/55';
      case 'Maintenance':
        return 'bg-dark-teal/15 text-dark-teal border-dark-teal/35';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-250';
    }
  };

  // Set priority pill colors
  const getPriorityBadgeClass = (priority: string) => {
    switch (priority) {
      case 'High':
        return 'bg-red-50 text-red-700 border-red-200';
      case 'Medium':
        return 'bg-air-force/10 text-dark-teal border-air-force/30';
      default:
        return 'bg-ash-grey/20 text-ink-black border-ash-grey/40';
    }
  };

  return (
    <div className={`bg-white rounded-lg border-2 transition-all ${isSpeaking ? 'border-air-force shadow-md ring-4 ring-air-force/10' : 'border-gray-250 hover:border-gray-300 shadow-sm'} p-6 flex flex-col gap-4`}>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className={`text-base font-bold px-3 py-1 rounded-md border ${getCategoryStyles(news.category)}`}>
            {news.category}
          </span>
          <span className={`text-xs font-bold px-2 py-0.5 rounded-md border uppercase tracking-wider ${getPriorityBadgeClass(news.priority)}`}>
            {news.priority}
          </span>
        </div>
        <span className="text-gray-500 text-sm font-semibold">{news.date}</span>
      </div>

      <div className="flex flex-col gap-2">
        <h3 className="text-2xl font-extrabold text-gray-900 leading-tight">
          {news.title}
        </h3>
        <p className="text-gray-500 text-base font-semibold flex items-center gap-1.5">
          Location: {news.location}
        </p>
      </div>

      <p className="text-gray-700 text-lg leading-relaxed font-normal bg-gray-50/50 p-4 rounded-lg border border-gray-100">
        {news.description}
      </p>

      {/* Premium Elderly-friendly TTS Button */}
      <button
        type="button"
        onClick={toggleSpeech}
        className={`w-full py-4 px-6 rounded-lg font-bold transition-all flex items-center justify-center gap-3 text-lg active:scale-[0.98] ${
          isSpeaking 
            ? 'bg-air-force hover:bg-air-force/90 text-white shadow-md' 
            : 'bg-dark-teal hover:bg-dark-teal/90 text-white shadow-md'
        }`}
        style={{ minHeight: '64px' }}
      >
        {isSpeaking ? 'Stop Reading Out Loud' : 'Listen to News (Audio)'}
      </button>
    </div>
  );
}
