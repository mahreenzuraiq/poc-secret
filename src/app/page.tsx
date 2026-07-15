'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/components/AuthContext';
import { getComplaints, Complaint } from '@/utils/storage';
import { 
  Building2, 
  MapPin, 
  Home, 
  Volume2, 
  VolumeX, 
  Map, 
  Droplet, 
  Trash2, 
  Lightbulb, 
  Activity, 
  Settings, 
  PlusCircle, 
  Megaphone, 
  FolderOpen, 
  User, 
  ArrowRight, 
  Inbox 
} from 'lucide-react';

export default function HomePage() {
  const { user } = useAuth();
  
  // Dashboard statistics and recent items
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [stats, setStats] = useState({ active: 0, resolved: 0, total: 0 });
  const [recentComplaints, setRecentComplaints] = useState<Complaint[]>([]);
  const [isHelpSpeaking, setIsHelpSpeaking] = useState(false);

  useEffect(() => {
    const list = getComplaints();
    setComplaints(list);

    // Calculate dynamic stats
    const total = list.length;
    const resolved = list.filter(c => c.status === 'Resolved').length;
    const active = total - resolved;
    setStats({ active, resolved, total });

    // Get 2 most recent complaints
    setRecentComplaints(list.slice(0, 2));

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
        `Welcome back to WardConnect, ${user?.name || 'citizen'}. ` +
        `This dashboard shows your active complaints. ` +
        `To file a new ward issue, click the green card titled Raise Complaint. ` +
        `To view news updates and sales in your area, click the amber card titled Ward Updates. ` +
        `To inspect all of your reported issues and play back voice notes, click the blue card titled My Complaints. ` +
        `If you need to change your name or house number, click the teal card titled My Profile. ` +
        `Have a great day!`;
      
      const utterance = new SpeechSynthesisUtterance(instructions);
      utterance.lang = 'en-US';
      utterance.rate = 0.85;

      utterance.onend = () => setIsHelpSpeaking(false);
      utterance.onerror = () => setIsHelpSpeaking(false);

      setIsHelpSpeaking(true);
      window.speechSynthesis.speak(utterance);
    }
  };

  const renderCategoryIcon = (cat: Complaint['category'], className = "w-6 h-6") => {
    switch (cat) {
      case 'Road': return <Map className={className} />;
      case 'Water': return <Droplet className={className} />;
      case 'Garbage': return <Trash2 className={className} />;
      case 'Electricity': return <Lightbulb className={className} />;
      case 'Health': return <Activity className={className} />;
      default: return <Settings className={className} />;
    }
  };

  const getStatusBadge = (status: Complaint['status']) => {
    switch (status) {
      case 'Resolved':
        return 'bg-emerald-100 text-emerald-900 border border-emerald-250';
      case 'In Progress':
        return 'bg-blue-100 text-blue-900 border border-blue-250';
      default:
        return 'bg-amber-100 text-amber-900 border border-amber-250';
    }
  };

  return (
    <div className="flex flex-col gap-6 py-2">
      
      {/* 1. Welcome Card (FR-002) */}
      <section className="bg-white border-3 border-dark-teal rounded-3xl p-6 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4.5 text-left">
          <div className="p-3 bg-emerald-50 rounded-2xl text-emerald-850 border border-emerald-100">
            <Building2 className="w-10 h-10" />
          </div>
          <div className="flex flex-col">
            <h2 className="text-2xl sm:text-3xl font-black text-ink-black">
              Welcome, {user?.name || 'Resident'}!
            </h2>
            <div className="text-gray-650 text-base font-semibold mt-1 flex flex-wrap gap-x-3 gap-y-1">
              <span className="flex items-center gap-1"><MapPin className="w-4 h-4 text-emerald-850" /> <strong>Ward:</strong> {user?.ward}</span>
              <span className="hidden sm:inline text-gray-300">|</span>
              <span className="flex items-center gap-1"><Home className="w-4 h-4 text-emerald-850" /> <strong>House:</strong> {user?.houseNo}</span>
            </div>
          </div>
        </div>

        {/* Dynamic Help Speaker button */}
        <button
          type="button"
          onClick={toggleHelpInstructions}
          className={`py-3 px-5 rounded-xl font-bold transition-all shadow flex items-center justify-center gap-2.5 text-base active:scale-[0.98] ${
            isHelpSpeaking 
              ? 'bg-amber-500 hover:bg-amber-600 text-emerald-950 border border-amber-600' 
              : 'bg-emerald-800 hover:bg-emerald-900 text-white'
          }`}
          style={{ minHeight: '52px' }}
        >
          {isHelpSpeaking ? (
            <>
              <VolumeX className="w-5 h-5" /> Stop Voice Guide
            </>
          ) : (
            <>
              <Volume2 className="w-5 h-5" /> Play Audio Guide
            </>
          )}
        </button>
      </section>

      {/* 2. Complaint Statistics (FR-002) */}
      <section className="grid grid-cols-3 gap-4 w-full">
        {/* Active Stats Card */}
        <div className="bg-amber-50/50 border-3 border-amber-400 rounded-2xl p-4 sm:p-5 flex flex-col items-center justify-center text-center shadow-sm">
          <span className="text-4xl sm:text-5xl font-black text-amber-900 leading-none">
            {stats.active}
          </span>
          <span className="text-gray-650 text-base font-extrabold mt-2 uppercase tracking-wide">
            Active
          </span>
        </div>

        {/* Resolved Stats Card */}
        <div className="bg-emerald-50/50 border-3 border-emerald-500 rounded-2xl p-4 sm:p-5 flex flex-col items-center justify-center text-center shadow-sm">
          <span className="text-4xl sm:text-5xl font-black text-emerald-900 leading-none">
            {stats.resolved}
          </span>
          <span className="text-gray-650 text-base font-extrabold mt-2 uppercase tracking-wide">
            Resolved
          </span>
        </div>

        {/* Total Stats Card */}
        <div className="bg-blue-50/50 border-3 border-blue-400 rounded-2xl p-4 sm:p-5 flex flex-col items-center justify-center text-center shadow-sm">
          <span className="text-4xl sm:text-5xl font-black text-blue-900 leading-none">
            {stats.total}
          </span>
          <span className="text-gray-650 text-base font-extrabold mt-2 uppercase tracking-wide">
            Total
          </span>
        </div>
      </section>

      {/* 3. Quick Actions Grid (FR-002) */}
      <section className="flex flex-col gap-3">
        <h3 className="text-xl font-bold text-gray-900 tracking-wide uppercase">
          Quick Actions
        </h3>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full">
          {/* Action: Raise Complaint */}
          <Link 
            href="/raise-complaint"
            className="flex flex-col items-center justify-center border-3 border-emerald-500 hover:border-emerald-600 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl p-5 text-center gap-3 transition-all hover:scale-[1.02] shadow-sm focus:outline-none focus:ring-4 focus:ring-emerald-350"
            style={{ minHeight: '130px' }}
          >
            <PlusCircle className="w-10 h-10 text-emerald-100" />
            <span className="text-lg font-black tracking-tight leading-tight">Raise Complaint</span>
          </Link>

          {/* Action: Ward Updates */}
          <Link 
            href="/updates"
            className="flex flex-col items-center justify-center border-3 border-amber-500 hover:border-amber-600 bg-amber-500 hover:bg-amber-600 text-emerald-950 rounded-2xl p-5 text-center gap-3 transition-all hover:scale-[1.02] shadow-sm focus:outline-none focus:ring-4 focus:ring-amber-350"
            style={{ minHeight: '130px' }}
          >
            <Megaphone className="w-10 h-10 text-emerald-950" />
            <span className="text-lg font-black tracking-tight leading-tight">Ward Updates</span>
          </Link>

          {/* Action: My Complaints */}
          <Link 
            href="/complaints"
            className="flex flex-col items-center justify-center border-3 border-sky-500 hover:border-sky-600 bg-sky-600 hover:bg-sky-700 text-white rounded-2xl p-5 text-center gap-3 transition-all hover:scale-[1.02] shadow-sm focus:outline-none focus:ring-4 focus:ring-sky-350"
            style={{ minHeight: '130px' }}
          >
            <FolderOpen className="w-10 h-10 text-sky-100" />
            <span className="text-lg font-black tracking-tight leading-tight">My Complaints</span>
          </Link>

          {/* Action: My Profile */}
          <Link 
            href="/profile"
            className="flex flex-col items-center justify-center border-3 border-dark-teal hover:border-dark-teal/95 bg-dark-teal hover:bg-dark-teal/95 text-white rounded-2xl p-5 text-center gap-3 transition-all hover:scale-[1.02] shadow-sm focus:outline-none focus:ring-4 focus:ring-dark-teal/30"
            style={{ minHeight: '130px' }}
          >
            <User className="w-10 h-10 text-emerald-100" />
            <span className="text-lg font-black tracking-tight leading-tight">My Profile</span>
          </Link>
        </div>
      </section>

      {/* 4. Recent Complaints Section (FR-002) */}
      <section className="flex flex-col gap-3 mt-2 border-t-2 border-gray-200 pt-5">
        <h3 className="text-xl font-bold text-gray-900 tracking-wide uppercase">
          Recent Complaints
        </h3>

        {recentComplaints.length === 0 ? (
          /* Empty timeline fallback */
          <div className="bg-white border-2 border-dashed border-gray-300 rounded-2xl p-6 text-center text-gray-500 font-semibold flex flex-col items-center gap-2">
            <Inbox className="w-10 h-10 text-gray-400" />
            <p>You have not registered any grievances yet.</p>
            <Link 
              href="/raise-complaint"
              className="text-emerald-700 hover:underline font-bold"
            >
              Report a Pothole or Leak now
            </Link>
          </div>
        ) : (
          /* List timeline */
          <div className="flex flex-col gap-4">
            {recentComplaints.map((item) => (
              <div 
                key={item.id} 
                className="bg-white rounded-xl border-2 border-gray-250 p-4 shadow-sm flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3">
                  <span className="text-emerald-800 bg-emerald-50 p-2.5 rounded-xl border border-emerald-100">
                    {renderCategoryIcon(item.category, "w-6 h-6")}
                  </span>
                  <div className="flex flex-col text-left">
                    <span className="text-lg font-black text-gray-950 leading-tight">
                      {item.title}
                    </span>
                    <span className="text-xs text-gray-400 font-bold uppercase mt-1">
                      {item.id} • {new Date(item.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className={`text-sm font-extrabold px-3 py-1 rounded-full border ${getStatusBadge(item.status)}`}>
                    {item.status}
                  </span>
                  <Link
                    href="/complaints"
                    className="text-gray-400 hover:text-gray-700 p-2 rounded-lg flex items-center justify-center transition-colors"
                    title="View details"
                  >
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                </div>
              </div>
            ))}

            <Link
              href="/complaints"
              className="text-center font-bold text-dark-teal hover:underline text-base self-center py-2"
            >
              Show all complaints history ( {complaints.length} total )
            </Link>
          </div>
        )}
      </section>

    </div>
  );
}
