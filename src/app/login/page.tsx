'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/components/AuthContext';
import { Leaf, AlertTriangle, ArrowRight, RotateCcw, Phone } from 'lucide-react';

export default function LoginPage() {
  const { login } = useAuth();

  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [countdown, setCountdown] = useState(30);

  const countdownIntervalRef = useRef<NodeJS.Timeout | null>(null);

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

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (phone.length !== 10) {
      setError('Please enter a valid 10-digit mobile number.');
      return;
    }
    setIsSubmitting(true);
    await new Promise(r => setTimeout(r, 800));
    setIsSubmitting(false);
    setStep('otp');
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (otp.length !== 4) {
      setError('Please enter the 4-digit code.');
      return;
    }
    setIsSubmitting(true);
    await new Promise(r => setTimeout(r, 800));
    try {
      await login(phone);
    } catch {
      setError('Verification failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendOTP = async () => {
    setError(null);
    setOtp('');
    setCountdown(30);
    await new Promise(r => setTimeout(r, 500));
    setStep('otp');
  };

  const formatPhoneNumber = (val: string) => {
    const cleaned = val.replace(/\D/g, '').slice(0, 10);
    if (cleaned.length > 6) return `${cleaned.slice(0, 5)} ${cleaned.slice(5)}`;
    if (cleaned.length > 3) return `${cleaned.slice(0, 3)} ${cleaned.slice(3)}`;
    return cleaned;
  };

  const onPhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhone(e.target.value.replace(/\D/g, ''));
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4 py-12"
      style={{ background: '#F7F9F7' }}
    >
      {/* Card */}
      <div
        className="w-full max-w-sm flex flex-col gap-6 animate-fade-in"
        style={{
          background: '#FFFFFF',
          borderRadius: '24px',
          padding: '32px 28px',
          boxShadow: '0 4px 24px rgba(0,0,0,0.08), 0 1px 4px rgba(0,0,0,0.04)',
        }}
      >
        {/* Brand */}
        <div className="flex flex-col items-center gap-3 text-center">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center"
            style={{ background: '#E8F5E9' }}
          >
            <Leaf className="w-8 h-8" style={{ color: '#2E7D32' }} strokeWidth={2} />
          </div>
          <div>
            <h1 className="text-2xl font-bold" style={{ color: '#1F2937', fontSize: '22px' }}>WardConnect</h1>
            <p className="text-sm font-medium mt-0.5" style={{ color: '#6B7280' }}>
              Kowdiar Ward Citizens' Portal
            </p>
          </div>
        </div>

        {/* Step indicator */}
        <div className="flex items-center gap-2">
          {(['phone', 'otp'] as const).map((s, i) => (
            <React.Fragment key={s}>
              <div
                className="flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold transition-all"
                style={{
                  background: step === s || (i === 0 && step === 'otp') ? '#2E7D32' : '#E5E7EB',
                  color: step === s || (i === 0 && step === 'otp') ? '#fff' : '#9CA3AF',
                }}
              >
                {i === 0 && step === 'otp' ? '✓' : i + 1}
              </div>
              {i === 0 && (
                <div
                  className="flex-1 h-0.5 rounded"
                  style={{ background: step === 'otp' ? '#2E7D32' : '#E5E7EB' }}
                />
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Error */}
        {error && (
          <div
            className="flex items-center gap-2.5 p-3 rounded-xl text-sm font-semibold"
            style={{ background: '#FFEBEE', color: '#D32F2F' }}
            role="alert"
          >
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {step === 'phone' ? (
          <form onSubmit={handleSendOTP} className="flex flex-col gap-5">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="phone" className="text-sm font-semibold" style={{ color: '#1F2937' }}>
                Mobile Number
              </label>
              <p className="text-xs" style={{ color: '#6B7280' }}>
                We'll send a 4-digit code to verify your identity.
              </p>
              <div className="relative mt-1">
                <span
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold flex items-center gap-1.5"
                  style={{ color: '#9CA3AF' }}
                >
                  <Phone className="w-4 h-4" strokeWidth={1.75} />
                  +91
                </span>
                <input
                  id="phone"
                  type="tel"
                  required
                  value={phone ? formatPhoneNumber(phone) : ''}
                  onChange={onPhoneChange}
                  placeholder="98765 43210"
                  className="w-full pl-20 pr-4 py-3.5 text-base font-semibold rounded-2xl outline-none transition-all"
                  style={{
                    background: '#F2F4F3',
                    border: '2px solid #E5E7EB',
                    color: '#1F2937',
                    minHeight: '52px',
                  }}
                  onFocus={e => { e.target.style.borderColor = '#2E7D32'; e.target.style.boxShadow = '0 0 0 4px rgba(46,125,50,0.10)'; }}
                  onBlur={e => { e.target.style.borderColor = '#E5E7EB'; e.target.style.boxShadow = 'none'; }}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={phone.length !== 10 || isSubmitting}
              className="w-full flex items-center justify-center gap-2 font-semibold rounded-2xl transition-all"
              style={{
                minHeight: '52px',
                background: phone.length === 10 && !isSubmitting ? '#2E7D32' : '#E5E7EB',
                color: phone.length === 10 && !isSubmitting ? '#fff' : '#9CA3AF',
                fontSize: '16px',
                boxShadow: phone.length === 10 && !isSubmitting ? '0 2px 8px rgba(46,125,50,0.25)' : 'none',
              }}
            >
              {isSubmitting ? (
                <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>Send OTP <ArrowRight className="w-4 h-4" /></>
              )}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOTP} className="flex flex-col gap-5">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="otp" className="text-sm font-semibold" style={{ color: '#1F2937' }}>
                Verification Code
              </label>
              <p className="text-xs" style={{ color: '#6B7280' }}>
                Sent to <strong style={{ color: '#1F2937' }}>+91 {formatPhoneNumber(phone)}</strong>. 
                Enter any 4-digit code (e.g. 1234) for this PoC.
              </p>
              <input
                id="otp"
                type="tel"
                maxLength={4}
                required
                value={otp}
                onChange={e => setOtp(e.target.value.replace(/\D/g, '').slice(0, 4))}
                placeholder="• • • •"
                className="w-full text-center text-3xl font-bold tracking-widest rounded-2xl outline-none transition-all"
                style={{
                  background: '#F2F4F3',
                  border: '2px solid #E5E7EB',
                  color: '#1F2937',
                  minHeight: '64px',
                  letterSpacing: '0.3em',
                }}
                onFocus={e => { e.target.style.borderColor = '#2E7D32'; e.target.style.boxShadow = '0 0 0 4px rgba(46,125,50,0.10)'; }}
                onBlur={e => { e.target.style.borderColor = '#E5E7EB'; e.target.style.boxShadow = 'none'; }}
              />
            </div>

            <button
              type="submit"
              disabled={otp.length !== 4 || isSubmitting}
              className="w-full flex items-center justify-center gap-2 font-semibold rounded-2xl transition-all"
              style={{
                minHeight: '52px',
                background: otp.length === 4 && !isSubmitting ? '#2E7D32' : '#E5E7EB',
                color: otp.length === 4 && !isSubmitting ? '#fff' : '#9CA3AF',
                fontSize: '16px',
                boxShadow: otp.length === 4 && !isSubmitting ? '0 2px 8px rgba(46,125,50,0.25)' : 'none',
              }}
            >
              {isSubmitting ? (
                <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                'Verify & Sign In'
              )}
            </button>

            <div className="flex items-center justify-between text-sm">
              {countdown > 0 ? (
                <span style={{ color: '#9CA3AF' }}>
                  Resend in <strong style={{ color: '#1F2937' }}>{countdown}s</strong>
                </span>
              ) : (
                <button
                  type="button"
                  onClick={handleResendOTP}
                  className="flex items-center gap-1.5 font-semibold"
                  style={{ color: '#2E7D32' }}
                >
                  <RotateCcw className="w-3.5 h-3.5" /> Resend Code
                </button>
              )}
              <button
                type="button"
                onClick={() => { setStep('phone'); setOtp(''); setError(null); }}
                className="font-semibold"
                style={{ color: '#6B7280' }}
              >
                Change number
              </button>
            </div>
          </form>
        )}

        <p className="text-center text-xs" style={{ color: '#9CA3AF' }}>
          For official use only — Kowdiar Municipal Corporation
        </p>
      </div>
    </div>
  );
}
