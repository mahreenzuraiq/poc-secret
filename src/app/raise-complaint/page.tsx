'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { saveComplaint, Complaint } from '@/utils/storage';
import CameraCapture from '@/components/CameraCapture';
import VoiceRecorder from '@/components/VoiceRecorder';
import {
  Map, Droplet, Trash2, Lightbulb, Activity, Settings,
  ArrowLeft, ArrowRight, CheckCircle, Send, AlertTriangle,
  Volume2, VolumeX, Home, FolderOpen
} from 'lucide-react';

type IssueCategory = Complaint['category'];
type IssuePriority = Complaint['priority'];

const CATEGORIES: { value: IssueCategory; label: string; icon: React.ComponentType<{className?:string}>;  description: string; iconBg: string; iconColor: string }[] = [
  { value: 'Road',        label: 'Road',        icon: Map,       description: 'Potholes, broken surface',       iconBg: '#FFF8E1', iconColor: '#F57F17' },
  { value: 'Water',       label: 'Water',       icon: Droplet,   description: 'Pipe leaks, dirty supply',       iconBg: '#E3F2FD', iconColor: '#1976D2' },
  { value: 'Garbage',     label: 'Garbage',     icon: Trash2,    description: 'Overflowing bins, trash piles',  iconBg: '#E8F5E9', iconColor: '#2E7D32' },
  { value: 'Electricity', label: 'Electricity', icon: Lightbulb, description: 'Streetlight, dangling wire',     iconBg: '#FFFDE7', iconColor: '#F9A825' },
  { value: 'Health',      label: 'Health',      icon: Activity,  description: 'Open sewer, stagnant water',     iconBg: '#FCE4EC', iconColor: '#C2185B' },
  { value: 'Others',      label: 'Others',      icon: Settings,  description: 'Other municipal concerns',       iconBg: '#F3E5F5', iconColor: '#7B1FA2' },
];

const STEPS = ['Category', 'Details', 'Evidence', 'Submit'];

export default function RaiseComplaintPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [category, setCategory] = useState<IssueCategory | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [priority, setPriority] = useState<IssuePriority>('Medium');
  const [photo, setPhoto] = useState<string | null>(null);
  const [audio, setAudio] = useState<string | null>(null);
  const [audioDuration, setAudioDuration] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState<Complaint | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);

  useEffect(() => () => { if (typeof window !== 'undefined') window.speechSynthesis.cancel(); }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!category || !title || !description || !location) return;
    setIsSubmitting(true);
    setTimeout(() => {
      const saved = saveComplaint({ title, category, description, location, priority, photo, audio, audioDuration });
      setSubmitted(saved);
      setIsSubmitting(false);
    }, 1000);
  };

  const speakSuccess = () => {
    if (!submitted || typeof window === 'undefined') return;
    if (isSpeaking) { window.speechSynthesis.cancel(); setIsSpeaking(false); return; }
    const utterance = new SpeechSynthesisUtterance(
      `Your complaint has been registered with ID ${submitted.id.split('-')[0]}. We will notify you once it is assigned.`
    );
    utterance.lang = 'en-US'; utterance.rate = 0.85;
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  // ── Success Screen ──
  if (submitted) {
    return (
      <div className="flex flex-col items-center gap-6 py-6 text-center animate-fade-in">
        <div className="w-20 h-20 rounded-full flex items-center justify-center animate-check-pop" style={{ background: '#E8F5E9' }}>
          <CheckCircle className="w-10 h-10" style={{ color: '#2E7D32' }} />
        </div>
        <div>
          <h2 className="text-xl font-bold" style={{ color: '#1F2937' }}>Complaint Registered!</h2>
          <p className="text-sm mt-1.5" style={{ color: '#6B7280' }}>
            Your issue has been submitted to the ward office.
          </p>
          <div className="mt-3 px-4 py-2 rounded-xl text-sm font-semibold inline-block" style={{ background: '#E8F5E9', color: '#2E7D32' }}>
            ID: {submitted.id}
          </div>
        </div>
        <button onClick={speakSuccess} className="flex items-center gap-2 text-sm font-medium px-4 py-2.5 rounded-xl transition-all" style={{ background: isSpeaking ? '#FFF8E1' : '#F2F4F3', color: '#1F2937' }}>
          {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          {isSpeaking ? 'Stop' : 'Read aloud'}
        </button>
        <div className="flex flex-col gap-2 w-full">
          <Link href="/complaints" className="flex items-center justify-center gap-2 w-full py-3 rounded-2xl text-sm font-semibold transition-all" style={{ background: '#2E7D32', color: '#fff' }}>
            <FolderOpen className="w-4 h-4" /> View My Complaints
          </Link>
          <Link href="/" className="flex items-center justify-center gap-2 w-full py-3 rounded-2xl text-sm font-semibold border" style={{ color: '#6B7280', borderColor: '#E5E7EB' }}>
            <Home className="w-4 h-4" /> Back to Home
          </Link>
        </div>
      </div>
    );
  }

  // ── Step indicator ──
  const StepBar = () => (
    <div className="flex items-center gap-1.5 mb-5">
      {STEPS.map((s, i) => (
        <React.Fragment key={s}>
          <div className="flex flex-col items-center gap-1">
            <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all"
              style={{
                background: i < step ? '#2E7D32' : i === step ? '#E8F5E9' : '#F2F4F3',
                color: i < step ? '#fff' : i === step ? '#2E7D32' : '#9CA3AF',
                border: i === step ? '2px solid #2E7D32' : '2px solid transparent',
              }}>
              {i < step ? '✓' : i + 1}
            </div>
            <span className="text-[10px] font-semibold" style={{ color: i === step ? '#2E7D32' : '#9CA3AF' }}>{s}</span>
          </div>
          {i < STEPS.length - 1 && (
            <div className="flex-1 h-0.5 mb-4 rounded" style={{ background: i < step ? '#2E7D32' : '#E5E7EB' }} />
          )}
        </React.Fragment>
      ))}
    </div>
  );

  const inputStyle = {
    width: '100%', padding: '10px 14px', background: '#F2F4F3',
    border: '2px solid #E5E7EB', borderRadius: '12px',
    fontSize: '14px', color: '#1F2937', outline: 'none', fontFamily: 'inherit',
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link href="/" className="w-8 h-8 rounded-xl flex items-center justify-center hover:bg-gray-100 transition-colors" style={{ color: '#6B7280' }}>
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <h1 className="text-base font-bold" style={{ color: '#1F2937' }}>Report an Issue</h1>
      </div>

      <StepBar />

      {/* ── Step 0: Category -── */}
      {step === 0 && (
        <div className="flex flex-col gap-3">
          <p className="text-sm" style={{ color: '#6B7280' }}>What type of issue are you reporting?</p>
          <div className="grid grid-cols-2 gap-2.5">
            {CATEGORIES.map(cat => {
              const Icon = cat.icon;
              const selected = category === cat.value;
              return (
                <button key={cat.value} type="button" onClick={() => setCategory(cat.value)}
                  className="flex flex-col gap-2.5 p-4 rounded-2xl text-left transition-all active:scale-[0.97]"
                  style={{
                    background: selected ? cat.iconBg : '#fff',
                    border: `2px solid ${selected ? cat.iconColor : '#E5E7EB'}`,
                    boxShadow: selected ? `0 0 0 3px ${cat.iconColor}20` : '0 1px 3px rgba(0,0,0,0.06)',
                  }}>
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: cat.iconBg }}>
                    <span style={{ color: cat.iconColor }}>
                      <Icon className="w-4 h-4" />
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold" style={{ color: '#1F2937' }}>{cat.label}</p>
                    <p className="text-xs mt-0.5" style={{ color: '#9CA3AF' }}>{cat.description}</p>
                  </div>
                </button>
              );
            })}
          </div>
          <button onClick={() => category && setStep(1)} disabled={!category}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl text-sm font-semibold mt-1 transition-all"
            style={{ background: category ? '#2E7D32' : '#E5E7EB', color: category ? '#fff' : '#9CA3AF', boxShadow: category ? '0 2px 8px rgba(46,125,50,0.25)' : 'none' }}>
            Continue <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* ── Step 1: Details ── */}
      {step === 1 && (
        <form onSubmit={e => { e.preventDefault(); if (title && description && location) setStep(2); }} className="flex flex-col gap-4">
          {[
            { id: 'title', label: 'Issue Title *', value: title, set: setTitle, placeholder: 'e.g. Large pothole near bus stop', type: 'text' },
            { id: 'location', label: 'Location / Landmark *', value: location, set: setLocation, placeholder: 'e.g. Near St. Xavier\'s School gate', type: 'text' },
          ].map(f => (
            <div key={f.id} className="flex flex-col gap-1.5">
              <label htmlFor={f.id} className="text-sm font-semibold" style={{ color: '#1F2937' }}>{f.label}</label>
              <input id={f.id} type={f.type} required value={f.value} onChange={e => f.set(e.target.value)} placeholder={f.placeholder}
                style={inputStyle}
                onFocus={e => { e.target.style.borderColor = '#2E7D32'; e.target.style.boxShadow = '0 0 0 3px rgba(46,125,50,0.10)'; }}
                onBlur={e => { e.target.style.borderColor = '#E5E7EB'; e.target.style.boxShadow = 'none'; }} />
            </div>
          ))}

          <div className="flex flex-col gap-1.5">
            <label htmlFor="desc" className="text-sm font-semibold" style={{ color: '#1F2937' }}>Description *</label>
            <textarea id="desc" required value={description} onChange={e => setDescription(e.target.value)}
              rows={3} placeholder="Describe the issue in detail..."
              style={{ ...inputStyle, resize: 'none' }}
              onFocus={e => { e.target.style.borderColor = '#2E7D32'; e.target.style.boxShadow = '0 0 0 3px rgba(46,125,50,0.10)'; }}
              onBlur={e => { e.target.style.borderColor = '#E5E7EB'; e.target.style.boxShadow = 'none'; }} />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold" style={{ color: '#1F2937' }}>Priority</label>
            <div className="flex gap-2">
              {(['Low', 'Medium', 'High'] as IssuePriority[]).map(p => (
                <button key={p} type="button" onClick={() => setPriority(p)}
                  className="flex-1 py-2 rounded-xl text-xs font-semibold transition-all"
                  style={{
                    background: priority === p ? (p === 'High' ? '#FFEBEE' : p === 'Medium' ? '#FFF8E1' : '#E8F5E9') : '#F2F4F3',
                    color: priority === p ? (p === 'High' ? '#D32F2F' : p === 'Medium' ? '#F57F17' : '#2E7D32') : '#9CA3AF',
                    border: `2px solid ${priority === p ? (p === 'High' ? '#D32F2F' : p === 'Medium' ? '#F57F17' : '#2E7D32') : 'transparent'}`,
                  }}>{p}</button>
              ))}
            </div>
          </div>

          <div className="flex gap-2 mt-1">
            <button type="button" onClick={() => setStep(0)} className="flex-1 py-3 rounded-2xl text-sm font-semibold" style={{ background: '#F2F4F3', color: '#6B7280' }}>
              Back
            </button>
            <button type="submit" disabled={!title || !description || !location}
              className="flex-[2] flex items-center justify-center gap-2 py-3 rounded-2xl text-sm font-semibold transition-all"
              style={{ background: title && description && location ? '#2E7D32' : '#E5E7EB', color: title && description && location ? '#fff' : '#9CA3AF' }}>
              Continue <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      )}

      {/* ── Step 2: Evidence ── */}
      {step === 2 && (
        <div className="flex flex-col gap-4">
          <p className="text-sm" style={{ color: '#6B7280' }}>Attach a photo or voice note to strengthen your complaint (optional).</p>

          <div className="rounded-2xl overflow-hidden" style={{ border: '2px solid #E5E7EB' }}>
            <div className="px-4 py-3" style={{ background: '#F2F4F3', borderBottom: '1px solid #E5E7EB' }}>
              <p className="text-xs font-semibold" style={{ color: '#1F2937' }}>📷 Photo Evidence</p>
            </div>
            <div className="p-4">
              <CameraCapture onPhotoCapture={setPhoto} capturedPhoto={photo} />
            </div>
          </div>

          <div className="rounded-2xl overflow-hidden" style={{ border: '2px solid #E5E7EB' }}>
            <div className="px-4 py-3" style={{ background: '#F2F4F3', borderBottom: '1px solid #E5E7EB' }}>
              <p className="text-xs font-semibold" style={{ color: '#1F2937' }}>🎙 Voice Note</p>
            </div>
            <div className="p-4">
              <VoiceRecorder onRecordingComplete={(data, duration) => { setAudio(data); setAudioDuration(duration); }} />
            </div>
          </div>

          <div className="flex gap-2 mt-1">
            <button type="button" onClick={() => setStep(1)} className="flex-1 py-3 rounded-2xl text-sm font-semibold" style={{ background: '#F2F4F3', color: '#6B7280' }}>Back</button>
            <button type="button" onClick={() => setStep(3)} className="flex-[2] flex items-center justify-center gap-2 py-3 rounded-2xl text-sm font-semibold" style={{ background: '#2E7D32', color: '#fff' }}>
              Review <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ── Step 3: Review & Submit ── */}
      {step === 3 && (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="rounded-2xl p-4 flex flex-col gap-3" style={{ background: '#fff', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
            <p className="text-xs font-bold uppercase tracking-wider" style={{ color: '#9CA3AF' }}>Review Your Complaint</p>
            {[
              { label: 'Category', value: category },
              { label: 'Title', value: title },
              { label: 'Location', value: location },
              { label: 'Priority', value: priority },
              { label: 'Description', value: description },
            ].map(row => (
              <div key={row.label} className="flex flex-col gap-0.5 pb-2.5" style={{ borderBottom: '1px solid #F2F4F3' }}>
                <span className="text-xs font-semibold" style={{ color: '#9CA3AF' }}>{row.label}</span>
                <span className="text-sm font-medium" style={{ color: '#1F2937' }}>{row.value}</span>
              </div>
            ))}
            <div className="flex gap-3 text-xs font-medium" style={{ color: '#6B7280' }}>
              <span>{photo ? '✓ Photo attached' : '✗ No photo'}</span>
              <span>{audio ? '✓ Voice note attached' : '✗ No voice note'}</span>
            </div>
          </div>

          {(!category || !title || !description || !location) && (
            <div className="flex items-center gap-2 p-3 rounded-xl text-xs font-semibold" style={{ background: '#FFEBEE', color: '#D32F2F' }}>
              <AlertTriangle className="w-4 h-4 shrink-0" /> Please complete all required fields.
            </div>
          )}

          <div className="flex gap-2">
            <button type="button" onClick={() => setStep(2)} className="flex-1 py-3 rounded-2xl text-sm font-semibold" style={{ background: '#F2F4F3', color: '#6B7280' }}>Back</button>
            <button type="submit" disabled={!category || !title || !description || !location || isSubmitting}
              className="flex-[2] flex items-center justify-center gap-2 py-3 rounded-2xl text-sm font-semibold transition-all"
              style={{ background: '#2E7D32', color: '#fff', boxShadow: '0 2px 8px rgba(46,125,50,0.25)' }}>
              {isSubmitting
                ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                : <><Send className="w-4 h-4" /> Submit Complaint</>}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
