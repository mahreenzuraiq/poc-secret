'use client';

import React from 'react';
import { Phone, Mail, MapPin, ExternalLink } from 'lucide-react';

interface ContactItem {
  name: string;
  role: string;
  phone: string;
  email?: string;
  location?: string;
  description: string;
  roleColor: string;
  roleBg: string;
}

const OFFICE_BEARERS: ContactItem[] = [
  {
    name: 'Councillor Satheesh Kumar',
    role: 'Ward Councillor',
    phone: '+91 94470 12345',
    email: 'councillor.kowdiar@municipal.gov.in',
    location: 'Kowdiar Community Hall, Room A',
    description: 'Handles citizen grievances, public works, and ward development projects.',
    roleColor: '#2E7D32', roleBg: '#E8F5E9',
  },
  {
    name: 'Smt. Bindu R.',
    role: 'Health Inspector',
    phone: '+91 94470 67890',
    email: 'hi.kowdiar@municipal.gov.in',
    location: 'Kowdiar Primary Health Sub-Center',
    description: 'Public sanitation, mosquito prevention, health camps, cleanliness inspections.',
    roleColor: '#1976D2', roleBg: '#E3F2FD',
  },
  {
    name: 'Sri. Anil Kumar',
    role: 'Junior Health Inspector',
    phone: '+91 94470 54321',
    description: 'Waste management, street sweeping, garbage and drainage complaints.',
    roleColor: '#F57F17', roleBg: '#FFF8E1',
  },
  {
    name: 'Smt. Geetha S.',
    role: 'Ward Secretary',
    phone: '+91 94470 98765',
    location: 'Kowdiar Ward Office Annex',
    description: 'Certifications, birth/death records, municipal taxes, administrative requests.',
    roleColor: '#7B1FA2', roleBg: '#F3E5F5',
  },
];

const HELPLINES = [
  { label: 'Ward Office Helpdesk', number: '0471-2345678', sub: 'Mon–Sat, 10am–5pm', href: 'tel:04712345678' },
  { label: 'Corporation Toll-Free', number: '155300', sub: '24/7 within Trivandrum', href: 'tel:155300' },
];

export default function ContactPage() {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-base font-bold" style={{ color: '#1F2937' }}>Ward Directory</h1>
      <p className="text-xs" style={{ color: '#9CA3AF' }}>
        Contact your ward office bearers for queries, certificates, or emergency services.
      </p>

      {/* Contact cards */}
      <div className="flex flex-col gap-3">
        {OFFICE_BEARERS.map((bearer, idx) => (
          <div key={idx} className="rounded-2xl overflow-hidden" style={{ background: '#fff', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
            <div className="px-4 pt-4 pb-3">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ background: bearer.roleBg, color: bearer.roleColor }}>
                    {bearer.role}
                  </span>
                  <p className="text-sm font-semibold mt-2" style={{ color: '#1F2937' }}>{bearer.name}</p>
                  <p className="text-xs mt-1 leading-relaxed" style={{ color: '#6B7280' }}>{bearer.description}</p>
                </div>
              </div>
            </div>

            <div className="px-4 pb-4 flex flex-col gap-2" style={{ borderTop: '1px solid #F2F4F3', paddingTop: '12px' }}>
              <a href={`tel:${bearer.phone.replace(/\s/g, '')}`}
                className="flex items-center gap-2 text-sm font-semibold"
                style={{ color: '#2E7D32' }}>
                <Phone className="w-3.5 h-3.5" />
                {bearer.phone}
              </a>
              {bearer.email && (
                <a href={`mailto:${bearer.email}`}
                  className="flex items-center gap-2 text-xs truncate"
                  style={{ color: '#6B7280' }}>
                  <Mail className="w-3.5 h-3.5 shrink-0" />
                  {bearer.email}
                </a>
              )}
              {bearer.location && (
                <div className="flex items-start gap-2 text-xs" style={{ color: '#9CA3AF' }}>
                  <MapPin className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                  <span>{bearer.location}</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Helplines */}
      <div className="rounded-2xl p-4 flex flex-col gap-3" style={{ background: '#fff', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
        <p className="text-xs font-bold uppercase tracking-wider" style={{ color: '#9CA3AF' }}>Municipal Helplines</p>
        <div className="flex flex-col gap-2">
          {HELPLINES.map(h => (
            <div key={h.label} className="flex items-center justify-between gap-3 rounded-xl px-3 py-2.5" style={{ background: '#F2F4F3' }}>
              <div>
                <p className="text-xs font-semibold" style={{ color: '#1F2937' }}>{h.label}</p>
                <p className="text-xs mt-0.5" style={{ color: '#9CA3AF' }}>{h.sub}</p>
              </div>
              <a href={h.href} className="flex items-center gap-1.5 text-sm font-bold" style={{ color: '#2E7D32' }}>
                {h.number} <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
