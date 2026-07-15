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
      
      {/* 1. Welcome Card (FR-002) */}
      <section className="bg-white border-2 border-dark-teal rounded-lg p-6 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4 text-left">
          <div className="flex flex-col">
            <h2 className="text-2xl sm:text-3xl font-black text-ink-black">
              Welcome, {user?.name || 'Resident'}!
            </h2>
            <div className="text-gray-650 text-base font-semibold mt-1 flex flex-wrap gap-x-3 gap-y-1">
              <span><strong>Ward:</strong> {user?.ward}</span>
              <span className="hidden sm:inline text-gray-300">|</span>
              <span><strong>House:</strong> {user?.houseNo}</span>
            </div>
          </div>
        </div>

        {/* Dynamic Help Speaker button */}
        <button
          type="button"
          onClick={toggleHelpInstructions}
          className={`py-3 px-5 rounded-lg font-bold transition-all shadow flex items-center justify-center gap-2.5 text-base active:scale-[0.98] ${
            isHelpSpeaking 
              ? 'bg-air-force hover:bg-air-force/90 text-white border border-air-force' 
              : 'bg-dark-teal hover:bg-dark-teal/90 text-white'
          }`}
          style={{ minHeight: '52px' }}
        >
          {isHelpSpeaking ? 'Stop Voice Guide' : 'Play Audio Guide'}
        </button>
      </section>

      {/* 2. Complaint Statistics (FR-002) */}
      <section className="grid grid-cols-3 gap-4 w-full">
        {/* Active Stats Card */}
        <div className="bg-ash-grey/10 border-2 border-ash-grey rounded-lg p-4 sm:p-5 flex flex-col items-center justify-center text-center shadow-sm">
          <span className="text-4xl sm:text-5xl font-black text-ink-black leading-none">
            {stats.active}
          </span>
          <span className="text-gray-650 text-base font-extrabold mt-2 uppercase tracking-wide">
            Active
          </span>
        </div>

        {/* Resolved Stats Card */}
        <div className="bg-air-force/10 border-2 border-air-force rounded-lg p-4 sm:p-5 flex flex-col items-center justify-center text-center shadow-sm">
          <span className="text-4xl sm:text-5xl font-black text-dark-teal leading-none">
            {stats.resolved}
          </span>
          <span className="text-gray-650 text-base font-extrabold mt-2 uppercase tracking-wide">
            Resolved
          </span>
        </div>

        {/* Total Stats Card */}
        <div className="bg-dark-teal/10 border-2 border-dark-teal rounded-lg p-4 sm:p-5 flex flex-col items-center justify-center text-center shadow-sm">
          <span className="text-4xl sm:text-5xl font-black text-ink-black leading-none">
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
            className="flex flex-col items-center justify-center border-2 border-dark-teal hover:border-dark-teal/90 bg-dark-teal text-white rounded-lg p-5 text-center gap-2 transition-all hover:scale-[1.02] shadow-sm focus:outline-none focus:ring-4 focus:ring-dark-teal/30"
            style={{ minHeight: '130px' }}
          >
            <span className="text-lg font-black tracking-tight leading-tight">Raise Complaint</span>
          </Link>

          {/* Action: Ward Updates */}
          <Link 
            href="/updates"
            className="flex flex-col items-center justify-center border-2 border-air-force hover:border-air-force/90 bg-air-force text-white rounded-lg p-5 text-center gap-2 transition-all hover:scale-[1.02] shadow-sm focus:outline-none focus:ring-4 focus:ring-air-force/30"
            style={{ minHeight: '130px' }}
          >
            <span className="text-lg font-black tracking-tight leading-tight">Ward Updates</span>
          </Link>

          {/* Action: My Complaints */}
          <Link 
            href="/complaints"
            className="flex flex-col items-center justify-center border-2 border-ash-grey hover:border-ash-grey/90 bg-ash-grey text-ink-black rounded-lg p-5 text-center gap-2 transition-all hover:scale-[1.02] shadow-sm focus:outline-none focus:ring-4 focus:ring-ash-grey/30"
            style={{ minHeight: '130px' }}
          >
            <span className="text-lg font-black tracking-tight leading-tight">My Complaints</span>
          </Link>

          {/* Action: My Profile */}
          <Link 
            href="/profile"
            className="flex flex-col items-center justify-center border-2 border-ink-black hover:border-ink-black/90 bg-ink-black text-beige rounded-lg p-5 text-center gap-2 transition-all hover:scale-[1.02] shadow-sm focus:outline-none focus:ring-4 focus:ring-ink-black/30"
            style={{ minHeight: '130px' }}
          >
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
          <div className="bg-white border-2 border-dashed border-gray-300 rounded-lg p-6 text-center text-gray-500 font-semibold flex flex-col items-center gap-2">
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
                className="bg-white rounded-lg border border-gray-300 p-4 shadow-sm flex items-center justify-between gap-4"
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
                  <span className={`text-sm font-extrabold px-3 py-1 rounded-md border ${getStatusBadge(item.status)}`}>
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
