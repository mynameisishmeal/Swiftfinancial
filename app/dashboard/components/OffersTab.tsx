'use client';

import { useState, useEffect } from 'react';

export default function OffersTab({ showToast }: any) {
  const [email, setEmail] = useState('');
  const [offers, setOffers] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const userEmail = localStorage.getItem('userEmail');
    if (userEmail) {
      setEmail(userEmail);
      loadOffers(userEmail);
    }
  }, []);

  const loadOffers = async (userEmail: string) => {
    const res = await fetch(`/api/offers?email=${userEmail}`);
    const data = await res.json();
    if (data.offers) {
      setOffers(data.offers);
    }
  };

  const handleOfferAction = async (offerType: string, action: string) => {
    setLoading(true);
    const res = await fetch('/api/offers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, offerType, action }),
    });
    const data = await res.json();
    setLoading(false);
    
    if (data.success) {
      showToast(data.message, 'success');
      await loadOffers(email);
      if (offerType === 'bonusOffer') {
        setTimeout(() => window.location.reload(), 1500);
      }
    } else {
      showToast(data.error || 'Failed to process offer', 'error');
    }
  };

  if (!offers) return <div style={{ padding: '20px', textAlign: 'center' }}>Loading offers...</div>;

  return (
    <>
      <style jsx>{`
        .card { background: white; border-radius: 12px; margin-bottom: 16px; box-shadow: 0 4px 6px rgba(0,0,0,0.05); overflow: hidden; }
      `}</style>
      <div className="card">
        <div style={{ padding: '20px', borderBottom: '1px solid #f3f4f6' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#111827' }}>Special Offers</h2>
        </div>
        <div style={{ padding: '20px' }}>
          <div style={{ marginBottom: '24px', padding: '20px', background: '#fef2f2', borderRadius: '12px', border: '2px solid #e31837' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '12px' }}>
              <div>
                <div style={{ display: 'inline-block', background: '#e31837', color: 'white', padding: '4px 12px', borderRadius: '4px', fontSize: '11px', fontWeight: 700, marginBottom: '8px' }}>LIMITED TIME</div>
                <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#111827', marginBottom: '8px' }}>0% APR for 15 Months</h3>
                <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '8px' }}>On balance transfers and purchases with our Premium Rewards Card</p>
                <p style={{ fontSize: '12px', color: '#9ca3af', fontStyle: 'italic' }}>Original transfer fee: 0.5% (waived with this offer)</p>
              </div>
            </div>
            {offers.aprOffer.pending ? (
              <div style={{ padding: '12px', background: '#fef3c7', borderRadius: '8px', fontSize: '14px', fontWeight: 600, color: '#92400e' }}>⏳ Application pending admin approval</div>
            ) : offers.aprOffer.activated ? (
              <div style={{ padding: '12px', background: '#d1fae5', borderRadius: '8px', fontSize: '14px', fontWeight: 600, color: '#065f46' }}>✓ Offer activated! 0% APR active on your account</div>
            ) : (
              <button onClick={() => handleOfferAction('aprOffer', 'apply')} disabled={loading} style={{ padding: '12px 24px', background: '#e31837', color: 'white', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: 600, cursor: 'pointer' }}>Apply Now</button>
            )}
          </div>

          <div style={{ marginBottom: '24px', padding: '20px', background: '#eff6ff', borderRadius: '12px', border: '2px solid #0055C4' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '12px' }}>
              <div>
                <div style={{ display: 'inline-block', background: '#0055C4', color: 'white', padding: '4px 12px', borderRadius: '4px', fontSize: '11px', fontWeight: 700, marginBottom: '8px' }}>EXCLUSIVE</div>
                <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#111827', marginBottom: '8px' }}>$200 Bonus Cash Rewards</h3>
                <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '8px' }}>Spend $1,000 in the first 90 days and earn $200 bonus</p>
              </div>
            </div>
            {offers.bonusOffer.activated ? (
              <div style={{ padding: '12px', background: '#d1fae5', borderRadius: '8px', fontSize: '14px', fontWeight: 600, color: '#065f46' }}>✓ Bonus activated! $200 added to your account</div>
            ) : (
              <button onClick={() => handleOfferAction('bonusOffer', 'activate')} disabled={loading} style={{ padding: '12px 24px', background: '#0055C4', color: 'white', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: 600, cursor: 'pointer' }}>Activate Offer</button>
            )}
          </div>

          <div style={{ padding: '20px', background: '#f0fdf4', borderRadius: '12px', border: '2px solid #10b981' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '12px' }}>
              <div>
                <div style={{ display: 'inline-block', background: '#10b981', color: 'white', padding: '4px 12px', borderRadius: '4px', fontSize: '11px', fontWeight: 700, marginBottom: '8px' }}>SAVINGS</div>
                <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#111827', marginBottom: '8px' }}>4.5% APY Savings Account</h3>
                <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '8px' }}>Earn more on your savings with our high-yield account</p>
              </div>
            </div>
            {offers.savingsUpgrade.upgraded ? (
              <div style={{ padding: '12px', background: '#d1fae5', borderRadius: '8px', fontSize: '14px', fontWeight: 600, color: '#065f46' }}>✓ Account upgraded! Now earning 4.5% APY</div>
            ) : (
              <button onClick={() => handleOfferAction('savingsUpgrade', 'upgrade')} disabled={loading} style={{ padding: '12px 24px', background: '#10b981', color: 'white', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: 600, cursor: 'pointer' }}>Upgrade Account</button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
