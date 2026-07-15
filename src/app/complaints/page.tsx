'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { getComplaints, Complaint } from '@/utils/storage';

export default function ComplaintsHistoryPage() {
  const [complaints, setComplaints] = useState<Complaint[]>([]);

  useEffect(() => {
    setComplaints(getComplaints());
  }, []);

  const deleteComplaint = (id: string) => {
    if (confirm("Are you sure you want to delete this complaint record from your device?")) {
      const updated = complaints.filter(c => c.id !== id);
      localStorage.setItem('ward-portal-complaints', JSON.stringify(updated));
      setComplaints(updated);
    }
  };

  const clearAllHistory = () => {
    if (confirm("WARNING: This will delete ALL complaint records stored on this device. Do you want to proceed?")) {
      localStorage.removeItem('ward-portal-complaints');
      setComplaints([]);
    }
  };

  const formatDate = (isoString: string) => {
    const d = new Date(isoString);
    return d.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadgeClass = (status: Complaint['status']) => {
    switch (status) {
      case 'Resolved':
        return 'bg-emerald-100 text-emerald-900 border-emerald-300';
      case 'In Progress':
        return 'bg-blue-100 text-blue-900 border-blue-300';
      default:
        return 'bg-amber-100 text-amber-900 border-amber-300';
    }
  };

  return (
    <div className="flex flex-col gap-6 py-2">
      {/* Top Header Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link 
            href="/" 
            className="p-3.5 bg-gray-150 hover:bg-gray-200 text-gray-700 font-extrabold rounded-2xl border-2 border-gray-250 transition-colors flex items-center justify-center active:scale-[0.95]"
            style={{ minHeight: '56px', minWidth: '80px' }}
            title="Back to home page"
          >
            Back
          </Link>
          <h2 className="text-3xl font-black text-gray-900">
            My Complaints
          </h2>
        </div>

        {complaints.length > 0 && (
          <button
            type="button"
            onClick={clearAllHistory}
            className="py-3 px-5 bg-red-50 text-red-700 hover:bg-red-100 font-bold rounded-xl border-2 border-red-200 transition-colors text-base active:scale-[0.98] self-start sm:self-center"
            style={{ minHeight: '48px' }}
          >
            Clear All Records
          </button>
        )}
      </div>

      {complaints.length === 0 ? (
        /* Empty History State */
        <div className="bg-white rounded-3xl border-2 border-gray-200 p-8 text-center flex flex-col items-center gap-6 shadow-sm my-6 max-w-lg mx-auto">
          <div className="flex flex-col gap-2">
            <h3 className="text-2xl font-black text-gray-800">No Complaints Found</h3>
            <p className="text-gray-500 text-base leading-relaxed font-semibold">
              You haven't reported any issues from this device yet. If you see a problem in your ward, let us know!
            </p>
          </div>
          <Link
            href="/raise-complaint"
            className="w-full py-4 px-6 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-2xl shadow-md transition-colors text-lg flex items-center justify-center min-h-[64px] active:scale-[0.98]"
          >
            File a New Complaint Now
          </Link>
        </div>
      ) : (
        /* List State */
        <div className="flex flex-col gap-6">
          <p className="text-gray-550 text-base font-semibold">
            Showing <strong className="text-gray-900">{complaints.length}</strong> reported complaints registered on this device.
          </p>

          <div className="flex flex-col gap-6">
            {complaints.map((item) => (
              <div 
                key={item.id} 
                className="bg-white rounded-2xl border-3 border-gray-250 p-6 shadow-sm hover:shadow-md transition-all flex flex-col gap-4"
              >
                
                {/* ID, Category and Status Header */}
                <div className="flex flex-wrap items-center justify-between gap-3 border-b-2 border-gray-100 pb-4">
                  <div className="flex items-center gap-2">
                    <span className="text-xl font-black text-gray-900">
                      {item.category} Issue
                    </span>
                    <span className="text-gray-400 font-bold px-1.5">•</span>
                    <span className="text-gray-600 font-bold text-base bg-gray-100 px-2.5 py-0.5 rounded-lg">
                      {item.id}
                    </span>
                  </div>
                  <span className={`text-base font-extrabold px-3.5 py-1 rounded-full border ${getStatusBadgeClass(item.status)}`}>
                    {item.status}
                  </span>
                </div>

                {/* Complaint Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                  
                  {/* Photo Display if uploaded */}
                  {item.photo ? (
                    <div className="flex flex-col gap-2">
                      <span className="text-gray-700 font-bold text-base flex items-center gap-1.5">
                        Captured Photo:
                      </span>
                      <div className="relative w-full rounded-xl overflow-hidden border-2 border-gray-200 shadow-inner bg-gray-150 aspect-video">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img 
                          src={item.photo} 
                          alt="Submitted issue representation" 
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-2 p-5 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200 items-center justify-center text-center text-gray-500 font-semibold min-h-[140px]">
                      <span>No photo attached</span>
                    </div>
                  )}

                  {/* Audio & text notes column */}
                  <div className="flex flex-col gap-4 h-full justify-between">
                    
                    {/* Audio note play-back */}
                    {item.audio ? (
                      <div className="flex flex-col gap-2">
                        <span className="text-gray-700 font-bold text-base flex items-center gap-1.5">
                          Voice Description:
                        </span>
                        <div className="bg-emerald-50/50 p-3 rounded-xl border border-emerald-100 flex flex-col gap-2">
                          <audio 
                            src={item.audio} 
                            controls 
                            className="w-full"
                          />
                          <span className="text-xs text-emerald-800 font-bold text-right px-1">
                            Duration: {item.audioDuration} seconds
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 text-gray-500 font-semibold text-center">
                        No voice description recorded
                      </div>
                    )}

                    {/* Text notes */}
                    {item.description && (
                      <div className="flex flex-col gap-1.5">
                        <span className="text-gray-700 font-bold text-base">Written Details:</span>
                        <p className="bg-gray-50 p-4 rounded-xl border border-gray-100 text-gray-700 text-base leading-relaxed italic font-medium">
                          "{item.description}"
                        </p>
                      </div>
                    )}

                    {/* General details */}
                    <div className="text-gray-500 text-sm font-semibold flex flex-col gap-1 mt-2 border-t border-gray-100 pt-3">
                      <div>Location: {item.ward}</div>
                      <div>Submitted: {formatDate(item.createdAt)}</div>
                    </div>

                  </div>
                </div>

                {/* Individual Delete Action */}
                <div className="border-t border-gray-100 pt-4 flex justify-end">
                  <button
                    type="button"
                    onClick={() => deleteComplaint(item.id)}
                    className="py-2.5 px-4 bg-red-50 text-red-750 hover:bg-red-100 font-bold rounded-lg border border-red-200 text-base transition-colors flex items-center gap-1.5 active:scale-[0.98]"
                    style={{ minHeight: '44px' }}
                  >
                    Delete Record
                  </button>
                </div>

              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
