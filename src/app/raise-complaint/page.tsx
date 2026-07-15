'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { saveComplaint, Complaint } from '@/utils/storage';
import CameraCapture from '@/components/CameraCapture';
import VoiceRecorder from '@/components/VoiceRecorder';

type IssueCategory = Complaint['category'];
type IssuePriority = Complaint['priority'];

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
    description: 'Potholes, broken tar, street blockage',
    borderColor: 'border-amber-400 hover:border-amber-550',
    bgColor: 'bg-amber-50/50 hover:bg-amber-50',
    textColor: 'text-amber-950'
  },
  {
    value: 'Water',
    label: 'Water Leak',
    emoji: '🚰',
    description: 'Pipe leaks, drainage water, dirty supply',
    borderColor: 'border-blue-400 hover:border-blue-550',
    bgColor: 'bg-blue-50/50 hover:bg-blue-50',
    textColor: 'text-blue-950'
  },
  {
    value: 'Garbage',
    label: 'Garbage Pile',
    emoji: '🗑️',
    description: 'Overflowing bins, uncollected street trash',
    borderColor: 'border-red-400 hover:border-red-550',
    bgColor: 'bg-red-50/50 hover:bg-red-50',
    textColor: 'text-red-950'
  },
  {
    value: 'Electricity',
    label: 'Electricity / Light',
    emoji: '💡',
    description: 'Damaged street light, dangling/sparking wire',
    borderColor: 'border-yellow-400 hover:border-yellow-550',
    bgColor: 'bg-yellow-50/30 hover:bg-yellow-50',
    textColor: 'text-yellow-950'
  },
  {
    value: 'Health',
    label: 'Health & Drainage',
    emoji: '🏥',
    description: 'Open sewer line, stagnant water logging',
    borderColor: 'border-emerald-400 hover:border-emerald-550',
    bgColor: 'bg-emerald-50/50 hover:bg-emerald-50',
    textColor: 'text-emerald-950'
  },
  {
    value: 'Others',
    label: 'General / Other',
    emoji: '⚙️',
    description: 'Other municipal or ward concerns',
    borderColor: 'border-gray-400 hover:border-gray-500',
    bgColor: 'bg-gray-50/80 hover:bg-gray-100',
    textColor: 'text-gray-950'
  }
];

export default function RaiseComplaintPage() {
  // Form states
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<IssueCategory | null>(null);
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [priority, setPriority] = useState<IssuePriority>('Medium');
  
  const [photo, setPhoto] = useState<string | null>(null);
  const [audio, setAudio] = useState<string | null>(null);
  const [audioDuration, setAudioDuration] = useState(0);

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
    if (!category || !title || !description || !location) return;

    setIsSubmitting(true);

    // Simulate short network delay
    setTimeout(() => {
      const saved = saveComplaint({
        title,
        category,
        description,
        location,
        priority,
        photo,
        audio,
        audioDuration
      });
      
      setSubmittedComplaint(saved);
      setIsSubmitting(false);
      speakSuccessNotification(saved.id, saved.title);
    }, 1200);
  };

  const speakSuccessNotification = (complaintId: string, issueTitle: string) => {
    if (typeof window === 'undefined') return;
    window.speechSynthesis.cancel();

    const text = `Success! Your complaint titled "${issueTitle}" has been submitted. Reference number is ${complaintId.split('-').join(' ')}. We will inspect it soon. Thank you!`;
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
      speakSuccessNotification(submittedComplaint.id, submittedComplaint.title);
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
          <h2 className="text-3xl font-black text-gray-900">Complaint Raised Successfully!</h2>
          <p className="text-xl text-emerald-800 font-bold bg-emerald-50 px-4 py-2.5 rounded-2xl border border-emerald-200">
            Complaint Ticket: {submittedComplaint.id}
          </p>
        </div>

        <p className="text-gray-700 text-lg leading-relaxed font-semibold">
          Your complaint <strong>"{submittedComplaint.title}"</strong> has been saved. Our Greenfield Ward team has received the alert and will schedule inspections.
        </p>

        {/* Audio confirmation */}
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
              <span>⏸️</span> Stop Confirmation Voice
            </>
          ) : (
            <>
              <span>🔊</span> Listen to Confirmation
            </>
          )}
        </button>

        <div className="flex flex-col sm:flex-row gap-4 w-full mt-4">
          <Link
            href="/"
            className="flex-1 py-4 px-6 bg-dark-teal hover:bg-dark-teal/95 text-white font-bold rounded-2xl text-center shadow-md transition-all text-lg flex items-center justify-center min-h-[64px] active:scale-[0.98]"
          >
            🏠 Return to Dashboard
          </Link>
          <Link
            href="/complaints"
            className="flex-1 py-4 px-6 bg-emerald-700 hover:bg-emerald-850 text-white font-bold rounded-2xl text-center shadow-md transition-all text-lg flex items-center justify-center min-h-[64px] active:scale-[0.98]"
          >
            📂 View My Grievances
          </Link>
        </div>
      </div>
    );
  }

  const isFormValid = title.trim() !== '' && category !== null && description.trim() !== '' && location.trim() !== '';

  return (
    <div className="flex flex-col gap-6 py-2">
      {/* Top Header */}
      <div className="flex items-center gap-4">
        <Link 
          href="/" 
          className="p-3.5 bg-gray-150 hover:bg-gray-200 text-gray-700 font-extrabold rounded-2xl border-2 border-gray-250 transition-colors flex items-center justify-center active:scale-[0.95]"
          style={{ minHeight: '56px', minWidth: '56px' }}
          title="Back to dashboard"
        >
          ← Back
        </Link>
        <h2 className="text-3xl font-black text-gray-900">
          Raise a Grievance
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-8">
        
        {/* Step 1: Select Category */}
        <div className="flex flex-col gap-4">
          <label className="text-2xl font-black text-gray-800 flex items-center gap-2">
            <span className="bg-emerald-100 text-emerald-850 w-9 h-9 rounded-full flex items-center justify-center text-lg font-extrabold">1</span>
            Select Issue Category / തരം
          </label>
          
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
                    <span className="text-xs text-gray-500 font-semibold mt-1">
                      {cat.description}
                    </span>
                  </div>
                  {isSelected && (
                    <span className="mt-1 bg-emerald-600 text-white font-bold text-xs px-2.5 py-1 rounded-full shadow-sm flex items-center gap-1">
                      ✓ Selected
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Step 2: Grievance Details Form */}
        <div className="flex flex-col gap-5 bg-white rounded-2xl p-6 border-2 border-gray-200 shadow-sm">
          <div className="text-2xl font-black text-gray-800 flex items-center gap-2 border-b border-gray-150 pb-3 mb-1">
            <span className="bg-emerald-100 text-emerald-850 w-9 h-9 rounded-full flex items-center justify-center text-lg font-extrabold">2</span>
            Fill Issue Details
          </div>

          {/* Title input */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="title" className="text-lg font-extrabold text-gray-800">
              Grievance Title / വിഷയം <span className="text-red-500">*</span>
            </label>
            <input
              id="title"
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Big pothole near Central Library"
              className="w-full border-2 border-gray-300 rounded-xl p-4 text-base focus:border-dark-teal focus:ring-4 focus:ring-dark-teal/15 outline-none transition-all placeholder:text-gray-400 font-medium text-ink-black"
              style={{ minHeight: '56px' }}
            />
          </div>

          {/* Description input */}
          <div className="flex flex-col gap-1.5 mt-2">
            <label htmlFor="description" className="text-lg font-extrabold text-gray-800">
              Detailed Description / വിവരണം <span className="text-red-500">*</span>
            </label>
            <textarea
              id="description"
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide details about the issue. (How long has this been occurring? Is it blocking traffic?)"
              rows={4}
              className="w-full border-2 border-gray-300 rounded-xl p-4 text-base focus:border-dark-teal focus:ring-4 focus:ring-dark-teal/15 outline-none transition-all placeholder:text-gray-400 font-medium text-ink-black"
            />
          </div>

          {/* Location input */}
          <div className="flex flex-col gap-1.5 mt-2">
            <label htmlFor="location" className="text-lg font-extrabold text-gray-800">
              Location details / സ്ഥലം <span className="text-red-500">*</span>
            </label>
            <input
              id="location"
              type="text"
              required
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. Opposite GH High School, Street 4"
              className="w-full border-2 border-gray-300 rounded-xl p-4 text-base focus:border-dark-teal focus:ring-4 focus:ring-dark-teal/15 outline-none transition-all placeholder:text-gray-400 font-medium text-ink-black"
              style={{ minHeight: '56px' }}
            />
          </div>

          {/* Priority selector */}
          <div className="flex flex-col gap-2.5 mt-2">
            <span className="text-lg font-extrabold text-gray-800">
              Urgency / Priority Level
            </span>
            <div className="grid grid-cols-3 gap-3 w-full">
              {(['Low', 'Medium', 'High'] as IssuePriority[]).map((p) => {
                const isSel = priority === p;
                let activeBtnStyle = 'bg-gray-150 border-gray-300 text-gray-800';
                if (isSel) {
                  if (p === 'Low') activeBtnStyle = 'bg-emerald-600 border-emerald-600 text-white font-extrabold';
                  if (p === 'Medium') activeBtnStyle = 'bg-amber-500 border-amber-600 text-emerald-950 font-extrabold';
                  if (p === 'High') activeBtnStyle = 'bg-red-600 border-red-600 text-white font-extrabold animate-pulse';
                }

                return (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPriority(p)}
                    className={`py-3.5 px-4 rounded-xl border text-center transition-all shadow-sm font-bold text-base active:scale-[0.98] ${
                      isSel ? activeBtnStyle : 'bg-gray-50 border-gray-250 text-gray-600 hover:bg-gray-100'
                    }`}
                    style={{ minHeight: '52px' }}
                  >
                    {p === 'Low' && '🟢 '}
                    {p === 'Medium' && '🟡 '}
                    {p === 'High' && '🔴 '}
                    {p}
                  </button>
                );
              })}
            </div>
          </div>

        </div>

        {/* Step 3: Media Upload */}
        <div className="flex flex-col gap-4">
          <div className="text-2xl font-black text-gray-800 flex items-center gap-2">
            <span className="bg-emerald-100 text-emerald-850 w-9 h-9 rounded-full flex items-center justify-center text-lg font-extrabold">3</span>
            Attach Evidence (Photo / Voice Note)
          </div>
          <p className="text-gray-500 text-base font-semibold mt-[-6px]">
            You can capture a photo or speak a description. Both are highly recommended for faster resolution.
          </p>

          <CameraCapture 
            onPhotoCaptured={setPhoto} 
            existingPhoto={photo} 
            onClear={() => setPhoto(null)} 
          />

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

        {/* Submit Actions */}
        <div className="flex flex-col gap-4 mt-2">
          <button
            type="submit"
            disabled={!isFormValid || isSubmitting}
            className={`w-full py-5 px-6 font-black rounded-2xl text-center shadow transition-all text-xl flex items-center justify-center gap-2 ${
              !isFormValid
                ? 'bg-gray-200 text-gray-400 border border-gray-300 cursor-not-allowed'
                : isSubmitting
                  ? 'bg-dark-teal/80 text-white cursor-wait opacity-80'
                  : 'bg-dark-teal hover:bg-dark-teal/95 text-white shadow-md active:scale-[0.98]'
            }`}
            style={{ minHeight: '68px' }}
          >
            {isSubmitting ? (
              <>
                <span className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin"></span>
                <span>Submitting Grievance...</span>
              </>
            ) : (
              <>
                <span>🚀</span> Submit Complaint / സമർപ്പിക്കുക
              </>
            )}
          </button>
          
          {!isFormValid && (
            <p className="text-red-700 text-center font-bold text-base bg-red-50 py-2.5 rounded-xl border border-red-100">
              ⚠️ Please fill out all required fields marked with * (Category, Title, Description, Location) to submit.
            </p>
          )}

          <Link
            href="/"
            className="w-full py-4 px-6 bg-gray-150 hover:bg-gray-200 text-gray-750 font-extrabold rounded-2xl text-center border-2 border-gray-250 transition-colors text-base flex items-center justify-center min-h-[64px] active:scale-[0.98]"
          >
            Cancel & Go Back
          </Link>
        </div>

      </form>
    </div>
  );
}
