'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/components/AuthContext';
import { getComplaints, Complaint } from '@/utils/storage';
import {
  MapPin, Home, Volume2, VolumeX,
  Map, Droplet, Trash2, Lightbulb, Activity, Settings,
  PlusCircle, Megaphone, FolderOpen, User, ArrowRight, Inbox,
  CheckCircle, Clock, AlertCircle, Tag
} from 'lucide-react';

export default function HomePage() {
  const { user } = useAuth();
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [stats, setStats] = useState({ active: 0, resolved: 0, total: 0 });
  const [recentComplaints, setRecentComplaints] = useState<Complaint[]>([]);
  const [isHelpSpeaking, setIsHelpSpeaking] = useState(false);

  useEffect(() => {
    const list = getComplaints();
    setComplaints(list);
    const resolved = list.filter(c => c.status === 'Resolved').length;
    setStats({ active: list.length - resolved, resolved, total: list.length });
    setRecentComplaints(list.slice(0, 3));
    return () => { if (typeof window !== 'undefined') window.speechSynthesis.cancel(); };
  }, []);

  const toggleHelpInstructions = () => {
    if (typeof window === 'undefined') return;
    if (isHelpSpeaking) {
      window.speechSynthesis.cancel();
      setIsHelpSpeaking(false);
    } else {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(
        `Welcome to WardConnect, ${user?.name || 'citizen'}. ` +
        `Use Services tab to report a new issue. ` +
        `Check your complaints in My Grievances. ` +
        `Contact your ward office through the Chat tab.`
      );
      utterance.lang = 'en-US';
      utterance.rate = 0.85;
      utterance.onend = () => setIsHelpSpeaking(false);
      utterance.onerror = () => setIsHelpSpeaking(false);
      setIsHelpSpeaking(true);
      window.speechSynthesis.speak(utterance);
    }
  };

  const renderCategoryIcon = (cat: Complaint['category'], size = 'w-5 h-5') => {
    switch (cat) {
      case 'Road':        return <Map className={size} />;
      case 'Water':       return <Droplet className={size} />;
      case 'Garbage':     return <Trash2 className={size} />;
      case 'Electricity': return <Lightbulb className={size} />;
      case 'Health':      return <Activity className={size} />;
      default:            return <Settings className={size} />;
    }
  };

  const getCategoryStyle = (cat: Complaint['category']) => {
    switch (cat) {
      case 'Road':        return { bg: '#FFF8E1', color: '#F57F17' };
      case 'Water':       return { bg: '#E3F2FD', color: '#1976D2' };
      case 'Garbage':     return { bg: '#E8F5E9', color: '#2E7D32' };
      case 'Electricity': return { bg: '#FFFDE7', color: '#F9A825' };
      case 'Health':      return { bg: '#FCE4EC', color: '#C2185B' };
      default:            return { bg: '#F3E5F5', color: '#7B1FA2' };
    }
  };

  const getStatusChip = (status: Complaint['status']) => {
    switch (status) {
      case 'Resolved':    return { bg: '#E8F5E9', color: '#2E7D32', icon: <CheckCircle className="w-3 h-3" /> };
      case 'In Progress': return { bg: '#FFF8E1', color: '#F57F17', icon: <Clock className="w-3 h-3" /> };
      default:            return { bg: '#E3F2FD', color: '#1976D2', icon: <AlertCircle className="w-3 h-3" /> };
    }
  };

  const QUICK_ACTIONS = [
    {
      href: '/raise-complaint',
      label: 'Report Issue',
      description: 'Road, water, garbage, electricity',
      icon: PlusCircle,
      iconBg: '#E8F5E9',
      iconColor: '#2E7D32',
    },
    {
      href: '/updates',
      label: 'Updates',
      description: 'Notices & ward news',
      icon: Megaphone,
      iconBg: '#FFF8E1',
      iconColor: '#F57F17',
    },
    {
      href: '/complaints',
      label: 'My Grievances',
      description: 'Track reported issues',
      icon: FolderOpen,
      iconBg: '#E3F2FD',
      iconColor: '#1976D2',
    },
    {
      href: '/contact',
      label: 'Ward Directory',
      description: 'Contacts & helplines',
      icon: User,
      iconBg: '#E0F2F1',
      iconColor: '#00897B',
    },
    {
      href: '/offers',
      label: 'Offers Zone',
      description: 'Discounts & welfare schemes for residents',
      icon: Tag,
      iconBg: '#FCE4EC',
      iconColor: '#C2185B',
    },
  ];

  return (
    <div className="flex flex-col gap-5">

      {/* ── Welcome Card ── */}
      <section
        className="rounded-3xl p-5 flex items-start justify-between gap-4"
        style={{ background: '#E8F5E9' }}
      >
        <div className="flex items-center gap-3.5">
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0"
            style={{ background: '#fff' }}
          >
            <Home className="w-6 h-6" style={{ color: '#2E7D32' }} strokeWidth={2} />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider mb-0.5" style={{ color: '#43A047' }}>
              Good day
            </p>
            <h2 className="text-xl font-bold leading-tight" style={{ color: '#1F2937', fontSize: '20px' }}>
              {user?.name || 'Resident'}
            </h2>
            <div className="flex items-center gap-1.5 mt-0.5 text-xs font-medium" style={{ color: '#6B7280' }}>
              <MapPin className="w-3.5 h-3.5" style={{ color: '#43A047' }} />
              <span>Ward {user?.ward} · House {user?.houseNo}</span>
            </div>
          </div>
        </div>

        {/* Voice guide button */}
        <button
          type="button"
          onClick={toggleHelpInstructions}
          className="shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-all"
          style={{
            background: isHelpSpeaking ? '#fff3' : '#2E7D32',
            color: '#fff',
            boxShadow: '0 2px 8px rgba(46,125,50,0.25)',
          }}
          aria-label={isHelpSpeaking ? 'Stop voice guide' : 'Play voice guide'}
        >
          {isHelpSpeaking ? <VolumeX className="w-4.5 h-4.5" /> : <Volume2 className="w-4.5 h-4.5" />}
        </button>
      </section>

      {/* ── Stats Row ── */}
      <section className="grid grid-cols-3 gap-3">
        {[
          { label: 'Active', value: stats.active, color: '#1976D2', bg: '#E3F2FD' },
          { label: 'In Progress', value: stats.total - stats.active - stats.resolved, color: '#F57F17', bg: '#FFF8E1' },
          { label: 'Resolved', value: stats.resolved, color: '#2E7D32', bg: '#E8F5E9' },
        ].map(s => (
          <div
            key={s.label}
            className="flex flex-col items-center text-center py-4 px-2 rounded-2xl"
            style={{ background: s.bg }}
          >
            <span className="text-2xl font-bold leading-none" style={{ color: s.color }}>{s.value}</span>
            <span className="text-xs font-semibold mt-1" style={{ color: s.color, opacity: 0.8 }}>{s.label}</span>
          </div>
        ))}
      </section>

      {/* ── Quick Actions ── */}
      <section className="flex flex-col gap-3">
        <h3 className="text-xs font-bold uppercase tracking-wider" style={{ color: '#9CA3AF' }}>
          Quick Actions
        </h3>
        <div className="grid grid-cols-2 gap-3">
          {QUICK_ACTIONS.map(({ href, label, description, icon: Icon, iconBg, iconColor }, index) => {
            const isFullWidth = index === 4;
            return (
              <Link
                key={href}
                href={href}
                className={`group flex ${isFullWidth ? 'col-span-2 flex-row items-center gap-4' : 'flex-col gap-3'} rounded-2xl p-4 transition-all active:scale-[0.97]`}
                style={{
                  background: '#fff',
                  boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
                  minHeight: isFullWidth ? '80px' : '120px',
                }}
                onMouseEnter={e => (e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.10)')}
                onMouseLeave={e => (e.currentTarget.style.boxShadow = '0 1px 4px rgba(0,0,0,0.06)')}
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: iconBg }}
                >
                  <span style={{ color: iconColor }}>
                    <Icon className="w-5 h-5" strokeWidth={2} />
                  </span>
                </div>
                <div>
                  <p className="text-sm font-bold" style={{ color: '#1F2937' }}>{label}</p>
                  <p className="text-xs mt-0.5" style={{ color: '#9CA3AF' }}>{description}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* ── Recent Complaints ── */}
      <section className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider" style={{ color: '#9CA3AF' }}>
            Recent Complaints
          </h3>
          {complaints.length > 0 && (
            <Link href="/complaints" className="text-xs font-semibold flex items-center gap-1" style={{ color: '#2E7D32' }}>
              See all <ArrowRight className="w-3 h-3" />
            </Link>
          )}
        </div>

        {recentComplaints.length === 0 ? (
          <div
            className="flex flex-col items-center gap-3 py-8 rounded-2xl text-center"
            style={{ background: '#fff', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}
          >
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center"
              style={{ background: '#F2F4F3' }}
            >
              <Inbox className="w-7 h-7" style={{ color: '#9CA3AF' }} />
            </div>
            <div>
              <p className="font-semibold text-sm" style={{ color: '#1F2937' }}>No complaints yet</p>
              <p className="text-xs mt-1" style={{ color: '#9CA3AF' }}>Spotted a local issue? Report it now.</p>
            </div>
            <Link
              href="/raise-complaint"
              className="flex items-center gap-2 text-sm font-semibold px-4 py-2.5 rounded-xl transition-all"
              style={{ background: '#2E7D32', color: '#fff', boxShadow: '0 2px 8px rgba(46,125,50,0.25)' }}
            >
              <PlusCircle className="w-4 h-4" /> Report an Issue
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-2.5">
            {recentComplaints.map(item => {
              const catStyle = getCategoryStyle(item.category);
              const statusStyle = getStatusChip(item.status);
              return (
                <div
                  key={item.id}
                  className="flex items-center gap-3 rounded-2xl p-4"
                  style={{ background: '#fff', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                    style={{ background: catStyle.bg }}
                  >
                    <span style={{ color: catStyle.color }}>
                      {renderCategoryIcon(item.category)}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold truncate" style={{ color: '#1F2937' }}>{item.title}</p>
                    <p className="text-xs mt-0.5" style={{ color: '#9CA3AF' }}>
                      {item.category} · {new Date(item.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                    </p>
                  </div>
                  <div
                    className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold shrink-0"
                    style={{ background: statusStyle.bg, color: statusStyle.color }}
                  >
                    {statusStyle.icon}
                    {item.status}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

    </div>
  );
}
