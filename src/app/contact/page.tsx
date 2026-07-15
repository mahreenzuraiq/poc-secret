'use client';

import React from 'react';
import Link from 'next/link';

interface ContactItem {
  name: string;
  role: string;
  phone: string;
  email?: string;
  officeHours?: string;
  location?: string;
  description: string;
}

const OFFICE_BEARERS: ContactItem[] = [
  {
    name: 'Councillor Satheesh Kumar',
    role: 'Ward Councillor',
    phone: '+91 94470 12345',
    email: 'councillor.kowdiar@municipal.gov.in',
    location: 'Ward Councillor Office, Kowdiar Community Hall (Room A)',
    description: 'Elected representative. Handles local policy, citizen grievances, public works, and ward developmental projects.'
  },
  {
    name: 'Smt. Bindu R.',
    role: 'Health Inspector (HI)',
    phone: '+91 94470 67890',
    email: 'hi.kowdiar@municipal.gov.in',
    location: 'Kowdiar Primary Health Sub-Center',
    description: 'Responsible for public sanitation, mosquito prevention, local health camps, and cleanliness inspections.'
  },
  {
    name: 'Sri. Anil Kumar',
    role: 'Junior Health Inspector (JHI)',
    phone: '+91 94470 54321',
    description: 'Handles waste management, street sweeping schedules, garbage pile complaints, and drainage clogging issues.'
  },
  {
    name: 'Smt. Geetha S.',
    role: 'Ward Secretary',
    phone: '+91 94470 98765',
    location: 'Kowdiar Ward Office Annex',
    description: 'Handles official certifications, birth/death records, municipal taxes, and general administrative requests.'
  }
];

export default function ContactPage() {
  return (
    <div className="flex flex-col gap-6 py-2">
      
      {/* Top Header */}
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
          Ward Directory & Contacts
        </h2>
      </div>

      <p className="text-gray-550 text-base leading-relaxed font-semibold mt-[-8px]">
        Contact your Kowdiar Ward office bearers and inspectors directly for queries, certificate verifications, or emergency municipal services.
      </p>

      {/* Grid of Bearers */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-2">
        {OFFICE_BEARERS.map((bearer, idx) => (
          <div 
            key={idx}
            className="bg-white rounded-lg border-2 border-gray-200 p-6 shadow-sm flex flex-col justify-between gap-4"
          >
            <div className="flex flex-col gap-2">
              <span className="text-xs font-bold px-2 py-0.5 rounded bg-dark-teal/15 text-dark-teal self-start uppercase tracking-wider">
                {bearer.role}
              </span>
              <h3 className="text-2xl font-extrabold text-gray-900 leading-tight">
                {bearer.name}
              </h3>
              <p className="text-gray-650 text-base mt-1 leading-relaxed">
                {bearer.description}
              </p>
            </div>

            <div className="border-t border-gray-150 pt-4 flex flex-col gap-2 text-base font-semibold">
              <div className="flex items-center gap-2">
                <span className="text-gray-500">Phone:</span>
                <a 
                  href={`tel:${bearer.phone.replace(/\s+/g, '')}`}
                  className="text-dark-teal hover:underline font-extrabold"
                >
                  {bearer.phone}
                </a>
              </div>
              {bearer.email && (
                <div className="flex items-center gap-2">
                  <span className="text-gray-500">Email:</span>
                  <a 
                    href={`mailto:${bearer.email}`}
                    className="text-dark-teal hover:underline text-sm font-bold truncate max-w-[280px]"
                  >
                    {bearer.email}
                  </a>
                </div>
              )}
              {bearer.location && (
                <div className="flex flex-col gap-0.5 text-sm text-gray-500 mt-1 italic">
                  <span>Office Location:</span>
                  <span className="font-normal text-gray-650">{bearer.location}</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Emergency & Helpline Panel */}
      <div className="bg-ash-grey/15 border border-ash-grey/40 rounded-lg p-6 mt-4 flex flex-col gap-4">
        <h3 className="text-xl font-bold text-ink-black uppercase tracking-wider">
          Municipal Helplines
        </h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-base font-bold">
          <div className="bg-white rounded-lg p-4 border border-gray-250 flex flex-col gap-1.5 shadow-xs">
            <span className="text-gray-500 font-semibold text-sm">Kowdiar Ward Office Helpdesk</span>
            <a href="tel:04712345678" className="text-dark-teal hover:underline text-xl font-extrabold">
              0471-2345678
            </a>
            <span className="text-xs text-gray-400 font-semibold">Hours: 10:00 AM - 5:00 PM (Mon-Sat)</span>
          </div>

          <div className="bg-white rounded-lg p-4 border border-gray-250 flex flex-col gap-1.5 shadow-xs">
            <span className="text-gray-500 font-semibold text-sm">Municipal Corporation Toll-Free (24/7)</span>
            <a href="tel:155300" className="text-dark-teal hover:underline text-xl font-extrabold">
              155300
            </a>
            <span className="text-xs text-gray-400 font-semibold">Toll-free within Trivandrum district</span>
          </div>
        </div>
      </div>

    </div>
  );
}
