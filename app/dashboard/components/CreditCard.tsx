'use client';

import { useState } from 'react';

interface CreditCardProps {
  accountId: string;
  name: string;
}

export default function CreditCard({ accountId, name }: CreditCardProps) {
  const [cardFlipped, setCardFlipped] = useState(false);

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
        onClick={(e) => {
          e.stopPropagation();
          setCardFlipped(!cardFlipped);
        }}
      >
        <div className="credit-card-3d" style={{
          transform: cardFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)'
        }}>
          {/* Front */}
          <div className="card-face">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
              <div>
                <img src="/assets/BofA_rgb.png" alt="Swift Financial" style={{ height: '20px', display: 'block' }} />
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
                  <img src="/assets/BofA_rgb.png" alt="Swift Financial" style={{ height: '10px', display: 'block' }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
