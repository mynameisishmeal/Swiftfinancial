export default function RewardsTab({ showToast }: { showToast: (msg: string, type: 'success' | 'error') => void }) {
  return (
    <>
      <style jsx>{`
        .card { background: white; border-radius: 12px; margin-bottom: 16px; box-shadow: 0 4px 6px rgba(0,0,0,0.05); overflow: hidden; }
      `}</style>
    <div className="card">
      <div style={{ padding: '24px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '8px', color: '#111827' }}>My Rewards</h2>
        <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '24px' }}>Manage your cash rewards and points</p>
        
        <div style={{ background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)', padding: '24px', borderRadius: '12px', marginBottom: '24px', color: 'white' }}>
          <div style={{ fontSize: '14px', opacity: 0.9, marginBottom: '8px' }}>Available Rewards</div>
          <div style={{ fontSize: '42px', fontWeight: '700', marginBottom: '8px' }}>15,000</div>
          <div style={{ fontSize: '16px', opacity: 0.9 }}>Points (≈ $150.00 value)</div>
        </div>

        <div style={{ marginBottom: '24px' }}>
          <div style={{ fontSize: '16px', fontWeight: '600', color: '#111827', marginBottom: '16px' }}>Redeem Your Rewards</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            {[
              { icon: '💵', title: 'Cash Back', subtitle: '$150.00', msg: 'Cash back redemption: $150.00 will be credited to your account' },
              { icon: '💳', title: 'Statement Credit', subtitle: '$150.00', msg: 'Statement credit will be applied in 1-2 business days' },
              { icon: '🎁', title: 'Gift Cards', subtitle: 'Various options', msg: 'Gift card catalog coming soon!' },
              { icon: '✈️', title: 'Travel', subtitle: 'Flights & Hotels', msg: 'Travel booking coming soon!' }
            ].map((option, idx) => (
              <button key={idx} style={{ padding: '16px', background: 'white', border: '2px solid #e5e7eb', borderRadius: '8px', cursor: 'pointer', textAlign: 'center' }} onClick={() => showToast(option.msg, 'success')}>
                <div style={{ fontSize: '24px', marginBottom: '8px' }}>{option.icon}</div>
                <div style={{ fontSize: '14px', fontWeight: '600', color: '#111827' }}>{option.title}</div>
                <div style={{ fontSize: '12px', color: '#6b7280' }}>{option.subtitle}</div>
              </button>
            ))}
          </div>
        </div>

        <div>
          <div style={{ fontSize: '16px', fontWeight: '600', color: '#111827', marginBottom: '16px' }}>Recent Activity</div>
          <div style={{ border: '1px solid #e5e7eb', borderRadius: '8px', overflow: 'hidden' }}>
            {[
              { title: 'Grocery Purchase', date: 'Dec 15, 2024', points: 250 },
              { title: 'Gas Station', date: 'Dec 12, 2024', points: 180 },
              { title: 'Online Shopping', date: 'Dec 10, 2024', points: 500 }
            ].map((activity, idx) => (
              <div key={idx} style={{ padding: '16px', borderBottom: idx < 2 ? '1px solid #e5e7eb' : 'none', display: 'flex', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: '600', color: '#111827' }}>{activity.title}</div>
                  <div style={{ fontSize: '12px', color: '#6b7280' }}>{activity.date}</div>
                </div>
                <div style={{ fontSize: '14px', fontWeight: '600', color: '#10b981' }}>+{activity.points} pts</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
    </>
  );
}
