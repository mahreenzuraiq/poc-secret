'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/components/AuthContext';
import { getComplaints, Complaint } from '@/utils/storage';

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
        `Welcome back to Kowdiar Ward Citizens' Portal, ${user?.name || 'citizen'}. ` +
        `This dashboard shows your active complaints. ` +
        `Use the navigation bar at the top to access all pages. ` +
        `To file a new issue, click the Raise Complaint quick action card. ` +
        `To view news updates and local sales, click the Ward Updates card. ` +
        `To inspect all of your reported issues and voice notes, click the My Complaints card. ` +
        `To contact your ward councillor or health inspectors, click the Contacts tab. ` +
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

  const getStatusBadge = (status: Complaint['status']) => {
    switch (status) {
      case 'Resolved':
        return 'bg-ash-grey/30 text-ink-black border border-ash-grey/60';
      case 'In Progress':
        return 'bg-air-force/20 text-dark-teal border border-air-force/40';
      default:
        return 'bg-dark-teal/10 text-dark-teal border border-dark-teal/30';
    }
  };

  return (
    <div className="flex flex-col gap-6 py-2">
      
      {/* 1. Welcome Card */}
      <section className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="text-left">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
            Welcome back, {user?.name || 'Resident'}
          </h2>
          <p className="text-slate-500 text-sm font-medium mt-1">
            {user?.ward} • House No: {user?.houseNo}
          </p>
        </div>

        {/* Dynamic Help Speaker button */}
        <button
          type="button"
          onClick={toggleHelpInstructions}
          className={`py-2.5 px-4 rounded-lg text-sm font-semibold transition-all shadow-xs flex items-center justify-center gap-2 active:scale-[0.98] ${
            isHelpSpeaking 
              ? 'bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300' 
              : 'bg-dark-teal hover:bg-dark-teal/95 text-white'
          }`}
          style={{ minHeight: '44px' }}
        >
          {isHelpSpeaking ? 'Stop Voice Guide' : 'Play Audio Guide'}
        </button>
      </section>

      {/* 2. Complaint Statistics */}
      <section className="grid grid-cols-3 gap-4 w-full">
        {/* Active Stats Card */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col items-center justify-center text-center shadow-xs">
          <span className="text-3xl font-bold text-dark-teal leading-none">
            {stats.active}
          </span>
          <span className="text-slate-500 text-xs font-bold uppercase tracking-wider mt-1.5">
            Active
          </span>
        </div>

        {/* Resolved Stats Card */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col items-center justify-center text-center shadow-xs">
          <span className="text-3xl font-bold text-slate-700 leading-none">
            {stats.resolved}
          </span>
          <span className="text-slate-500 text-xs font-bold uppercase tracking-wider mt-1.5">
            Resolved
          </span>
        </div>

        {/* Total Stats Card */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col items-center justify-center text-center shadow-xs">
          <span className="text-3xl font-bold text-slate-900 leading-none">
            {stats.total}
          </span>
          <span className="text-slate-500 text-xs font-bold uppercase tracking-wider mt-1.5">
            Total Issues
          </span>
        </div>
      </section>

      {/* 3. Portal Actions */}
      <section className="flex flex-col gap-3">
        <h3 className="text-sm font-bold text-slate-500 tracking-wider uppercase">
          Portal Actions
        </h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 w-full">
          {/* Action: Raise Complaint */}
          <Link 
            href="/raise-complaint"
            className="group flex flex-col justify-between bg-white border border-slate-200 hover:border-dark-teal rounded-xl p-5 transition-all shadow-xs hover:shadow-sm"
            style={{ minHeight: '140px' }}
          >
            <div className="flex flex-col gap-1 text-left">
              <span className="text-lg font-bold text-slate-900 group-hover:text-dark-teal">Report Issue</span>
              <p className="text-slate-550 text-xs font-semibold leading-normal">
                File a road, drainage, garbage, or streetlight grievance.
              </p>
            </div>
            <span className="text-xs text-dark-teal font-extrabold group-hover:translate-x-1 transition-transform inline-flex items-center gap-1 mt-2">
              Start Form →
            </span>
          </Link>

          {/* Action: Ward Updates */}
          <Link 
            href="/updates"
            className="group flex flex-col justify-between bg-white border border-slate-200 hover:border-dark-teal rounded-xl p-5 transition-all shadow-xs hover:shadow-sm"
            style={{ minHeight: '140px' }}
          >
            <div className="flex flex-col gap-1 text-left">
              <span className="text-lg font-bold text-slate-900 group-hover:text-dark-teal">Updates & Notices</span>
              <p className="text-slate-550 text-xs font-semibold leading-normal">
                View organic sales, medical camps, and maintenance news.
              </p>
            </div>
            <span className="text-xs text-dark-teal font-extrabold group-hover:translate-x-1 transition-transform inline-flex items-center gap-1 mt-2">
              Open Board →
            </span>
          </Link>

          {/* Action: My Complaints */}
          <Link 
            href="/complaints"
            className="group flex flex-col justify-between bg-white border border-slate-200 hover:border-dark-teal rounded-xl p-5 transition-all shadow-xs hover:shadow-sm"
            style={{ minHeight: '140px' }}
          >
            <div className="flex flex-col gap-1 text-left">
              <span className="text-lg font-bold text-slate-900 group-hover:text-dark-teal">My Grievances</span>
              <p className="text-slate-550 text-xs font-semibold leading-normal">
                Check progress status, tickets, and review recorded files.
              </p>
            </div>
            <span className="text-xs text-dark-teal font-extrabold group-hover:translate-x-1 transition-transform inline-flex items-center gap-1 mt-2">
              View History →
            </span>
          </Link>

          {/* Action: Ward Office Bearers */}
          <Link 
            href="/contact"
            className="group flex flex-col justify-between bg-white border border-slate-200 hover:border-dark-teal rounded-xl p-5 transition-all shadow-xs hover:shadow-sm"
            style={{ minHeight: '140px' }}
          >
            <div className="flex flex-col gap-1 text-left">
              <span className="text-lg font-bold text-slate-900 group-hover:text-dark-teal">Ward Directory</span>
              <p className="text-slate-550 text-xs font-semibold leading-normal">
                Contact details for Councillor and Health Inspectors.
              </p>
            </div>
            <span className="text-xs text-dark-teal font-extrabold group-hover:translate-x-1 transition-transform inline-flex items-center gap-1 mt-2">
              View Contacts →
            </span>
          </Link>
        </div>
      </section>

      {/* 4. Recent Complaints Section */}
      <section className="flex flex-col gap-3 mt-2 border-t border-slate-200 pt-5">
        <h3 className="text-sm font-bold text-slate-500 tracking-wider uppercase">
          Recent Complaints
        </h3>

        {recentComplaints.length === 0 ? (
          /* Empty timeline fallback */
          <div className="bg-white border border-dashed border-slate-350 rounded-xl p-6 text-center text-gray-500 font-semibold flex flex-col items-center gap-2">
            <p>You have not registered any grievances yet.</p>
            <Link 
              href="/raise-complaint"
              className="text-dark-teal hover:underline font-bold"
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
                className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3">
                  <div className="flex flex-col text-left">
                    <span className="text-lg font-black text-gray-955 leading-tight">
                      {item.title}
                    </span>
                    <span className="text-xs text-gray-400 font-bold uppercase mt-1">
                      {item.id} • {item.category} • {new Date(item.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className={`text-xs font-extrabold px-2.5 py-1 rounded-md border ${getStatusBadge(item.status)}`}>
                    {item.status}
                  </span>
                  <Link
                    href="/complaints"
                    className="text-dark-teal hover:underline text-sm font-extrabold p-2"
                    title="View details"
                  >
                    View Details
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
