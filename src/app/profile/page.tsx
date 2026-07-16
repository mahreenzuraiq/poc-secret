'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/components/AuthContext';
import { CheckCircle2, Save, LogOut, Phone, User, MapPin, Hash } from 'lucide-react';

const inputStyle = {
  width: '100%',
  padding: '10px 14px',
  background: '#F2F4F3',
  border: '2px solid #E5E7EB',
  borderRadius: '12px',
  fontSize: '14px',
  color: '#1F2937',
  outline: 'none',
  fontFamily: 'inherit',
  transition: 'border-color 150ms, box-shadow 150ms',
};

export default function ProfilePage() {
  const { user, updateProfile, logout } = useAuth();
  const [name, setName] = useState('');
  const [ward, setWard] = useState('');
  const [houseNo, setHouseNo] = useState('');
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    if (user) { setName(user.name); setWard(user.ward); setHouseNo(user.houseNo); }
  }, [user]);

  if (!user) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !ward.trim() || !houseNo.trim()) return;
    updateProfile({ name: name.trim(), ward: ward.trim(), houseNo: houseNo.trim() });
    setSuccessMsg('Profile saved successfully.');
    setTimeout(() => setSuccessMsg(null), 3000);
  };

  const handleLogout = () => {
    if (confirm('Log out of WardConnect?')) logout();
  };

  const focusStyle = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.style.borderColor = '#2E7D32';
    e.target.style.boxShadow = '0 0 0 3px rgba(46,125,50,0.10)';
  };
  const blurStyle = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.style.borderColor = '#E5E7EB';
    e.target.style.boxShadow = 'none';
  };

  const isValid = name.trim() && ward.trim() && houseNo.trim();

  return (
    <div className="flex flex-col gap-4">
      {/* Page title */}
      <h1 className="text-base font-bold" style={{ color: '#1F2937' }}>My Profile</h1>

      {/* Avatar card */}
      <div className="flex items-center gap-4 rounded-2xl p-4" style={{ background: '#E8F5E9' }}>
        <div className="w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold shrink-0" style={{ background: '#2E7D32', color: '#fff' }}>
          {user.name?.charAt(0)?.toUpperCase() || 'U'}
        </div>
        <div>
          <p className="text-sm font-semibold" style={{ color: '#1F2937' }}>{user.name}</p>
          <p className="text-xs mt-0.5" style={{ color: '#43A047' }}>Ward {user.ward} · House {user.houseNo}</p>
        </div>
      </div>

      {/* Success toast */}
      {successMsg && (
        <div className="flex items-center gap-2 p-3 rounded-xl text-sm font-medium animate-fade-in" style={{ background: '#E8F5E9', color: '#2E7D32' }}>
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          {successMsg}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSave} className="flex flex-col gap-4 rounded-2xl p-4" style={{ background: '#fff', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
        <p className="text-xs font-bold uppercase tracking-wider" style={{ color: '#9CA3AF' }}>Account Details</p>

        {/* Phone — read only */}
        <div className="flex flex-col gap-1.5 opacity-60">
          <label className="text-xs font-semibold flex items-center gap-1.5" style={{ color: '#6B7280' }}>
            <Phone className="w-3.5 h-3.5" /> Phone Number (cannot change)
          </label>
          <div className="px-3.5 py-2.5 rounded-xl text-sm font-medium" style={{ background: '#F2F4F3', color: '#6B7280' }}>
            +91 {user.phone}
          </div>
        </div>

        {/* Name */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="name" className="text-xs font-semibold flex items-center gap-1.5" style={{ color: '#1F2937' }}>
            <User className="w-3.5 h-3.5" /> Full Name <span style={{ color: '#D32F2F' }}>*</span>
          </label>
          <input id="name" type="text" required value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Your full name"
            style={inputStyle} onFocus={focusStyle} onBlur={blurStyle} />
        </div>

        {/* Ward */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="ward" className="text-xs font-semibold flex items-center gap-1.5" style={{ color: '#1F2937' }}>
            <MapPin className="w-3.5 h-3.5" /> Ward / Area <span style={{ color: '#D32F2F' }}>*</span>
          </label>
          <input id="ward" type="text" required value={ward}
            onChange={e => setWard(e.target.value)}
            placeholder="e.g. Kowdiar Ward 12"
            style={inputStyle} onFocus={focusStyle} onBlur={blurStyle} />
        </div>

        {/* House No */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="houseNo" className="text-xs font-semibold flex items-center gap-1.5" style={{ color: '#1F2937' }}>
            <Hash className="w-3.5 h-3.5" /> House Number <span style={{ color: '#D32F2F' }}>*</span>
          </label>
          <input id="houseNo" type="text" required value={houseNo}
            onChange={e => setHouseNo(e.target.value)}
            placeholder="e.g. GH-42"
            style={inputStyle} onFocus={focusStyle} onBlur={blurStyle} />
        </div>

        <button type="submit" disabled={!isValid}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl text-sm font-semibold transition-all mt-1"
          style={{
            background: isValid ? '#2E7D32' : '#E5E7EB',
            color: isValid ? '#fff' : '#9CA3AF',
            boxShadow: isValid ? '0 2px 8px rgba(46,125,50,0.25)' : 'none',
          }}>
          <Save className="w-4 h-4" /> Save Changes
        </button>
      </form>

      {/* Danger zone */}
      <div className="rounded-2xl p-4" style={{ background: '#fff', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
        <p className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: '#9CA3AF' }}>Account</p>
        <button type="button" onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl text-sm font-semibold transition-all"
          style={{ background: '#FFEBEE', color: '#D32F2F' }}>
          <LogOut className="w-4 h-4" /> Log Out
        </button>
      </div>
    </div>
  );
}
