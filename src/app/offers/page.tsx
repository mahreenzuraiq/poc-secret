'use client';

import React, { useState } from 'react';
import { Tag, Sparkles, Percent, Calendar, MapPin, QrCode, CheckCircle, Info, ChevronRight, X } from 'lucide-react';

interface Offer {
  id: string;
  title: string;
  description: string;
  discount: string;
  category: 'Welfare' | 'Co-op' | 'Health' | 'Utility';
  expiry: string;
  location: string;
  claimedCount: number;
  totalLimit?: number;
  terms: string;
}

const WARD_OFFERS: Offer[] = [
  {
    id: 'OFF-7391',
    title: 'Subsidized Home Farming Kit',
    description: 'Grow your own fresh vegetables. Includes organic seeds, potting soil, grow bags, and natural fertilizers.',
    discount: '50% OFF',
    category: 'Welfare',
    expiry: 'July 31, 2026',
    location: 'Kowdiar Ward Office Annex',
    claimedCount: 142,
    totalLimit: 200,
    terms: 'Valid only for registered residents of Kowdiar Ward. One kit per household. Bring utility bill for address proof.',
  },
  {
    id: 'OFF-4029',
    title: 'Free LED Bulb Exchange',
    description: 'Exchange up to 5 working traditional incandescent bulbs or CFLs for energy-saving, high-lumen LED bulbs.',
    discount: 'FREE EXCHANGE',
    category: 'Utility',
    expiry: 'August 15, 2026',
    location: 'KSEB Office, Kowdiar Junction',
    claimedCount: 389,
    totalLimit: 500,
    terms: 'Available on presenting latest electricity bill showing Kowdiar address.',
  },
  {
    id: 'OFF-1102',
    title: 'Milma Dairy Co-operative Rebate',
    description: 'Special neighborhood concession on Milma milk products (milk, ghee, butter, and curd) purchased from ward co-operative booth.',
    discount: '10% DISCOUNT',
    category: 'Co-op',
    expiry: 'September 30, 2026',
    location: 'Kowdiar Ward Co-op Dairy Booth',
    claimedCount: 654,
    terms: 'Applicable on daily purchases up to ₹200. Resident card scanning required.',
  },
  {
    id: 'OFF-8842',
    title: 'Geriatric Medicine Subsidy',
    description: 'Additional ward subsidy on chronic care medicines for elderly residents at Jan Aushadhi Kendras.',
    discount: '15% EXTRA OFF',
    category: 'Health',
    expiry: 'December 31, 2026',
    location: 'Jan Aushadhi Kendra, TTC Junction',
    claimedCount: 218,
    terms: 'Applicable to residents aged 60 and above. Doctor prescription and ward ID copy required.',
  },
  {
    id: 'OFF-5501',
    title: 'Biogas Plant Subsidy Scheme',
    description: 'Municipal corporation subsidy for installing small household biogas plants for waste-to-energy conversion.',
    discount: '₹8,000 SUBSIDY',
    category: 'Utility',
    expiry: 'October 15, 2026',
    location: 'Municipal Office, Ward Desk 4',
    claimedCount: 23,
    totalLimit: 50,
    terms: 'Requires verification of land suitability by Junior Health Inspector.',
  }
];

export default function OffersPage() {
  const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null);
  const [claimedId, setClaimedId] = useState<string | null>(null);

  const getCategoryStyles = (cat: Offer['category']) => {
    switch (cat) {
      case 'Welfare': return { bg: '#E8F5E9', color: '#2E7D32', border: '#C8E6C9' };
      case 'Utility': return { bg: '#E3F2FD', color: '#1976D2', border: '#BBDEFB' };
      case 'Co-op':    return { bg: '#FFF8E1', color: '#F57F17', border: '#FFE082' };
      case 'Health':   return { bg: '#FCE4EC', color: '#C2185B', border: '#F8BBD0' };
    }
  };

  const handleClaim = (offer: Offer) => {
    setClaimedId(offer.id);
    setSelectedOffer(offer);
  };

  return (
    <div className="flex flex-col gap-5">
      
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-bold" style={{ color: '#1F2937' }}>Resident Benefit Zone</h1>
          <Sparkles className="w-5 h-5 text-amber-500 fill-amber-500 animate-pulse" />
        </div>
        <p className="text-xs mt-1 text-gray-500">
          Exclusive discounts, government subsidies, and co-operative benefits for residents of Kowdiar Ward.
        </p>
      </div>

      {/* Offers List */}
      <div className="flex flex-col gap-4">
        {WARD_OFFERS.map((offer) => {
          const catStyle = getCategoryStyles(offer.category);
          const percentClaimed = offer.totalLimit 
            ? Math.round((offer.claimedCount / offer.totalLimit) * 100) 
            : null;

          return (
            <div 
              key={offer.id} 
              className="rounded-2xl overflow-hidden bg-white border border-gray-150 transition-all hover:shadow-md"
              style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}
            >
              <div className="p-5 flex flex-col gap-3">
                
                {/* Badge Row */}
                <div className="flex justify-between items-center gap-2">
                  <span 
                    className="text-xs font-bold px-2.5 py-1 rounded-full border" 
                    style={{ background: catStyle.bg, color: catStyle.color, borderColor: catStyle.border }}
                  >
                    {offer.category}
                  </span>
                  <span className="text-xs font-bold text-emerald-850 bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-100 flex items-center gap-1">
                    <Percent className="w-3.5 h-3.5" /> {offer.discount}
                  </span>
                </div>

                {/* Title */}
                <div>
                  <h3 className="text-lg font-bold text-gray-900 leading-tight">{offer.title}</h3>
                  <p className="text-sm mt-1 text-gray-600 leading-relaxed">{offer.description}</p>
                </div>

                {/* Progress bar if limited */}
                {percentClaimed !== null && offer.totalLimit && (
                  <div className="flex flex-col gap-1.5 mt-1">
                    <div className="flex justify-between text-xs font-semibold text-gray-500">
                      <span>Claimed: {offer.claimedCount} / {offer.totalLimit} units</span>
                      <span>{100 - percentClaimed}% remaining</span>
                    </div>
                    <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                      <div 
                        className="bg-emerald-600 h-full rounded-full transition-all" 
                        style={{ width: `${percentClaimed}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* Details Footer */}
                <div className="flex flex-col gap-2 pt-3 border-t border-gray-100 mt-1">
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <MapPin className="w-3.5 h-3.5 text-gray-400" />
                    <span>{offer.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <Calendar className="w-3.5 h-3.5 text-gray-400" />
                    <span>Valid until {offer.expiry}</span>
                  </div>
                </div>

                {/* Claim Button */}
                <button
                  type="button"
                  onClick={() => handleClaim(offer)}
                  className="w-full py-3.5 px-4 bg-emerald-800 hover:bg-emerald-850 text-white font-bold rounded-xl shadow-sm text-base flex items-center justify-center gap-2 transition-colors active:scale-[0.98] mt-2 cursor-pointer"
                >
                  <QrCode className="w-5 h-5" /> Get Resident QR Pass
                </button>

              </div>
            </div>
          );
        })}
      </div>

      {/* QR Code / Claim Overlay Modal */}
      {selectedOffer && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-sm overflow-hidden animate-check-pop shadow-2xl">
            
            {/* Header */}
            <div className="p-4 flex justify-between items-center border-b border-gray-100" style={{ background: '#F7F9F7' }}>
              <div className="flex items-center gap-2 text-emerald-800 font-bold">
                <Sparkles className="w-4 h-4 text-amber-500 fill-amber-500" />
                <span className="text-sm">Resident Benefit Pass</span>
              </div>
              <button 
                type="button" 
                onClick={() => setSelectedOffer(null)} 
                className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 flex flex-col items-center text-center gap-4">
              
              <div className="w-14 h-14 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-800">
                <CheckCircle className="w-8 h-8" />
              </div>

              <div>
                <h3 className="font-bold text-xl text-gray-900 leading-tight">Benefit Pass Activated</h3>
                <p className="text-xs text-gray-500 mt-0.5">Show this pass at the counter to claim discount</p>
              </div>

              {/* Offer Card details */}
              <div className="w-full bg-beige/25 p-4 rounded-2xl border border-beige/40 flex flex-col gap-1.5 text-left">
                <div className="text-xs font-bold uppercase tracking-wider text-emerald-800">{selectedOffer.discount}</div>
                <div className="font-bold text-base text-gray-950 leading-tight">{selectedOffer.title}</div>
                <div className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                  <MapPin className="w-3 h-3" /> {selectedOffer.location}
                </div>
              </div>

              {/* Mock QR Code */}
              <div className="p-4 bg-white border border-gray-200 rounded-2xl flex flex-col items-center gap-2 shadow-sm my-1">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src="https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=wardconnect-benefit-pass-12-house-gh-42" 
                  alt="Claim QR Code" 
                  className="w-40 h-40 object-contain"
                />
                <span className="text-[10px] font-mono text-gray-400 uppercase tracking-widest">{selectedOffer.id}-GH42</span>
              </div>

              {/* Terms Warning */}
              <div className="flex gap-2 text-left bg-gray-50 p-3 rounded-xl border border-gray-150 text-xs text-gray-600 leading-normal w-full">
                <Info className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                <span>{selectedOffer.terms}</span>
              </div>

              <button
                type="button"
                onClick={() => setSelectedOffer(null)}
                className="w-full py-3.5 bg-gray-200 hover:bg-gray-250 text-gray-800 font-bold rounded-xl text-base transition-colors"
              >
                Close Pass
              </button>

            </div>
          </div>
        </div>
      )}

    </div>
  );
}
