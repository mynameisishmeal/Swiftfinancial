'use client';

import { useState } from 'react';

interface CreditCardProps {
  accountId: string;
  name: string;
  transactionPin?: string;
  onPinVerified?: () => void;
}

export default function CreditCard({ accountId, name, transactionPin, onPinVerified }: CreditCardProps) {
  const [cardFlipped, setCardFlipped] = useState(false);
  const [showPinModal, setShowPinModal] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState('');

  const handleCardClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!cardFlipped && transactionPin) {
      setShowPinModal(true);
    } else {
      setCardFlipped(!cardFlipped);
    }
  };

  const verifyPin = () => {
    if (pinInput === transactionPin) {
      setShowPinModal(false);
      setPinInput('');
      setPinError('');
      setCardFlipped(true);
      if (onPinVerified) onPinVerified();
    } else {
      setPinError('Incorrect PIN');
    }
  };

  return (
    <>
      <style jsx>{`
        .credit-card-container {
          perspective: 1000px;
          cursor: pointer;
          margin-bottom: 16px;
        }

        .credit-card-3d {
          position: relative;
          width: 100%;
          height: 200px;
          transition: transform 0.6s;
          transform-style: preserve-3d;
        }

        .card-face {
          position: absolute;
          width: 100%;
          height: 200px;
          backface-visibility: hidden;
          background: #000000;
          border-radius: 12px;
          padding: 20px;
          box-shadow: 0 10px 15px -3px rgba(0,0,0,0.3);
          color: white;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }

        .card-face.back {
          transform: rotateY(180deg);
        }
      `}</style>

      <div 
        className="credit-card-container"
        onClick={handleCardClick}
      >
        <div className="credit-card-3d" style={{
          transform: cardFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)'
        }}>
          {/* Front */}
          <div className="card-face">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
              <div>
                <img src="/assets/cardlogo.png" alt="Swift Financial" style={{ height: '20px', display: 'block' }} />
              </div>
              <div style={{ fontSize: '28px', fontWeight: '700', fontStyle: 'italic', color: 'white', textShadow: '2px 2px 4px rgba(0,0,0,0.3)' }}>VISA</div>
            </div>
            <div>
              <img src="/assets/creditcardchip.jpg" alt="chip" style={{ width: '40px', height: '32px', borderRadius: '4px', marginBottom: '12px', objectFit: 'cover' }} />
              <div style={{ fontSize: '18px', letterSpacing: '3px', marginBottom: '16px', fontFamily: 'Courier New, monospace', fontWeight: '500' }}>
                4532  {(accountId.slice(-4) || '0000').padStart(4, '0')}  {(accountId.slice(-8, -4) || '0000').padStart(4, '0')}  {(accountId.slice(-12, -8) || '0000').padStart(4, '0')}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end' }}>
                <div>
                  <div style={{ fontSize: '8px', opacity: 0.9, marginBottom: '2px', letterSpacing: '1px' }}>CARD HOLDER</div>
                  <div style={{ fontSize: '12px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '1px' }}>{name}</div>
                </div>
                <div>
                  <div style={{ fontSize: '8px', opacity: 0.9, marginBottom: '2px', letterSpacing: '1px' }}>VALID THRU</div>
                  <div style={{ fontSize: '12px', fontWeight: '600' }}>12/28</div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Back */}
          <div className="card-face back">
            <div style={{ width: '100%', height: '40px', background: '#000', marginTop: '20px' }}></div>
            <div style={{ padding: '12px 0' }}>
              <div style={{ background: '#e5e7eb', height: '35px', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', paddingRight: '12px', marginBottom: '12px' }}>
                <div style={{ background: 'white', padding: '4px 10px', borderRadius: '4px', fontSize: '14px', fontWeight: '700', color: '#1f2937', letterSpacing: '2px', fontStyle: 'italic' }}>***</div>
              </div>
              <div style={{ fontSize: '8px', color: 'white', opacity: 0.9, marginBottom: '8px', lineHeight: '1.3' }}>
                This card is property of Swift Financial. If found, please return to any branch or call 1-800-432-1000.
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ fontSize: '8px', color: 'white', opacity: 0.8 }}>Customer Service: 1-800-432-1000</div>
                <div style={{ background: 'white', padding: '3px 6px', borderRadius: '3px' }}>
                  <img src="/assets/cardlogo.png" alt="Swift Financial" style={{ height: '10px', display: 'block' }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showPinModal && (
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
              setShowPinModal(false);
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
              <div style={{ fontSize: '20px', fontWeight: '700', color: '#111827', marginBottom: '8px' }}>Enter Transaction PIN</div>
              <div style={{ fontSize: '14px', color: '#6b7280', marginBottom: '24px' }}>Enter your 4-digit PIN to view CVV</div>
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
                    setShowPinModal(false);
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
      )}
    </>
  );
}
