'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { getNews, NewsItem } from '@/utils/storage';
import NewsCard from '@/components/NewsCard';

export default function HomePage() {
  const [newsList, setNewsList] = useState<NewsItem[]>([]);
  const [isHelpSpeaking, setIsHelpSpeaking] = useState(false);

  useEffect(() => {
    setNewsList(getNews());
    
    // Stop any ongoing speech when page load/unload
    return () => {
      if (typeof window !== 'undefined') {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const toggleHelpInstructions = () => {
    if (typeof window === 'undefined') return;

    if (isHelpSpeaking) {
      window.speechSynthesis.cancel();
      setIsHelpSpeaking(false);
    } else {
      window.speechSynthesis.cancel();
      
      const instructions = 
        "Welcome to the Greenfield Ward Citizens Portal. " +
        "This application is designed to help you report issues in our ward quickly. " +
        "To register a new complaint, click the big green button that says Report a Complaint. " +
        "To review complaints you have already submitted, click the blue button that says View My Complaints. " +
        "You can also scroll down to read and listen to the latest announcements in our ward. " +
        "Use the text size buttons in the header at any time to make text larger and easier to read. Thank you!";
      
      const utterance = new SpeechSynthesisUtterance(instructions);
      utterance.lang = 'en-US';
      utterance.rate = 0.85; // Read slowly for elderly users

      utterance.onend = () => {
        setIsHelpSpeaking(false);
      };

      utterance.onerror = () => {
        setIsHelpSpeaking(false);
      };

      setIsHelpSpeaking(true);
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="flex flex-col gap-8 py-2">
      {/* Welcome & Audio Instruction Box */}
      <section className="bg-emerald-50 border-3 border-emerald-200 rounded-3xl p-6 shadow-sm flex flex-col sm:flex-row items-center gap-6">
        <div className="text-5xl" role="img" aria-label="elderly support">👵👴</div>
        <div className="flex-1 text-center sm:text-left flex flex-col gap-2">
          <h2 className="text-3xl font-black text-emerald-950">Welcome to Greenfield Ward!</h2>
          <p className="text-emerald-800 text-lg font-medium leading-relaxed">
            Need help using this portal? Press the button below to listen to audio instructions.
          </p>
          <div>
            <button
              type="button"
              onClick={toggleHelpInstructions}
              className={`mt-2 py-3 px-6 rounded-2xl font-bold transition-all shadow flex items-center justify-center gap-2.5 text-base active:scale-[0.98] ${
                isHelpSpeaking 
                  ? 'bg-amber-500 hover:bg-amber-600 text-emerald-950' 
                  : 'bg-emerald-800 hover:bg-emerald-900 text-white'
              }`}
              style={{ minHeight: '56px' }}
            >
              {isHelpSpeaking ? (
                <>
                  <span className="text-xl">⏸️</span>
                  <span>Stop Instruction Audio</span>
                </>
              ) : (
                <>
                  <span className="text-xl">🔊</span>
                  <span>Listen to App Instructions</span>
                </>
              )}
            </button>
          </div>
        </div>
      </section>

      {/* Main Large Action Buttons */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
        {/* Report a Complaint Link */}
        <Link 
          href="/register"
          className="flex items-center gap-6 border-3 border-emerald-500 hover:border-emerald-600 bg-emerald-600 hover:bg-emerald-700 text-white rounded-3xl p-8 transition-all hover:scale-[1.01] hover:shadow-md focus:outline-none focus:ring-4 focus:ring-emerald-400 group"
          style={{ minHeight: '160px' }}
        >
          <span className="text-5xl bg-white/20 p-4 rounded-2xl group-hover:scale-110 transition-transform">📝</span>
          <div className="text-left flex flex-col gap-1">
            <span className="text-3xl font-black tracking-tight">Report a Complaint</span>
            <span className="text-emerald-100 text-base font-semibold leading-snug">File road potholes, water leaks, garbage issues, etc.</span>
          </div>
        </Link>

        {/* View Complaints Link */}
        <Link 
          href="/complaints"
          className="flex items-center gap-6 border-3 border-sky-500 hover:border-sky-600 bg-sky-600 hover:bg-sky-700 text-white rounded-3xl p-8 transition-all hover:scale-[1.01] hover:shadow-md focus:outline-none focus:ring-4 focus:ring-sky-400 group"
          style={{ minHeight: '160px' }}
        >
          <span className="text-5xl bg-white/20 p-4 rounded-2xl group-hover:scale-110 transition-transform">📂</span>
          <div className="text-left flex flex-col gap-1">
            <span className="text-3xl font-black tracking-tight">View My Complaints</span>
            <span className="text-sky-100 text-base font-semibold leading-snug">Check the status of your reported issues and review them</span>
          </div>
        </Link>
      </section>

      {/* News updates section */}
      <section className="flex flex-col gap-4 border-t-2 border-gray-200 pt-6">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-3xl font-black text-gray-900 flex items-center gap-2">
            <span>📢</span> Ward News & Updates
          </h2>
        </div>
        <p className="text-gray-500 text-base leading-relaxed mt-[-10px] font-semibold">
          Check out what is happening in Greenfield Ward. You can play audio for any announcement card.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-2">
          {newsList.map((news) => (
            <NewsCard key={news.id} news={news} />
          ))}
        </div>
      </section>
    </div>
  );
}
