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
        return 'bg-amber-100 text-amber-900 border-amber-300';
      case 'Health':
        return 'bg-blue-100 text-blue-900 border-blue-300';
      case 'Maintenance':
        return 'bg-orange-100 text-orange-900 border-orange-300';
      default:
        return 'bg-gray-100 text-gray-900 border-gray-300';
    }
  };

  const categoryEmoji = (category: string) => {
    switch (category) {
      case 'Sale': return '🏷️';
      case 'Health': return '🏥';
      case 'Maintenance': return '🚧';
      default: return '📢';
    }
  };

  return (
    <div className={`bg-white rounded-2xl border-3 transition-all ${isSpeaking ? 'border-amber-500 shadow-md ring-4 ring-amber-100' : 'border-gray-250 hover:border-gray-300 shadow-sm'} p-6 flex flex-col gap-4`}>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className={`text-base font-bold px-3 py-1 rounded-full border ${getCategoryStyles(news.category)}`}>
          {categoryEmoji(news.category)} {news.category}
        </span>
        <span className="text-gray-500 text-sm font-semibold">{news.date}</span>
      </div>

      <div className="flex flex-col gap-2">
        <h3 className="text-2xl font-extrabold text-gray-900 leading-tight">
          {news.title}
        </h3>
        <p className="text-gray-500 text-base font-semibold flex items-center gap-1.5">
          <span>📍</span> Location: {news.location}
        </p>
      </div>

      <p className="text-gray-700 text-lg leading-relaxed font-normal bg-gray-50/50 p-4 rounded-xl border border-gray-100">
        {news.description}
      </p>

      {/* Premium Elderly-friendly TTS Button */}
      <button
        type="button"
        onClick={toggleSpeech}
        className={`w-full py-4 px-6 rounded-xl font-bold transition-all flex items-center justify-center gap-3 text-lg active:scale-[0.98] ${
          isSpeaking 
            ? 'bg-amber-600 hover:bg-amber-700 text-white shadow-md' 
            : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-md'
        }`}
        style={{ minHeight: '64px' }}
      >
        {isSpeaking ? (
          <>
            <span className="text-2xl animate-bounce">⏸️</span>
            <span>Stop Reading Out Loud</span>
          </>
        ) : (
          <>
            <span className="text-2xl">🔊</span>
            <span>Listen to News (Audio)</span>
          </>
        )}
      </button>
    </div>
  );
}
