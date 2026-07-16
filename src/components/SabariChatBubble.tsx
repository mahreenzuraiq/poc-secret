'use client';

import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, Send, X, Phone, Mail, MapPin, ChevronDown, MessageCircle } from 'lucide-react';
import { useAuth } from './AuthContext';

interface Message {
  id: string;
  sender: 'user' | 'councillor';
  text: string;
  timestamp: string;
}

const COUNCILLOR_NAME = 'K S Sabarinadhan';

const INITIAL_MESSAGES: Message[] = [
  {
    id: 'm-init-1',
    sender: 'councillor',
    text: `Namaskar! I am K S Sabarinadhan, your Ward Councillor. How can I assist you with Kowdiar Ward development or grievances today?`,
    timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
  }
];

const BOT_REPLIES: Record<string, string> = {
  hello: "Namaskar! Hope you are doing well. Please let me know how I can help you with Kowdiar Ward issues.",
  hi: "Namaskar! How can I help you today?",
  pothole: "I have noted the road issue. Please file it under the 'Services' tab with a photo so our engineering wing can inspect and resolve it promptly.",
  road: "Road maintenance and tarring works are being prioritized. Please submit a grievance in the app with the exact location description so we can take action.",
  water: "Kerala Water Authority pipeline works are currently active in parts of Kowdiar. If you are facing local supply disruption, please raise it in the Services tab.",
  garbage: "Cleanliness is our priority. I will alert Smt. Jane Doe (Health Inspector) to check on garbage clearance in your area. Do log it via the Services tab.",
  streetlight: "Streetlight maintenance is scheduled weekly. Please file a complaint with the pole number or landmark so the electricity wing can replace the bulb.",
  meeting: "I am available at the Ward Community Hall every Wednesday and Saturday from 10:00 AM to 1:00 PM for direct citizen consultations.",
  contact: "You can reach my office assistant at +91 94470 12345 or email me at councillor.kowdiar@municipal.gov.in.",
  thank: "You're welcome! We are working continuously to make Kowdiar a better place for every resident. Thank you for reaching out.",
  thanks: "You're welcome! We are working continuously to make Kowdiar a better place for every resident. Thank you for reaching out.",
};

function getBotResponse(userMsg: string): string {
  const lower = userMsg.toLowerCase();
  if (lower.includes('pothole') || lower.includes('broken road')) return BOT_REPLIES.pothole;
  if (lower.includes('road') || lower.includes('street') || lower.includes('drain')) return BOT_REPLIES.road;
  if (lower.includes('water') || lower.includes('pipe') || lower.includes('leak')) return BOT_REPLIES.water;
  if (lower.includes('garbage') || lower.includes('waste') || lower.includes('clean')) return BOT_REPLIES.garbage;
  if (lower.includes('light') || lower.includes('bulb') || lower.includes('electricity')) return BOT_REPLIES.streetlight;
  if (lower.includes('meet') || lower.includes('time') || lower.includes('office')) return BOT_REPLIES.meeting;
  if (lower.includes('phone') || lower.includes('call') || lower.includes('number') || lower.includes('email')) return BOT_REPLIES.contact;
  if (lower.includes('thank') || lower.includes('good') || lower.includes('nice')) return BOT_REPLIES.thank;
  if (lower.includes('hello') || lower.includes('namaskar') || lower.includes('namaste')) return BOT_REPLIES.hello;
  if (lower.includes('hi')) return BOT_REPLIES.hi;

  return `Thank you for your message. I have forwarded this details to the ward engineering and public works desk. You can track all updates directly in your Grievances tab.`;
}

export default function SabariChatBubble() {
  const { isLoggedIn, user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMessages(INITIAL_MESSAGES);
  }, []);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  }, [isOpen, messages, isTyping]);

  if (!isLoggedIn) return null;

  const handleSend = () => {
    const text = input.trim();
    if (!text) return;

    const userMessage: Message = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Simulate bot response
    setTimeout(() => {
      setIsTyping(false);
      const botMessage: Message = {
        id: `msg-${Date.now() + 1}`,
        sender: 'councillor',
        text: getBotResponse(text),
        timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, botMessage]);
    }, 1200);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  return (
    <>
      {/* Closed Floating Bubble */}
      {!isOpen && (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="fixed bottom-20 right-4 z-40 w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-transform hover:scale-105 active:scale-95 cursor-pointer animate-fade-in animate-bounce-subtle"
          style={{
            background: '#2E7D32',
            color: '#fff',
            border: '3px solid #fff',
            boxShadow: '0 4px 16px rgba(46,125,50,0.4)',
          }}
          aria-label={`Chat with Councillor ${COUNCILLOR_NAME}`}
        >
          <div className="relative">
            <MessageCircle className="w-6 h-6" />
            <span className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 rounded-full bg-amber-500 border border-white" />
          </div>
          <span className="absolute right-16 bg-emerald-800 text-white font-bold text-xs px-3 py-1.5 rounded-xl shadow border border-emerald-700 whitespace-nowrap hidden md:block">
            Chat with {COUNCILLOR_NAME}
          </span>
        </button>
      )}

      {/* Expanded Chat Dialog */}
      {isOpen && (
        <div 
          className="fixed bottom-20 right-4 z-40 w-[350px] max-w-[90vw] h-[450px] rounded-3xl overflow-hidden bg-white border border-gray-150 flex flex-col shadow-2xl animate-check-pop"
          style={{
            boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
          }}
        >
          {/* Header */}
          <div className="p-4 flex items-center justify-between gap-3 text-white border-b border-emerald-900" style={{ background: '#2E7D32' }}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold bg-white" style={{ color: '#2E7D32' }}>
                KS
              </div>
              <div>
                <p className="text-xs font-semibold bg-emerald-700/60 px-2 py-0.5 rounded-full w-max">
                  Ward Councillor
                </p>
                <h4 className="text-sm font-bold mt-0.5 leading-none">{COUNCILLOR_NAME}</h4>
              </div>
            </div>
            
            <button 
              type="button"
              onClick={() => setIsOpen(false)}
              className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-emerald-750 transition-colors"
              aria-label="Close chat"
            >
              <X className="w-5 h-5 text-emerald-100" />
            </button>
          </div>

          {/* Quick Contact Bar */}
          <div className="bg-emerald-50 px-4 py-2 flex justify-between items-center text-[11px] font-semibold text-emerald-800 border-b border-emerald-100 shrink-0">
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 inline-block animate-pulse" /> Live Assistant
            </span>
            <div className="flex gap-2">
              <a href="tel:+919447012345" className="hover:underline flex items-center gap-0.5">
                <Phone className="w-3 h-3" /> Call
              </a>
              <span className="text-emerald-250">|</span>
              <a href="mailto:councillor.kowdiar@municipal.gov.in" className="hover:underline flex items-center gap-0.5">
                <Mail className="w-3 h-3" /> Email
              </a>
            </div>
          </div>

          {/* Messages Body */}
          <div className="flex-1 p-4 overflow-y-auto flex flex-col gap-3 bg-gray-50/50">
            {messages.map((msg) => {
              const isMe = msg.sender === 'user';
              return (
                <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                  <div className="max-w-[85%]">
                    <div 
                      className="px-3.5 py-2.5 rounded-2xl text-xs leading-relaxed"
                      style={{
                        background: isMe ? '#2E7D32' : '#fff',
                        color: isMe ? '#fff' : '#1F2937',
                        borderBottomRightRadius: isMe ? '4px' : '16px',
                        borderBottomLeftRadius: isMe ? '16px' : '4px',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
                        border: isMe ? 'none' : '1px solid #E5E7EB',
                      }}
                    >
                      {msg.text}
                    </div>
                    <p className="text-[10px] text-gray-400 mt-1 px-1" style={{ textAlign: isMe ? 'right' : 'left' }}>
                      {msg.timestamp}
                    </p>
                  </div>
                </div>
              );
            })}

            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white border border-gray-200 px-4 py-3 rounded-2xl rounded-bl-sm flex items-center gap-1 shadow-sm">
                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Footer */}
          <div className="p-3 border-t border-gray-100 bg-white flex items-center gap-2 shrink-0">
            <input 
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={`Ask K S Sabarinadhan a question...`}
              className="flex-1 text-xs px-3.5 py-2.5 rounded-xl border border-gray-200 outline-none focus:border-emerald-600 transition-colors"
            />
            <button
              type="button"
              onClick={handleSend}
              disabled={!input.trim()}
              className="w-9 h-9 rounded-xl flex items-center justify-center transition-colors shrink-0 cursor-pointer"
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
    </>
  );
}
