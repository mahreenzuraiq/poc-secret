'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/components/AuthContext';

export default function ProfilePage() {
  const { user, updateProfile, logout } = useAuth();

  // Profile fields state
  const [name, setName] = useState('');
  const [ward, setWard] = useState('');
  const [houseNo, setHouseNo] = useState('');

  // Notification status state
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Load user values on mount
  useEffect(() => {
    if (user) {
      setName(user.name);
      setWard(user.ward);
      setHouseNo(user.houseNo);
    }
  }, [user]);

  if (!user) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMsg(null);

    if (!name.trim() || !ward.trim() || !houseNo.trim()) {
      return;
    }

    updateProfile({
      name: name.trim(),
      ward: ward.trim(),
      houseNo: houseNo.trim()
    });

    setSuccessMsg('Your profile changes have been saved successfully!');
    
    // Hide notification after 3 seconds
    setTimeout(() => {
      setSuccessMsg(null);
    }, 3000);
  };

  const handleLogoutClick = () => {
    if (confirm("Are you sure you want to log out of Kowdiar Ward Portal?")) {
      logout();
    }
  };

  return (
    <div className="flex flex-col gap-6 py-2 max-w-xl mx-auto w-full">
      
      {/* Header back action */}
      <div className="flex items-center gap-4">
        <Link 
          href="/" 
          className="p-3.5 bg-gray-150 hover:bg-gray-200 text-gray-700 font-extrabold rounded-lg border-2 border-gray-250 transition-colors flex items-center justify-center active:scale-[0.95]"
          style={{ minHeight: '56px', minWidth: '80px' }}
          title="Back to dashboard"
        >
          Back
        </Link>
        <h2 className="text-3xl font-black text-gray-900">
          My Profile Details
        </h2>
      </div>

      {successMsg && (
        <div className="p-4 bg-beige/40 border border-ash-grey text-dark-teal font-bold rounded-lg text-base shadow-sm">
          {successMsg}
        </div>
      )}

      {/* Profile Form */}
      <form onSubmit={handleSave} className="flex flex-col gap-6 bg-white rounded-lg p-6 border-2 border-gray-200 shadow-sm">
        
        {/* Phone number (Read-Only) */}
        <div className="flex flex-col gap-1.5 opacity-75">
          <label className="text-base font-bold text-gray-500">
            Registered Phone Number (Cannot change)
          </label>
          <div 
            className="w-full bg-gray-50 border-2 border-gray-200 rounded-lg p-4 text-lg font-black text-gray-650 flex items-center"
            style={{ minHeight: '56px' }}
          >
            +91 {user.phone}
          </div>
        </div>

        {/* Resident Name Input */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="name" className="text-lg font-extrabold text-gray-800">
            Resident Name / പേര് <span className="text-red-500">*</span>
          </label>
          <input
            id="name"
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your full name"
            className="w-full border-2 border-gray-300 rounded-lg p-4 text-lg font-bold focus:border-dark-teal focus:ring-4 focus:ring-dark-teal/15 outline-none transition-all text-ink-black"
            style={{ minHeight: '56px' }}
          />
        </div>

        {/* Ward Name Input */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="ward" className="text-lg font-extrabold text-gray-800">
            Ward Number & Area / വാർഡ് <span className="text-red-500">*</span>
          </label>
          <input
            id="ward"
            type="text"
            required
            value={ward}
            onChange={(e) => setWard(e.target.value)}
            placeholder="e.g. Kowdiar Ward 12"
            className="w-full border-2 border-gray-300 rounded-lg p-4 text-lg font-bold focus:border-dark-teal focus:ring-4 focus:ring-dark-teal/15 outline-none transition-all text-ink-black"
            style={{ minHeight: '56px' }}
          />
        </div>

        {/* House Number Input */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="houseNo" className="text-lg font-extrabold text-gray-800">
            House Number / വീട്ടു നമ്പർ <span className="text-red-500">*</span>
          </label>
          <input
            id="houseNo"
            type="text"
            required
            value={houseNo}
            onChange={(e) => setHouseNo(e.target.value)}
            placeholder="e.g. GH-42"
            className="w-full border-2 border-gray-300 rounded-lg p-4 text-lg font-bold focus:border-dark-teal focus:ring-4 focus:ring-dark-teal/15 outline-none transition-all text-ink-black"
            style={{ minHeight: '56px' }}
          />
        </div>

        {/* Save button */}
        <button
          type="submit"
          disabled={!name.trim() || !ward.trim() || !houseNo.trim()}
          className="w-full mt-2 py-4.5 px-6 bg-dark-teal hover:bg-dark-teal/95 text-white font-black rounded-lg shadow-md transition-all text-lg flex items-center justify-center min-h-[64px] active:scale-[0.98] disabled:bg-gray-200 disabled:text-gray-400 disabled:border-gray-300 disabled:cursor-not-allowed"
        >
          Save Profile Changes
        </button>

      </form>

      {/* Logout button */}
      <button
        type="button"
        onClick={handleLogoutClick}
        className="w-full py-4.5 px-6 bg-red-50 hover:bg-red-100 text-red-700 font-black rounded-lg shadow border-2 border-red-200 transition-all text-lg flex items-center justify-center min-h-[64px] active:scale-[0.98] mt-2"
      >
        Log Out of Portal
      </button>

    </div>
  );
}
