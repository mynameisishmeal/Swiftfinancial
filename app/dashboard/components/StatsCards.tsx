'use client';

interface StatsCardsProps {
  name: string;
  email: string;
  taxCleared: boolean;
  accountId: string;
  iban: string;
}

export default function StatsCards({ name, email, taxCleared, accountId, iban }: StatsCardsProps) {
  return (
    <>
      <style jsx>{`
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 16px;
          margin-bottom: 24px;
        }

        .stat-card {
          background: white;
          border-radius: 12px;
          padding: 16px;
          border: 1px solid #f3f4f6;
        }

        .stat-label {
          font-size: 12px;
          color: #6b7280;
          margin-bottom: 8px;
          font-weight: 600;
        }

        .stat-value {
          font-size: 20px;
          font-weight: 700;
          color: #111827;
        }
      `}</style>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-label">REWARDS POINTS</div>
          <div className="stat-value" style={{ color: '#f59e0b' }}>15,000</div>
          <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>≈ $150.00 value</div>
        </div>

        <div className="stat-card">
          <div className="stat-label">ACCOUNT HOLDER</div>
          <div className="stat-value" style={{ fontSize: '16px' }}>{name}</div>
          <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>{email}</div>
        </div>

        <div className="stat-card">
          <div className="stat-label">TAX STATUS</div>
          <div className="stat-value" style={{ color: taxCleared ? '#10b981' : '#ef4444', fontSize: '16px' }}>
            {taxCleared ? '✓ Cleared' : '⚠ Pending'}
          </div>
          <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>{taxCleared ? 'All set' : 'Action required'}</div>
        </div>

        <div className="stat-card">
          <div className="stat-label">ACCOUNT INFO</div>
          <div style={{ fontSize: '14px', fontWeight: '600', color: '#111827', marginBottom: '4px' }}>...{accountId.slice(-4)}</div>
          <div style={{ fontSize: '11px', color: '#6b7280' }}>{iban || 'IBAN: Loading...'}</div>
        </div>
      </div>
    </>
  );
}
