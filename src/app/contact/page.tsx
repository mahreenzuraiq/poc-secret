'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Phone, Mail, MapPin, ExternalLink, MessageCircle, Send, X, ChevronDown } from 'lucide-react';

/* ─── Data ─────────────────────────────────────────────── */

const COUNCILLOR = {
  name: 'Councillor Satheesh Kumar',
  role: 'Ward Councillor',
  phone: '+91 94470 12345',
  email: 'councillor.kowdiar@municipal.gov.in',
  location: 'Kowdiar Community Hall, Room A',
  description: 'Elected representative. Handles citizen grievances, public works, and ward development.',
  avatar: 'SK',
};

const OTHER_CONTACTS = [
  {
    name: 'Smt. Bindu R.',
    role: 'Health Inspector',
    phone: '+91 94470 67890',
    email: 'hi.kowdiar@municipal.gov.in',
    location: 'Kowdiar Primary Health Sub-Center',
    description: 'Public sanitation, mosquito prevention, health camps.',
    roleColor: '#1976D2', roleBg: '#E3F2FD',
  },
  {
    name: 'Sri. Anil Kumar',
    role: 'Junior Health Inspector',
    phone: '+91 94470 54321',
    description: 'Waste management, street sweeping, garbage & drainage.',
    roleColor: '#F57F17', roleBg: '#FFF8E1',
  },
  {
    name: 'Smt. Geetha S.',
    role: 'Ward Secretary',
    phone: '+91 94470 98765',
    location: 'Kowdiar Ward Office Annex',
    description: 'Certifications, birth/death records, municipal taxes.',
    roleColor: '#7B1FA2', roleBg: '#F3E5F5',
  },
];

const HELPLINES = [
  { label: 'Ward Office Helpdesk', number: '0471-2345678', sub: 'Mon–Sat, 10am–5pm', href: 'tel:04712345678' },
  { label: 'Corporation Toll-Free', number: '155300', sub: '24/7 within Trivandrum', href: 'tel:155300' },
];

/* Simulated bot replies */
const BOT_RESPONSES: Record<string, string> = {
  hello: "Hello! How can I help you today? You can ask me about your ward issues, upcoming events, or office hours.",
  hi: "Hi there! What can I help you with?",
  hours: "The ward office is open Monday to Saturday, 10:00 AM – 5:00 PM.",
  complaint: "To file a complaint, please use the 'Services' tab at the bottom. You can attach a photo or voice note.",
  water: "For water supply issues, please raise a complaint under the 'Water' category in Services.",
  road: "For road or pothole issues, please raise a complaint under the 'Road' category in Services.",
  garbage: "For garbage-related complaints, use the 'Garbage' category in the Services tab.",
  default: "Thank you for your message. Your query has been noted and will be forwarded to the Ward Councillor's office.",
};

interface ChatMsg { from: 'user' | 'bot'; text: string; time: string }

function getTime() {
  return new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
}

function getBotReply(input: string): string {
  const lower = input.toLowerCase();
  for (const [key, reply] of Object.entries(BOT_RESPONSES)) {
    if (key !== 'default' && lower.includes(key)) return reply;
  }
  return BOT_RESPONSES.default;
}

/* ─── Chat Component ────────────────────────────────────── */

function CouncillorChat() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMsg[]>([
    { from: 'bot', text: "Hello! I'm the Kowdiar Ward Councillor's office assistant. How can I help you today?", time: getTime() },
  ]);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const send = () => {
    const text = input.trim();
    if (!text) return;
    const userMsg: ChatMsg = { from: 'user', text, time: getTime() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setTimeout(() => {
      setMessages(prev => [...prev, { from: 'bot', text: getBotReply(text), time: getTime() }]);
    }, 600);
  };

  const handleKey = (e: React.KeyboardEvent) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); } };

  return (
    <div className="rounded-2xl overflow-hidden" style={{ background: '#fff', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
      {/* Councillor card header */}
      <div className="p-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-full flex items-center justify-center text-sm font-bold shrink-0"
            style={{ background: '#E8F5E9', color: '#2E7D32' }}>
            {COUNCILLOR.avatar}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ background: '#E8F5E9', color: '#2E7D32' }}>
                Ward Councillor
              </span>
              <span className="w-2 h-2 rounded-full inline-block" style={{ background: '#2E7D32' }} title="Online" />
            </div>
            <p className="text-sm font-semibold mt-1" style={{ color: '#1F2937' }}>{COUNCILLOR.name}</p>
            <p className="text-xs" style={{ color: '#9CA3AF' }}>{COUNCILLOR.description}</p>
          </div>
        </div>
      </div>

      {/* Contact links */}
      <div className="px-4 pb-3 flex flex-wrap gap-2">
        <a href={`tel:${COUNCILLOR.phone.replace(/\s/g, '')}`}
          className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl"
          style={{ background: '#E8F5E9', color: '#2E7D32' }}>
          <Phone className="w-3.5 h-3.5" /> {COUNCILLOR.phone}
        </a>
        <a href={`mailto:${COUNCILLOR.email}`}
          className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl"
          style={{ background: '#F2F4F3', color: '#6B7280' }}>
          <Mail className="w-3.5 h-3.5" /> Email
        </a>
      </div>

      {/* Chat toggle */}
      <div style={{ borderTop: '1px solid #F2F4F3' }}>
        <button
          type="button"
          onClick={() => setOpen(o => !o)}
          className="w-full flex items-center justify-between gap-2 px-4 py-3 text-sm font-semibold transition-colors hover:bg-gray-50"
          style={{ color: '#2E7D32' }}
        >
          <span className="flex items-center gap-2">
            <MessageCircle className="w-4 h-4" />
            Chat with Councillor's Office
          </span>
          <ChevronDown className="w-4 h-4 transition-transform" style={{ transform: open ? 'rotate(180deg)' : 'none' }} />
        </button>

        {open && (
          <div className="flex flex-col" style={{ borderTop: '1px solid #F2F4F3' }}>
            {/* Messages */}
            <div className="flex flex-col gap-2.5 p-4 overflow-y-auto" style={{ maxHeight: '300px', background: '#F7F9F7' }}>
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.from === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className="max-w-[80%]">
                    <div
                      className="px-3 py-2 rounded-2xl text-xs leading-relaxed"
                      style={{
                        background: msg.from === 'user' ? '#2E7D32' : '#fff',
                        color: msg.from === 'user' ? '#fff' : '#1F2937',
                        borderBottomRightRadius: msg.from === 'user' ? '4px' : '16px',
                        borderBottomLeftRadius: msg.from === 'bot' ? '4px' : '16px',
                        boxShadow: '0 1px 2px rgba(0,0,0,0.08)',
                      }}
                    >
                      {msg.text}
                    </div>
                    <p className="text-[10px] mt-0.5 px-1" style={{ color: '#9CA3AF', textAlign: msg.from === 'user' ? 'right' : 'left' }}>
                      {msg.time}
                    </p>
                  </div>
                </div>
              ))}
              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <div className="flex items-center gap-2 p-3" style={{ borderTop: '1px solid #F2F4F3', background: '#fff' }}>
              <input
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKey}
                placeholder="Type a message..."
                className="flex-1 text-xs px-3 py-2.5 rounded-xl outline-none transition-all"
                style={{ background: '#F2F4F3', border: '2px solid transparent', color: '#1F2937' }}
                onFocus={e => { e.target.style.borderColor = '#2E7D32'; }}
                onBlur={e => { e.target.style.borderColor = 'transparent'; }}
              />
              <button
                type="button"
                onClick={send}
                disabled={!input.trim()}
                className="w-9 h-9 rounded-xl flex items-center justify-center transition-all shrink-0"
                style={{
                  background: input.trim() ? '#2E7D32' : '#E5E7EB',
                  color: input.trim() ? '#fff' : '#9CA3AF',
                }}
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── Page ──────────────────────────────────────────────── */

export default function ContactPage() {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-base font-bold" style={{ color: '#1F2937' }}>Ward Office</h1>
        <p className="text-xs mt-0.5" style={{ color: '#9CA3AF' }}>
          Chat with the Councillor's office or contact ward representatives.
        </p>
      </div>

      {/* Councillor — chat enabled */}
      <CouncillorChat />

      {/* Other representatives — contact details only */}
      <div className="flex flex-col gap-2">
        <p className="text-xs font-bold uppercase tracking-wider" style={{ color: '#9CA3AF' }}>
          Ward Representatives
        </p>
        {OTHER_CONTACTS.map((c, i) => (
          <div key={i} className="rounded-2xl p-4 flex flex-col gap-3" style={{ background: '#fff', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                style={{ background: c.roleBg, color: c.roleColor }}>
                {c.name.split(' ')[1]?.[0] ?? c.name[0]}
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ background: c.roleBg, color: c.roleColor }}>
                  {c.role}
                </span>
                <p className="text-sm font-semibold mt-1.5" style={{ color: '#1F2937' }}>{c.name}</p>
                <p className="text-xs mt-0.5" style={{ color: '#6B7280' }}>{c.description}</p>
              </div>
            </div>
            <div className="flex flex-col gap-1.5 pt-2.5" style={{ borderTop: '1px solid #F2F4F3' }}>
              <a href={`tel:${c.phone.replace(/\s/g, '')}`} className="flex items-center gap-2 text-xs font-semibold" style={{ color: '#2E7D32' }}>
                <Phone className="w-3.5 h-3.5" /> {c.phone}
              </a>
              {c.email && (
                <a href={`mailto:${c.email}`} className="flex items-center gap-2 text-xs truncate" style={{ color: '#6B7280' }}>
                  <Mail className="w-3.5 h-3.5 shrink-0" /> {c.email}
                </a>
              )}
              {c.location && (
                <div className="flex items-start gap-2 text-xs" style={{ color: '#9CA3AF' }}>
                  <MapPin className="w-3.5 h-3.5 shrink-0 mt-0.5" /> {c.location}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Helplines */}
      <div className="rounded-2xl p-4 flex flex-col gap-3" style={{ background: '#fff', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
        <p className="text-xs font-bold uppercase tracking-wider" style={{ color: '#9CA3AF' }}>Municipal Helplines</p>
        <div className="flex flex-col gap-2">
          {HELPLINES.map(h => (
            <div key={h.label} className="flex items-center justify-between gap-3 rounded-xl px-3 py-2.5" style={{ background: '#F2F4F3' }}>
              <div>
                <p className="text-xs font-semibold" style={{ color: '#1F2937' }}>{h.label}</p>
                <p className="text-xs mt-0.5" style={{ color: '#9CA3AF' }}>{h.sub}</p>
              </div>
              <a href={h.href} className="flex items-center gap-1.5 text-sm font-bold" style={{ color: '#2E7D32' }}>
                {h.number} <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
