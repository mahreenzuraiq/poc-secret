'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { getComplaints, Complaint } from '@/utils/storage';
import {
  Map, Droplet, Trash2, Lightbulb, Activity, Settings,
  Camera, CameraOff, Volume2, MicOff, FileText, MapPin, Calendar,
  Trash, FolderOpen, PlusCircle, CheckCircle, Clock, AlertCircle
} from 'lucide-react';

export default function ComplaintsHistoryPage() {
  const [complaints, setComplaints] = useState<Complaint[]>([]);

  useEffect(() => { setComplaints(getComplaints()); }, []);

  const deleteComplaint = (id: string) => {
    if (confirm('Delete this complaint record from your device?')) {
      const updated = complaints.filter(c => c.id !== id);
      localStorage.setItem('ward-portal-complaints', JSON.stringify(updated));
      setComplaints(updated);
    }
  };

  const clearAll = () => {
    if (confirm('Delete ALL complaint records from this device?')) {
      localStorage.removeItem('ward-portal-complaints');
      setComplaints([]);
    }
  };

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });

  const getCatStyle = (cat: Complaint['category']) => {
    switch (cat) {
      case 'Road':        return { bg: '#FFF8E1', color: '#F57F17', icon: <Map className="w-4 h-4" /> };
      case 'Water':       return { bg: '#E3F2FD', color: '#1976D2', icon: <Droplet className="w-4 h-4" /> };
      case 'Garbage':     return { bg: '#E8F5E9', color: '#2E7D32', icon: <Trash2 className="w-4 h-4" /> };
      case 'Electricity': return { bg: '#FFFDE7', color: '#F9A825', icon: <Lightbulb className="w-4 h-4" /> };
      case 'Health':      return { bg: '#FCE4EC', color: '#C2185B', icon: <Activity className="w-4 h-4" /> };
      default:            return { bg: '#F3E5F5', color: '#7B1FA2', icon: <Settings className="w-4 h-4" /> };
    }
  };

  const getStatusStyle = (status: Complaint['status']) => {
    switch (status) {
      case 'Resolved':    return { bg: '#E8F5E9', color: '#2E7D32', icon: <CheckCircle className="w-3 h-3" /> };
      case 'In Progress': return { bg: '#FFF8E1', color: '#F57F17', icon: <Clock className="w-3 h-3" /> };
      default:            return { bg: '#E3F2FD', color: '#1976D2', icon: <AlertCircle className="w-3 h-3" /> };
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-base font-bold" style={{ color: '#1F2937' }}>
          My Complaints
          {complaints.length > 0 && (
            <span className="ml-2 text-xs font-semibold px-2 py-0.5 rounded-full" style={{ background: '#E8F5E9', color: '#2E7D32' }}>
              {complaints.length}
            </span>
          )}
        </h1>
        {complaints.length > 0 && (
          <button onClick={clearAll} className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl transition-all" style={{ color: '#D32F2F', background: '#FFEBEE' }}>
            <Trash className="w-3.5 h-3.5" /> Clear All
          </button>
        )}
      </div>

      {complaints.length === 0 ? (
        /* Empty state */
        <div className="flex flex-col items-center gap-4 py-12 text-center rounded-2xl" style={{ background: '#fff', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center" style={{ background: '#F2F4F3' }}>
            <FolderOpen className="w-8 h-8" style={{ color: '#9CA3AF' }} />
          </div>
          <div>
            <p className="text-sm font-semibold" style={{ color: '#1F2937' }}>No complaints yet</p>
            <p className="text-xs mt-1" style={{ color: '#9CA3AF' }}>Reported issues from this device will appear here.</p>
          </div>
          <Link href="/raise-complaint" className="flex items-center gap-2 text-sm font-semibold px-4 py-2.5 rounded-xl" style={{ background: '#2E7D32', color: '#fff' }}>
            <PlusCircle className="w-4 h-4" /> File a Complaint
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {complaints.map(item => {
            const cat = getCatStyle(item.category);
            const status = getStatusStyle(item.status);
            return (
              <div key={item.id} className="rounded-2xl overflow-hidden" style={{ background: '#fff', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
                {/* Card header */}
                <div className="flex items-center justify-between px-4 py-3" style={{ borderBottom: '1px solid #F2F4F3' }}>
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: cat.bg }}>
                      <span style={{ color: cat.color }}>{cat.icon}</span>
                    </div>
                    <div>
                      <p className="text-sm font-semibold" style={{ color: '#1F2937' }}>{item.title}</p>
                      <p className="text-xs" style={{ color: '#9CA3AF' }}>{item.category} · {item.id.split('-')[0]}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold" style={{ background: status.bg, color: status.color }}>
                    {status.icon} {item.status}
                  </div>
                </div>

                {/* Card body */}
                <div className="px-4 py-3 flex flex-col gap-2">
                  {/* Meta */}
                  <div className="flex items-center gap-3 text-xs" style={{ color: '#9CA3AF' }}>
                    <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{item.ward}</span>
                    <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{formatDate(item.createdAt)}</span>
                  </div>

                  {/* Description */}
                  {item.description && (
                    <p className="text-xs leading-relaxed" style={{ color: '#6B7280' }}>"{item.description}"</p>
                  )}

                  {/* Attachments row */}
                  <div className="flex gap-2 flex-wrap">
                    {item.photo ? (
                      <div className="relative w-16 h-16 rounded-xl overflow-hidden" style={{ border: '2px solid #E5E7EB' }}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={item.photo} alt="Complaint photo" className="w-full h-full object-cover" />
                      </div>
                    ) : (
                      <div className="flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-lg" style={{ background: '#F2F4F3', color: '#9CA3AF' }}>
                        <CameraOff className="w-3 h-3" /> No photo
                      </div>
                    )}
                    {item.audio ? (
                      <div className="flex-1 min-w-0 rounded-xl p-2" style={{ background: '#F2F4F3' }}>
                        <div className="flex items-center gap-1.5 mb-1 text-xs font-semibold" style={{ color: '#6B7280' }}>
                          <Volume2 className="w-3 h-3" /> Voice note · {item.audioDuration}s
                        </div>
                        <audio src={item.audio} controls className="w-full h-7" />
                      </div>
                    ) : (
                      <div className="flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-lg" style={{ background: '#F2F4F3', color: '#9CA3AF' }}>
                        <MicOff className="w-3 h-3" /> No voice note
                      </div>
                    )}
                  </div>
                </div>

                {/* Delete action */}
                <div className="flex justify-end px-4 py-2.5" style={{ borderTop: '1px solid #F2F4F3' }}>
                  <button onClick={() => deleteComplaint(item.id)} className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg transition-all" style={{ color: '#D32F2F', background: '#FFEBEE' }}>
                    <Trash className="w-3 h-3" /> Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
