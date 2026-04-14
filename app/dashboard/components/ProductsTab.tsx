export default function ProductsTab({ showToast }: { showToast: (msg: string, type: 'success' | 'error') => void }) {
  const sections = [
    {
      title: 'Credit Cards',
      items: [
        { name: 'Cash Rewards Card', desc: '3% cash back on your choice category', btnColor: '#E31837', msg: 'Application started!' },
        { name: 'Travel Rewards Card', desc: 'Earn points on every purchase', btnColor: '#E31837', msg: 'Application started!' }
      ]
    },
    {
      title: 'Loans',
      items: [
        { name: 'Personal Loan', desc: 'Rates as low as 6.99% APR', btnColor: '#0055C4', msg: 'Loan application started!' },
        { name: 'Auto Loan', desc: 'Finance your dream car', btnColor: '#0055C4', msg: 'Loan application started!' },
        { name: 'Home Equity Line', desc: 'Access your home\'s equity', btnColor: '#0055C4', msg: 'Loan application started!' }
      ]
    },
    {
      title: 'Investment & Wealth',
      items: [
        { name: 'Investment Account', desc: 'Start investing with $100', btnColor: '#10b981', msg: 'Investment account setup started!' },
        { name: 'Retirement Planning', desc: 'IRA and 401(k) options', btnColor: '#10b981', msg: 'Retirement planning consultation scheduled!' }
      ]
    }
  ];

  return (
    <>
      <style jsx>{`
        .card { background: white; border-radius: 12px; margin-bottom: 16px; box-shadow: 0 4px 6px rgba(0,0,0,0.05); overflow: hidden; }
      `}</style>
    <div className="card">
      <div style={{ padding: '24px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '8px', color: '#111827' }}>Products & Services</h2>
        <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '24px' }}>Explore our banking products</p>
        
        {sections.map((section, idx) => (
          <div key={idx} style={{ marginBottom: '24px' }}>
            <div style={{ fontSize: '18px', fontWeight: '600', color: '#111827', marginBottom: '16px' }}>{section.title}</div>
            <div style={{ display: 'grid', gap: '12px' }}>
              {section.items.map((item, i) => (
                <div key={i} style={{ border: '1px solid #e5e7eb', borderRadius: '8px', padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontSize: '16px', fontWeight: '600', color: '#111827' }}>{item.name}</div>
                    <div style={{ fontSize: '14px', color: '#6b7280' }}>{item.desc}</div>
                  </div>
                  <button style={{ padding: '8px 16px', background: item.btnColor, color: 'white', border: 'none', borderRadius: '6px', fontSize: '12px', fontWeight: '600', cursor: 'pointer' }} onClick={() => showToast(item.msg, 'success')}>
                    {section.title === 'Loans' ? 'Apply' : section.title === 'Credit Cards' ? 'Apply' : i === 0 ? 'Open' : 'Learn More'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
    </>
  );
}
