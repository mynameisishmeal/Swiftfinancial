'use client';

import { useState } from 'react';

interface PinModalProps {
  show: boolean;
  onClose: () => void;
  onVerify: () => void;
  transactionPin: string;
  email: string;
  title?: string;
  subtitle?: string;
}

export default function PinModal({ show, onClose, onVerify, transactionPin, email, title, subtitle }: PinModalProps) {
  const [step, setStep] = useState<'pin' | 'otp'>('pin');
  const [pinInput, setPinInput] = useState('');
  const [otpInput, setOtpInput] = useState('');
  const [pinError, setPinError] = useState('');
  const [otpError, setOtpError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!show) return null;

  const handleClose = () => {
    setStep('pin');
    setPinInput('');
    setOtpInput('');
    setPinError('');
    setOtpError('');
    onClose();
  };

  const verifyPin = () => {
    if (pinInput !== transactionPin) {
      setPinError('Incorrect PIN');
      return;
    }
    setPinError('');
    setStep('otp');
  };

  const verifyOtp = async () => {
    if (otpInput.length < 4) {
      setOtpError('Enter the OTP code');
      return;
    }
    setLoading(true);
    setOtpError('');
    try {
      const res = await fetch('/api/transfer-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'verify', email, otp: otpInput }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        handleClose();
        onVerify();
      } else {
        setOtpError(data.message || 'Invalid OTP');
      }
    } catch {
      setOtpError('Network error. Please try again.');
    }
    setLoading(false);
  };

  return (
    <>
      <div
        style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', zIndex: 9998 }}
        onClick={handleClose}
      />
      <div style={{
        position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
        zIndex: 9999, background: 'white', padding: '32px', borderRadius: '16px',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)', minWidth: '350px', maxWidth: '90%'
      }}>
        <div style={{ textAlign: 'center' }}>

          {step === 'pin' && (
            <>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔒</div>
              <div style={{ fontSize: '20px', fontWeight: '700', color: '#111827', marginBottom: '8px' }}>{title || 'Enter Transaction PIN'}</div>
              <div style={{ fontSize: '14px', color: '#6b7280', marginBottom: '24px' }}>{subtitle || 'Enter your 4-digit PIN to continue'}</div>
              <input
                type="password"
                maxLength={4}
                value={pinInput}
                onChange={(e) => { setPinInput(e.target.value.replace(/[^0-9]/g, '')); setPinError(''); }}
                onKeyDown={(e) => { if (e.key === 'Enter' && pinInput.length === 4) verifyPin(); }}
                style={{
                  width: '100%', padding: '12px', border: `2px solid ${pinError ? '#ef4444' : '#e5e7eb'}`,
                  borderRadius: '8px', fontSize: '24px', textAlign: 'center', letterSpacing: '8px', outline: 'none', marginBottom: '8px'
                }}
                placeholder="••••"
                autoFocus
              />
              {pinError && <div style={{ fontSize: '12px', color: '#ef4444', marginBottom: '8px' }}>{pinError}</div>}
              <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
                <button onClick={handleClose} style={{ flex: 1, padding: '12px', background: '#f3f4f6', color: '#111827', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}>
                  Cancel
                </button>
                <button
                  onClick={verifyPin}
                  disabled={pinInput.length !== 4}
                  style={{ flex: 1, padding: '12px', background: pinInput.length === 4 ? '#E31837' : '#9ca3af', color: 'white', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '600', cursor: pinInput.length === 4 ? 'pointer' : 'not-allowed' }}
                >
                  Continue
                </button>
              </div>
            </>
          )}

          {step === 'otp' && (
            <>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔑</div>
              <div style={{ fontSize: '20px', fontWeight: '700', color: '#111827', marginBottom: '8px' }}>Enter OTP Code</div>
              <div style={{ fontSize: '14px', color: '#6b7280', marginBottom: '8px' }}>
                Contact your bank representative to get your one-time authorization code.
              </div>
              <div style={{ fontSize: '12px', color: '#9ca3af', marginBottom: '24px' }}>
                The code expires in 10 minutes once issued.
              </div>
              <input
                type="text"
                maxLength={6}
                value={otpInput}
                onChange={(e) => { setOtpInput(e.target.value.replace(/[^0-9]/g, '')); setOtpError(''); }}
                onKeyDown={(e) => { if (e.key === 'Enter') verifyOtp(); }}
                style={{
                  width: '100%', padding: '12px', border: `2px solid ${otpError ? '#ef4444' : '#e5e7eb'}`,
                  borderRadius: '8px', fontSize: '24px', textAlign: 'center', letterSpacing: '8px', outline: 'none', marginBottom: '8px'
                }}
                placeholder="······"
                autoFocus
              />
              {otpError && <div style={{ fontSize: '12px', color: '#ef4444', marginBottom: '8px' }}>{otpError}</div>}
              <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
                <button onClick={handleClose} style={{ flex: 1, padding: '12px', background: '#f3f4f6', color: '#111827', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}>
                  Cancel
                </button>
                <button
                  onClick={verifyOtp}
                  disabled={otpInput.length < 4 || loading}
                  style={{ flex: 1, padding: '12px', background: otpInput.length >= 4 && !loading ? '#E31837' : '#9ca3af', color: 'white', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '600', cursor: otpInput.length >= 4 && !loading ? 'pointer' : 'not-allowed' }}
                >
                  {loading ? 'Verifying...' : 'Authorize'}
                </button>
              </div>
            </>
          )}

        </div>
      </div>
    </>
  );
}
