'use client';

import { useState } from 'react';

interface PinModalProps {
  show: boolean;
  onClose: () => void;
  onVerify: () => void;
  transactionPin: string;
  title?: string;
  subtitle?: string;
}

export default function PinModal({ show, onClose, onVerify, transactionPin, title, subtitle }: PinModalProps) {
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState('');

  if (!show) return null;

  const verifyPin = () => {
    if (pinInput === transactionPin) {
      setPinInput('');
      setPinError('');
      onVerify();
    } else {
      setPinError('Incorrect PIN');
    }
  };

  return (
    <>
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          zIndex: 9998
        }}
        onClick={() => {
          onClose();
          setPinInput('');
          setPinError('');
        }}
      />
      <div style={{ 
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 9999,
        background: 'white',
        padding: '32px',
        borderRadius: '16px',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
        minWidth: '350px',
        maxWidth: '90%'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔒</div>
          <div style={{ fontSize: '20px', fontWeight: '700', color: '#111827', marginBottom: '8px' }}>{title || 'Enter Transaction PIN'}</div>
          <div style={{ fontSize: '14px', color: '#6b7280', marginBottom: '24px' }}>{subtitle || 'Enter your 4-digit PIN to continue'}</div>
          <input
            type="password"
            maxLength={4}
            value={pinInput}
            onChange={(e) => {
              setPinInput(e.target.value.replace(/[^0-9]/g, ''));
              setPinError('');
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && pinInput.length === 4) verifyPin();
            }}
            style={{
              width: '100%',
              padding: '12px',
              border: `2px solid ${pinError ? '#ef4444' : '#e5e7eb'}`,
              borderRadius: '8px',
              fontSize: '24px',
              textAlign: 'center',
              letterSpacing: '8px',
              outline: 'none',
              marginBottom: '8px'
            }}
            placeholder="••••"
            autoFocus
          />
          {pinError && (
            <div style={{ fontSize: '12px', color: '#ef4444', marginBottom: '16px' }}>{pinError}</div>
          )}
          <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
            <button
              onClick={() => {
                onClose();
                setPinInput('');
                setPinError('');
              }}
              style={{
                flex: 1,
                padding: '12px',
                background: '#f3f4f6',
                color: '#111827',
                border: 'none',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              Cancel
            </button>
            <button
              onClick={verifyPin}
              disabled={pinInput.length !== 4}
              style={{
                flex: 1,
                padding: '12px',
                background: pinInput.length === 4 ? '#E31837' : '#9ca3af',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: pinInput.length === 4 ? 'pointer' : 'not-allowed'
              }}
            >
              Verify
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
