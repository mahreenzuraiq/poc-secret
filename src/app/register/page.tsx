'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { saveComplaint, Complaint } from '@/utils/storage';
import CameraCapture from '@/components/CameraCapture';
import VoiceRecorder from '@/components/VoiceRecorder';

type IssueCategory = Complaint['category'];

interface CategoryOption {
  value: IssueCategory;
  label: string;
  emoji: string;
  description: string;
  borderColor: string;
  bgColor: string;
  textColor: string;
}

const CATEGORIES: CategoryOption[] = [
  {
    value: 'Road',
    label: 'Road Issue',
    emoji: '🛣️',
    description: 'Potholes, broken tar, blocked drains',
    borderColor: 'border-amber-400 hover:border-amber-500',
    bgColor: 'bg-amber-50/50 hover:bg-amber-50',
    textColor: 'text-amber-900'
  },
  {
    value: 'Water',
    label: 'Water Leak',
    emoji: '🚰',
    description: 'Broken pipeline, dirty water supply',
    borderColor: 'border-blue-400 hover:border-blue-500',
    bgColor: 'bg-blue-50/50 hover:bg-blue-50',
    textColor: 'text-blue-900'
  },
  {
    value: 'Garbage',
    label: 'Garbage Pile',
    emoji: '🗑️',
    description: 'Overflowing bins, uncollected waste',
    borderColor: 'border-red-400 hover:border-red-500',
    bgColor: 'bg-red-50/50 hover:bg-red-50',
    textColor: 'text-red-900'
  },
  {
    value: 'Electricity',
    label: 'Electricity / Light',
    emoji: '💡',
    description: 'Broken street light, sparking wire',
    borderColor: 'border-yellow-400 hover:border-yellow-500',
    bgColor: 'bg-yellow-50/30 hover:bg-yellow-50',
    textColor: 'text-yellow-950'
  },
  {
    value: 'Health',
    label: 'Health & Drainage',
    emoji: '🏥',
    description: 'Stagnant water, mosquito breeding, open sewer',
    borderColor: 'border-emerald-400 hover:border-emerald-500',
    bgColor: 'bg-emerald-50/50 hover:bg-emerald-50',
    textColor: 'text-emerald-900'
  },
  {
    value: 'Others',
    label: 'Other Issues',
    emoji: '⚙️',
    description: 'General ward complaints and notices',
    borderColor: 'border-gray-450 hover:border-gray-500',
    bgColor: 'bg-gray-50/80 hover:bg-gray-100',
    textColor: 'text-gray-900'
  }
];

export default function RegisterPage() {
  const router = useRouter();

  // Form states
  const [category, setCategory] = useState<IssueCategory | null>(null);
  const [photo, setPhoto] = useState<string | null>(null);
  const [audio, setAudio] = useState<string | null>(null);
  const [audioDuration, setAudioDuration] = useState(0);
  const [description, setDescription] = useState('');

  // Submit states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedComplaint, setSubmittedComplaint] = useState<Complaint | null>(null);
  const [isSuccessSpeaking, setIsSuccessSpeaking] = useState(false);

  // Stop speech if card unmounts
  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined') {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!category) return;

    setIsSubmitting(true);

    // Simulate short network delay for realism in PoC
    setTimeout(() => {
      const saved = saveComplaint({
        category,
        photo,
        audio,
        audioDuration,
        description
      });
      
      setSubmittedComplaint(saved);
      setIsSubmitting(false);
      
      // Trigger voice read out of successful submission
      speakSuccessNotification(saved.id, saved.category);
    }, 1200);
  };

  const speakSuccessNotification = (complaintId: string, issueType: string) => {
    if (typeof window === 'undefined') return;
    window.speechSynthesis.cancel();

    // Readable announcement
    const text = `Success! Your complaint for ${issueType} has been submitted. Your reference number is ${complaintId.split('-').join(' ')}. Greenfield ward team will review this shortly. Thank you!`;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = 0.85;

    utterance.onend = () => setIsSuccessSpeaking(false);
    utterance.onerror = () => setIsSuccessSpeaking(false);

    setIsSuccessSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  const toggleSuccessSpeech = () => {
    if (!submittedComplaint) return;
    if (isSuccessSpeaking) {
      window.speechSynthesis.cancel();
      setIsSuccessSpeaking(false);
    } else {
      speakSuccessNotification(submittedComplaint.id, submittedComplaint.category);
    }
  };

  if (submittedComplaint) {
    /* Success Screen */
    return (
      <div className="flex flex-col gap-6 py-6 items-center text-center max-w-xl mx-auto">
        <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center text-5xl border-4 border-emerald-500 shadow-md animate-bounce">
          ✓
        </div>

        <div className="flex flex-col gap-3">
          <h2 className="text-3xl font-black text-gray-900">Complaint Submitted!</h2>
          <p className="text-xl text-emerald-800 font-bold bg-emerald-50 px-4 py-2.5 rounded-2xl border border-emerald-200">
            Complaint Number: {submittedComplaint.id}
          </p>
        </div>

        <p className="text-gray-700 text-lg leading-relaxed font-semibold">
          Your report about a <strong className="text-gray-900">{submittedComplaint.category}</strong> issue has been received. Our ward inspectors will review and assign maintenance staff.
        </p>

        {/* Audio playback button for confirmation */}
        <button
          type="button"
          onClick={toggleSuccessSpeech}
          className={`py-3.5 px-6 rounded-2xl font-bold transition-all shadow flex items-center gap-2 text-base active:scale-[0.98] ${
            isSuccessSpeaking 
              ? 'bg-amber-500 hover:bg-amber-600 text-emerald-950' 
              : 'bg-emerald-800 hover:bg-emerald-900 text-white'
          }`}
          style={{ minHeight: '56px' }}
        >
          {isSuccessSpeaking ? (
            <>
              <span>⏸️</span> Stop Audio Confirmation
            </>
          ) : (
            <>
              <span>🔊</span> Hear Confirmation Again
            </>
          )}
        </button>

        <div className="flex flex-col sm:flex-row gap-4 w-full mt-4">
          <Link
            href="/"
            className="flex-1 py-4 px-6 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-2xl text-center shadow-md transition-colors text-lg flex items-center justify-center min-h-[64px] active:scale-[0.98]"
          >
            🏠 Return to Home Page
          </Link>
          <Link
            href="/complaints"
            className="flex-1 py-4 px-6 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-2xl text-center shadow-md transition-colors text-lg flex items-center justify-center min-h-[64px] active:scale-[0.98]"
          >
            📂 View My Complaints List
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 py-2">
      {/* Page Navigation Header */}
      <div className="flex items-center gap-4">
        <Link 
          href="/" 
          className="p-3.5 bg-gray-150 hover:bg-gray-200 text-gray-700 font-extrabold rounded-2xl border-2 border-gray-250 transition-colors flex items-center justify-center active:scale-[0.95]"
          style={{ minHeight: '56px', minWidth: '56px' }}
          title="Back to home page"
        >
          ← Back
        </Link>
        <h2 className="text-3xl font-black text-gray-900">
          File a Ward Complaint
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-8">
        
        {/* Step 1: Select Category */}
        <div className="flex flex-col gap-4">
          <label className="text-2xl font-black text-gray-800 flex items-center gap-2">
            <span className="bg-emerald-100 text-emerald-800 w-9 h-9 rounded-full flex items-center justify-center text-lg font-extrabold">1</span>
            Select Issue Category / തരം തിരഞ്ഞെടുക്കുക
          </label>
          <p className="text-gray-500 text-base font-semibold mt-[-6px]">
            Please tap on the box that matches your issue.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {CATEGORIES.map((cat) => {
              const isSelected = category === cat.value;
              return (
                <button
                  key={cat.value}
                  type="button"
                  onClick={() => setCategory(cat.value)}
                  className={`border-3 rounded-2xl p-5 flex flex-col items-center justify-center text-center gap-2.5 transition-all active:scale-[0.98] ${cat.bgColor} ${
                    isSelected 
                      ? 'border-emerald-600 ring-4 ring-emerald-150 scale-[1.02]' 
                      : cat.borderColor
                  }`}
                  style={{ minHeight: '140px' }}
                >
                  <span className="text-4xl">{cat.emoji}</span>
                  <div className="flex flex-col">
                    <span className={`text-xl font-extrabold ${isSelected ? 'text-emerald-950 font-black' : cat.textColor}`}>
                      {cat.label}
                    </span>
                    <span className="text-xs text-gray-500 font-medium mt-1">
                      {cat.description}
                    </span>
                  </div>
                  {isSelected && (
                    <span className="mt-1 bg-emerald-600 text-white font-bold text-xs px-2.5 py-1 rounded-full shadow flex items-center gap-1">
                      ✓ Selected
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Step 2: Take Photo */}
        <div className="flex flex-col gap-4">
          <div className="text-2xl font-black text-gray-800 flex items-center gap-2">
            <span className="bg-emerald-100 text-emerald-800 w-9 h-9 rounded-full flex items-center justify-center text-lg font-extrabold">2</span>
            Take Issue Photo / ഫോട്ടോ എടുക്കുക
          </div>
          <CameraCapture 
            onPhotoCaptured={setPhoto} 
            existingPhoto={photo} 
            onClear={() => setPhoto(null)} 
          />
        </div>

        {/* Step 3: Record Voice Note */}
        <div className="flex flex-col gap-4">
          <div className="text-2xl font-black text-gray-800 flex items-center gap-2">
            <span className="bg-emerald-100 text-emerald-800 w-9 h-9 rounded-full flex items-center justify-center text-lg font-extrabold">3</span>
            Record Voice Description / വോയ്സ് നോട്ട്
          </div>
          <VoiceRecorder
            onAudioRecorded={(base64, duration) => {
              setAudio(base64);
              setAudioDuration(duration);
            }}
            existingAudio={audio}
            existingDuration={audioDuration}
            onClear={() => {
              setAudio(null);
              setAudioDuration(0);
            }}
          />
        </div>

        {/* Step 4: Written Description (Optional) */}
        <div className="flex flex-col gap-3 bg-white rounded-2xl p-6 border-2 border-gray-200 shadow-sm">
          <label htmlFor="description" className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <span>✏️</span> Written Notes (Optional)
          </label>
          <p className="text-gray-500 text-base leading-relaxed mt-[-5px]">
            If you want to type details, you can write them below:
          </p>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Type any extra information here (e.g. Landmark, house name, contact info)..."
            rows={3}
            className="w-full border-2 border-gray-300 rounded-xl p-4 text-base focus:border-emerald-600 focus:ring-4 focus:ring-emerald-100 outline-none transition-all placeholder:text-gray-400 font-medium"
          />
        </div>

        {/* Form actions: Submit or Cancel */}
        <div className="flex flex-col gap-4 mt-4">
          <button
            type="submit"
            disabled={!category || isSubmitting}
            className={`w-full py-5 px-6 font-black rounded-2xl text-center shadow transition-all text-xl flex items-center justify-center gap-2 ${
              !category 
                ? 'bg-gray-200 text-gray-400 border border-gray-300 cursor-not-allowed'
                : isSubmitting
                  ? 'bg-emerald-700 text-white cursor-wait opacity-80'
                  : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-md active:scale-[0.98]'
            }`}
            style={{ minHeight: '68px' }}
          >
            {isSubmitting ? (
              <>
                <span className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin"></span>
                <span>Submitting Complaint...</span>
              </>
            ) : (
              <>
                <span>🚀</span> Submit Complaint / സമർപ്പിക്കുക
              </>
            )}
          </button>
          
          {!category && (
            <p className="text-red-650 text-center font-bold text-base bg-red-50 py-2.5 rounded-xl border border-red-100">
              ⚠️ Please select an Issue Category (Step 1) above to enable submitting.
            </p>
          )}

          <Link
            href="/"
            className="w-full py-4 px-6 bg-gray-150 hover:bg-gray-200 text-gray-700 font-extrabold rounded-2xl text-center border-2 border-gray-250 transition-colors text-lg flex items-center justify-center min-h-[64px] active:scale-[0.98]"
          >
            Cancel & Go Back
          </Link>
        </div>

      </form>
    </div>
  );
}
