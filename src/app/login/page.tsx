'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/components/AuthContext';

export default function LoginPage() {
  const { login } = useAuth();
  
  // Step: 'phone' or 'otp'
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  
  // Input states
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  
  // Validation / UI states
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [countdown, setCountdown] = useState(30);

  const countdownIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Handle otp timer countdown
  useEffect(() => {
    if (step === 'otp') {
      setCountdown(30);
      countdownIntervalRef.current = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
    };
  }, [step]);

  const handleSendOTP = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validate phone number: 10 digits
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length !== 10) {
      setError('Please enter a valid 10-digit mobile number (e.g. 9876543210)');
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API delay
    setTimeout(() => {
      setIsSubmitting(false);
      setStep('otp');
    }, 1000);
  };

  const handleVerifyOTP = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validate OTP: 4 digits
    const cleanedOtp = otp.replace(/\D/g, '');
    if (cleanedOtp.length !== 4) {
      setError('Please enter the 4-digit verification code sent to your phone');
      return;
    }

    setIsSubmitting(true);

    // Simulate OTP verification
    setTimeout(() => {
      setIsSubmitting(false);
      login(phone); // Authenticates user context
    }, 1200);
  };

  const handleResendOTP = () => {
    if (countdown > 0) return;
    setError(null);
    setOtp('');
    setCountdown(30);
    
    // Simulate sending new OTP
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
    }, 600);

    // Restart countdown
    countdownIntervalRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const formatPhoneNumber = (val: string) => {
    const cleaned = val.replace(/\D/g, '').slice(0, 10);
    if (cleaned.length > 6) {
      return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
    } else if (cleaned.length > 3) {
      return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3)}`;
    }
    return cleaned;
  };

  const onPhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawVal = e.target.value;
    const cleaned = rawVal.replace(/\D/g, '');
    setPhone(cleaned);
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center py-12 px-4 sm:px-6">
      <div className="w-full max-w-md bg-white rounded-3xl border-3 border-dark-teal shadow-xl p-8 flex flex-col gap-6">
        
        {/* Portal Header */}
        <div className="flex flex-col items-center text-center gap-2">
          <h2 className="text-3xl font-black text-ink-black tracking-tight">WardConnect</h2>
          <p className="text-gray-500 text-base font-bold uppercase tracking-wider">
            Ward Citizens' Portal
          </p>
        </div>

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 text-red-800 rounded-2xl text-base font-semibold">
            {error}
          </div>
        )}

        {step === 'phone' ? (
          /* Phone Submission Form */
          <form onSubmit={handleSendOTP} className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <label htmlFor="phone" className="text-lg font-black text-gray-800">
                Enter Mobile Number / മൊബൈൽ നമ്പർ
              </label>
              <p className="text-sm text-gray-500 font-semibold leading-relaxed">
                We will send a 4-digit code to verify your identity.
              </p>
              
              <div className="relative mt-1">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg font-extrabold text-gray-400">
                  +91
                </span>
                <input
                  id="phone"
                  type="tel"
                  required
                  value={phone ? formatPhoneNumber(phone) : ''}
                  onChange={onPhoneChange}
                  placeholder="98765 43210"
                  className="w-full pl-16 pr-4 py-4 text-xl font-bold border-2 border-gray-300 rounded-2xl outline-none focus:border-dark-teal focus:ring-4 focus:ring-dark-teal/15 transition-all text-ink-black"
                  style={{ minHeight: '64px' }}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={phone.length !== 10 || isSubmitting}
              className={`w-full py-4.5 px-6 font-black rounded-2xl text-xl flex items-center justify-center gap-2 transition-all shadow-md ${
                phone.length === 10 && !isSubmitting
                  ? 'bg-dark-teal hover:bg-dark-teal/95 text-white active:scale-[0.98]'
                  : 'bg-gray-200 text-gray-400 border border-gray-300 cursor-not-allowed'
              }`}
              style={{ minHeight: '64px' }}
            >
              {isSubmitting ? (
                <>
                  <span className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin"></span>
                  <span>Sending code...</span>
                </>
              ) : (
                <span>Request OTP Code</span>
              )}
            </button>
          </form>
        ) : (
          /* OTP Verification Form */
          <form onSubmit={handleVerifyOTP} className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <label htmlFor="otp" className="text-lg font-black text-gray-800">
                Enter Verification Code / OTP
              </label>
              <p className="text-sm text-gray-500 font-semibold leading-relaxed">
                Code sent to <strong className="text-ink-black">+91 {formatPhoneNumber(phone)}</strong>. Enter any 4 digit code (e.g. 1234) for this PoC.
              </p>
              
              <input
                id="otp"
                type="tel"
                maxLength={4}
                required
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 4))}
                placeholder="• • • •"
                className="w-full py-4 text-center text-3xl font-black tracking-widest border-2 border-gray-300 rounded-2xl outline-none focus:border-dark-teal focus:ring-4 focus:ring-dark-teal/15 transition-all text-ink-black"
                style={{ minHeight: '64px' }}
              />
            </div>

            <div className="flex flex-col gap-3">
              <button
                type="submit"
                disabled={otp.length !== 4 || isSubmitting}
                className={`w-full py-4.5 px-6 font-black rounded-2xl text-xl flex items-center justify-center gap-2 transition-all shadow-md ${
                  otp.length === 4 && !isSubmitting
                    ? 'bg-dark-teal hover:bg-dark-teal/95 text-white active:scale-[0.98]'
                    : 'bg-gray-200 text-gray-400 border border-gray-300 cursor-not-allowed'
                }`}
                style={{ minHeight: '64px' }}
              >
                {isSubmitting ? (
                  <>
                    <span className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin"></span>
                    <span>Verifying...</span>
                  </>
                ) : (
                  <span>Verify & Enter Portal</span>
                )}
              </button>

              <div className="flex items-center justify-between text-base font-semibold px-1 mt-1">
                {countdown > 0 ? (
                  <span className="text-gray-500">
                    Resend code in <strong className="text-ink-black">{countdown}s</strong>
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={handleResendOTP}
                    className="text-dark-teal hover:underline font-bold"
                  >
                    Resend OTP Code
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => {
                    setStep('phone');
                    setOtp('');
                    setError(null);
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  Edit Number
                </button>
              </div>
            </div>
          </form>
        )}

      </div>
    </div>
  );
}
