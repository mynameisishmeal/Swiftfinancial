'use client';

import { useState, useEffect } from 'react';

export default function CustomBanksTab({ userEmail, showToast }: any) {
  const [banks, setBanks] = useState<any[]>([]);
  const [bankName, setBankName] = useState('');
  const [category, setCategory] = useState('US Banks');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadBanks();
  }, []);

  const loadBanks = async () => {
    const res = await fetch('/api/admin/custom-banks');
    const data = await res.json();
    if (data.banks) {
      setBanks(data.banks);
    }
  };

  const addBank = async () => {
    if (!bankName.trim()) {
      showToast('Please enter bank name', 'error');
      return;
    }

    setLoading(true);
    const res = await fetch('/api/admin/custom-banks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ adminEmail: userEmail, bankName: bankName.trim(), category }),
    });
    const data = await res.json();
    setLoading(false);

    if (res.ok) {
      showToast(data.message, 'success');
      setBankName('');
      setCategory('US Banks');
      loadBanks();
    } else {
      showToast(data.message, 'error');
    }
  };

  const deleteBank = async (name: string) => {
    if (!confirm(`Delete ${name}?`)) return;

    const res = await fetch(`/api/admin/custom-banks?bankName=${encodeURIComponent(name)}&adminEmail=${userEmail}`, {
      method: 'DELETE',
    });
    const data = await res.json();

    if (res.ok) {
      showToast(data.message, 'success');
      loadBanks();
    } else {
      showToast(data.message, 'error');
    }
  };

  return (
    <>
      <style jsx>{`
        .card { background: white; border-radius: 12px; margin-bottom: 24px; box-shadow: 0 4px 6px rgba(0,0,0,0.05); overflow: hidden; }
        .card-header { padding: 20px 24px; border-bottom: 1px solid #e5e7eb; }
        .card-title { font-size: 18px; fontWeight: 700; color: #111827; }
        .card-content { padding: 24px; }
        .form-group { margin-bottom: 16px; }
        .label { display: block; font-size: 13px; font-weight: 600; color: #111827; margin-bottom: 8px; text-transform: uppercase; letter-spacing: 0.5px; }
        .input { width: 100%; padding: 12px; border: 2px solid #e5e7eb; border-radius: 8px; font-size: 14px; outline: none; }
        .input:focus { border-color: #E31837; }
        .btn { padding: 12px 24px; border-radius: 8px; border: none; font-size: 14px; font-weight: 600; cursor: pointer; }
        .btn-primary { background: #E31837; color: white; }
        .btn-primary:hover { background: #c41530; }
        .btn-primary:disabled { background: #9ca3af; cursor: not-allowed; }
        .btn-danger { background: #ef4444; color: white; padding: 8px 16px; font-size: 12px; }
        .btn-danger:hover { background: #dc2626; }
        .bank-list { border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden; }
        .bank-item { padding: 16px 20px; border-bottom: 1px solid #e5e7eb; display: flex; justify-content: space-between; align-items: center; }
        .bank-item:last-child { border-bottom: none; }
        .bank-info { flex: 1; }
        .bank-name { font-size: 14px; font-weight: 600; color: #111827; margin-bottom: 4px; }
        .bank-category { font-size: 12px; color: #6b7280; }
        .bank-meta { font-size: 11px; color: #9ca3af; margin-top: 4px; }
      `}</style>

      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Add Custom Bank</h3>
        </div>
        <div className="card-content">
          <div style={{ padding: '12px', marginBottom: '16px', background: '#f0f9ff', border: '1px solid #bae6fd', borderRadius: '8px', fontSize: '13px', color: '#0369a1' }}>
            ℹ️ Custom banks will be available to all users when making wire transfers.
          </div>
          <div className="form-group">
            <label className="label">Bank Name</label>
            <input 
              className="input" 
              type="text" 
              value={bankName} 
              onChange={(e) => setBankName(e.target.value)}
              placeholder="Enter bank name"
            />
          </div>
          <div className="form-group">
            <label className="label">Category</label>
            <select className="input" value={category} onChange={(e) => setCategory(e.target.value)}>
              <option value="US Banks">US Banks</option>
              <option value="UK Banks">UK Banks</option>
              <option value="European Banks">European Banks</option>
              <option value="Asian Banks">Asian Banks</option>
              <option value="Other Banks">Other Banks</option>
            </select>
          </div>
          <button 
            className="btn btn-primary" 
            onClick={addBank}
            disabled={loading}
            style={{ width: '100%' }}
          >
            {loading ? 'Adding...' : 'Add Bank'}
          </button>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Custom Banks ({banks.length})</h3>
        </div>
        <div className="card-content">
          {banks.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 20px', color: '#6b7280' }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>🏦</div>
              <div style={{ fontSize: '16px', fontWeight: '600', color: '#111827', marginBottom: '8px' }}>No Custom Banks</div>
              <div style={{ fontSize: '14px' }}>Add custom banks to make them available for wire transfers</div>
            </div>
          ) : (
            <div className="bank-list">
              {banks.map((bank, idx) => (
                <div key={idx} className="bank-item">
                  <div className="bank-info">
                    <div className="bank-name">{bank.name}</div>
                    <div className="bank-category">{bank.category}</div>
                    <div className="bank-meta">
                      Added by {bank.createdBy} • {new Date(bank.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  <button 
                    className="btn btn-danger" 
                    onClick={() => deleteBank(bank.name)}
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
