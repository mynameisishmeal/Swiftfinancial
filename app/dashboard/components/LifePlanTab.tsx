export default function LifePlanTab({ showToast }: { showToast: (msg: string, type: 'success' | 'error') => void }) {
  return (
    <>
      <style jsx>{`
        .card { background: white; border-radius: 12px; margin-bottom: 16px; box-shadow: 0 4px 6px rgba(0,0,0,0.05); overflow: hidden; }
      `}</style>
    <div className="card">
      <div style={{ padding: '24px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '8px', color: '#111827' }}>Swift Financial Life Plan®</h2>
        <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '24px' }}>Set financial goals and track your progress</p>
        
        {[
          { title: 'Emergency Fund', target: 10000, saved: 6800, percent: 68, color: '#10b981' },
          { title: 'Dream Vacation', target: 5000, saved: 2100, percent: 42, color: '#f59e0b' },
          { title: 'New Home Down Payment', target: 50000, saved: 12000, percent: 24, color: '#3b82f6' }
        ].map((goal, idx) => (
          <div key={idx} style={{ background: '#f9fafb', padding: '20px', borderRadius: '12px', marginBottom: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <div>
                <div style={{ fontSize: '16px', fontWeight: '600', color: '#111827' }}>{goal.title}</div>
                <div style={{ fontSize: '12px', color: '#6b7280' }}>Target: ${goal.target.toLocaleString()}</div>
              </div>
              <div style={{ fontSize: '20px', fontWeight: '700', color: goal.color }}>{goal.percent}%</div>
            </div>
            <div style={{ width: '100%', height: '8px', background: '#e5e7eb', borderRadius: '4px', overflow: 'hidden' }}>
              <div style={{ width: `${goal.percent}%`, height: '100%', background: `linear-gradient(90deg, ${goal.color} 0%, ${goal.color}dd 100%)`, transition: 'width 0.3s' }}></div>
            </div>
            <div style={{ fontSize: '14px', color: '#6b7280', marginTop: '8px' }}>${goal.saved.toLocaleString()} saved • ${(goal.target - goal.saved).toLocaleString()} to go</div>
          </div>
        ))}

        <button style={{ width: '100%', padding: '14px', background: '#E31837', color: 'white', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }} onClick={() => showToast('Create new goal feature coming soon!', 'success')}>
          + Create New Goal
        </button>
      </div>
    </div>
    </>
  );
}
