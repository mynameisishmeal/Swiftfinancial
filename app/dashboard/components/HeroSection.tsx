'use client';

interface HeroSectionProps {
  totalBalance: number;
  income: number;
  expenses: number;
}

export default function HeroSection({ totalBalance, income, expenses }: HeroSectionProps) {
  return (
    <>
      <style jsx>{`
        .hero-section {
          background: linear-gradient(135deg, #012169 0%, #0055C4 100%);
          border-radius: 16px;
          padding: 32px 24px;
          margin-bottom: 24px;
          color: white;
          position: relative;
          overflow: hidden;
        }

        .hero-section::before {
          content: '';
          position: absolute;
          top: -50px;
          right: -50px;
          width: 200px;
          height: 200px;
          background: rgba(255,255,255,0.1);
          border-radius: 50%;
          filter: blur(60px);
        }

        .hero-content {
          position: relative;
          z-index: 1;
        }
      `}</style>

      <div className="hero-section">
        <div className="hero-content">
          <div style={{ fontSize: '14px', opacity: 0.9, marginBottom: '8px', fontWeight: '500' }}>Total Balance</div>
          <div style={{ fontSize: '42px', fontWeight: '300', marginBottom: '16px', letterSpacing: '-1px' }}>${totalBalance.toFixed(2)}</div>
          <div style={{ display: 'flex', gap: '24px', fontSize: '14px' }}>
            <div>
              <div style={{ opacity: 0.8 }}>Income</div>
              <div style={{ fontWeight: '600', marginTop: '4px' }}>+${income.toFixed(2)}</div>
            </div>
            <div>
              <div style={{ opacity: 0.8 }}>Expenses</div>
              <div style={{ fontWeight: '600', marginTop: '4px' }}>-${expenses.toFixed(2)}</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
