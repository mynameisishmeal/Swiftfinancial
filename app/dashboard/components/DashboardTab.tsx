import { DollarSign, PieChart } from 'lucide-react';

export default function DashboardTab({ balance, savingsBalance, creditBalance, accountId, name, email, taxCleared, iban, setActiveTab, setActiveNav, setPaymentType }: any) {
  return (
    <>
      <style jsx>{`
        .hero-section { background: linear-gradient(135deg, #012169 0%, #0055C4 100%); border-radius: 16px; padding: 32px 24px; margin-bottom: 24px; color: white; position: relative; overflow: hidden; }
        .hero-section::before { content: ''; position: absolute; top: -50px; right: -50px; width: 200px; height: 200px; background: rgba(255,255,255,0.1); border-radius: 50%; filter: blur(60px); }
        .hero-content { position: relative; z-index: 1; }
        .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 16px; margin-bottom: 24px; }
        .stat-card { background: white; border-radius: 12px; padding: 16px; border: 1px solid #f3f4f6; }
        .stat-label { font-size: 12px; color: #6b7280; margin-bottom: 8px; font-weight: 600; }
        .stat-value { font-size: 20px; font-weight: 700; color: #111827; }
        .dashboard-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
        .dashboard-card { background: white; border-radius: 12px; padding: 20px; box-shadow: 0 2px 8px rgba(0,0,0,0.08); transition: all 0.2s; cursor: pointer; }
        .dashboard-card:hover { box-shadow: 0 4px 12px rgba(0,0,0,0.12); transform: translateY(-2px); }
        .card-title { font-size: 14px; color: #6b7280; margin-bottom: 12px; display: flex; align-items: center; gap: 8px; }
        .card-value { font-size: 28px; font-weight: 700; color: #111827; margin-bottom: 8px; }
        .card-subtitle { font-size: 12px; color: #6b7280; }
        .spending-bar { display: flex; gap: 4px; height: 12px; border-radius: 6px; overflow: hidden; margin-top: 16px; }
      `}</style>
      <div className="hero-section">
        <div className="hero-content">
          <div style={{ fontSize: '14px', opacity: 0.9, marginBottom: '8px', fontWeight: '500' }}>Total Balance</div>
          <div style={{ fontSize: '42px', fontWeight: '300', marginBottom: '16px', letterSpacing: '-1px' }}>${(balance + savingsBalance + creditBalance).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
          <div style={{ display: 'flex', gap: '24px', fontSize: '14px' }}>
            <div>
              <div style={{ opacity: 0.8 }}>Income</div>
              <div style={{ fontWeight: '600', marginTop: '4px' }}>+${(balance * 0.2).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
            </div>
            <div>
              <div style={{ opacity: 0.8 }}>Expenses</div>
              <div style={{ fontWeight: '600', marginTop: '4px' }}>-${(balance * 0.05).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
            </div>
          </div>
        </div>
      </div>

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

      <div className="dashboard-grid">
        <div className="dashboard-card" onClick={() => { setActiveTab('transfer'); setActiveNav('transfer'); }}>
          <div className="card-title">
            <DollarSign size={20} color="#10b981" />
            Checking Account ...{accountId.slice(-4) || '3432'}
          </div>
          <div className="card-value">${balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
          <div className="card-subtitle">Available Balance</div>
        </div>

        <div className="dashboard-card" onClick={() => { setActiveTab('transfer'); setActiveNav('transfer'); }}>
          <div className="card-title">
            <DollarSign size={20} color="#012169" />
            Swift Financial... {accountId.slice(-4) || '9832'}
          </div>
          <div className="card-value">${savingsBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
          <div className="card-subtitle">Current Balance</div>
        </div>

        <div className="dashboard-card" onClick={() => { setActiveTab('transfer'); setActiveNav('transfer'); setPaymentType('zelle'); }}>
          <div className="card-title">
            <img src="/assets/zelleimage.png" alt="Zelle" style={{ height: '20px' }} onError={(e) => { e.currentTarget.style.display = 'none'; }} />
          </div>
          <div style={{ fontSize: '14px', color: '#6b7280', marginBottom: '12px' }}>Send or Request Money</div>
          <div style={{ fontSize: '13px', color: '#e31837', fontWeight: '600' }}>Quick & Easy</div>
        </div>

        <div className="dashboard-card">
          <div className="card-title">
            <PieChart size={20} color="#e31837" />
            December Spending
          </div>
          <div className="card-value">$2,400.00</div>
          <div style={{ fontSize: '13px', color: '#e31837', fontWeight: '600', marginBottom: '8px' }}>3 Categories Over Budget</div>
          <div className="spending-bar">
            <div style={{ flex: 1, background: '#e31837' }}></div>
            <div style={{ flex: 0.7, background: '#f59e0b' }}></div>
            <div style={{ flex: 0.5, background: '#10b981' }}></div>
            <div style={{ flex: 0.3, background: '#3b82f6' }}></div>
          </div>
        </div>
      </div>
    </>
  );
}
