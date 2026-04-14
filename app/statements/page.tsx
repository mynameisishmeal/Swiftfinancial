'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Statements() {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [accountId, setAccountId] = useState('');
  const [iban, setIban] = useState('');
  const [balance, setBalance] = useState(0);
  const [savingsBalance, setSavingsBalance] = useState(0);
  const [creditBalance, setCreditBalance] = useState(0);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<any[]>([]);
  const [filterType, setFilterType] = useState('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const router = useRouter();

  useEffect(() => {
    const userEmail = localStorage.getItem('userEmail');
    if (!userEmail) {
      router.push('/');
      return;
    }
    setEmail(userEmail);
    loadAccount(userEmail);
  }, []);

  useEffect(() => {
    applyFilters();
  }, [transactions, filterType, startDate, endDate]);

  const loadAccount = async (userEmail: string) => {
    const res = await fetch(`/api/accounts?email=${userEmail}`);
    const data = await res.json();
    if (data.balance !== undefined) {
      setBalance(data.balance);
      setSavingsBalance(data.balance * 0.15);
      setCreditBalance(data.balance * 0.3);
      setAccountId(data.accountId);
      setIban(data.iban);
      const capitalizedName = data.name.split(' ').map((word: string) => 
        word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
      ).join(' ');
      setName(capitalizedName);
      
      const txRes = await fetch(`/api/accounts?email=${userEmail}&transactions=true`);
      const txData = await txRes.json();
      if (txData.transactions) setTransactions(txData.transactions);
    }
  };

  const applyFilters = () => {
    let filtered = [...transactions];

    if (filterType !== 'all') {
      filtered = filtered.filter(tx => tx.type === filterType);
    }

    if (startDate) {
      filtered = filtered.filter(tx => new Date(tx.date) >= new Date(startDate));
    }

    if (endDate) {
      filtered = filtered.filter(tx => new Date(tx.date) <= new Date(endDate));
    }

    setFilteredTransactions(filtered);
  };

  const downloadStatement = (filtered = false) => {
    const txToDownload = filtered ? filteredTransactions : transactions;
    const statement = `
Swift Financial Account Statement
==================================

Account Holder: ${name}
Account Number: ${accountId}
IBAN: ${iban}
Email: ${email}
Statement Date: ${new Date().toLocaleDateString()}
${filtered ? `Filter Applied: ${filterType !== 'all' ? filterType : 'All types'}, Date Range: ${startDate || 'Any'} to ${endDate || 'Any'}` : ''}

Account Balances:
-------------------
Checking Balance: $${balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
Savings Balance: $${savingsBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
Credit Card Balance: $${creditBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
Total Balance: $${(balance + savingsBalance + creditBalance).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}

Transaction History (CSV Format):
-------------------
Date,Description,Type,Amount,Balance
${txToDownload.slice().reverse().map(t => 
  `${new Date(t.date).toLocaleDateString()},\"${(t.description || t.type.replace('_', ' ')).toUpperCase()}\",${t.type},${(t.amount || 0).toFixed(2)},${(t.balance || 0).toFixed(2)}`
).join('\n')}

-------------------
End of Statement

Swift Financial, N.A. Member FDIC.
© ${new Date().getFullYear()} Swift Financial Corporation.
    `;

    const blob = new Blob([statement], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `SFI_Statement_${accountId}_${new Date().toISOString().split('T')[0]}${filtered ? '_filtered' : ''}.txt`;
    a.click();
  };

  return (
    <>
      <style jsx>{`
        * { margin: 0; padding: 0; box-sizing: border-box; }
        .app-container { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #F4F4F4; min-height: 100vh; }
        .top-nav { background: white; padding: 16px 20px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); display: flex; justify-content: space-between; align-items: center; }
        .back-btn { background: #0055C4; color: white; border: none; padding: 10px 20px; border-radius: 6px; font-size: 13px; font-weight: 600; cursor: pointer; }
        .back-btn:hover { background: #004494; }
        .content { padding: 20px; max-width: 1200px; margin: 0 auto; }
        .card { background: white; border-radius: 12px; margin-bottom: 16px; box-shadow: 0 2px 8px rgba(0,0,0,0.08); overflow: hidden; }
        .card-header { padding: 20px; border-bottom: 1px solid #f3f4f6; }
        .card-title { font-size: 20px; font-weight: 700; color: #111827; }
        .card-content { padding: 20px; }
        .filter-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; margin-bottom: 20px; }
        .form-group { display: flex; flex-direction: column; gap: 8px; }
        .form-label { font-size: 13px; font-weight: 600; color: #111827; }
        .form-input, .form-select { padding: 10px 12px; border: 2px solid #e5e7eb; border-radius: 8px; font-size: 14px; outline: none; }
        .form-input:focus, .form-select:focus { border-color: #e31837; box-shadow: 0 0 0 3px rgba(227, 24, 55, 0.1); }
        .btn-group { display: flex; gap: 12px; }
        .btn { padding: 12px 24px; border: none; border-radius: 8px; font-size: 14px; font-weight: 600; cursor: pointer; transition: all 0.2s; }
        .btn-primary { background: #e31837; color: white; }
        .btn-primary:hover { background: #c41230; }
        .btn-secondary { background: #0055C4; color: white; }
        .btn-secondary:hover { background: #004494; }
        .transaction-table { width: 100%; border-collapse: collapse; }
        .transaction-table th { text-align: left; padding: 12px; background: #f9fafb; font-size: 12px; font-weight: 700; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px; }
        .transaction-table td { padding: 12px; border-bottom: 1px solid #f3f4f6; font-size: 14px; }
        .transaction-table tr:hover { background: #f9fafb; }
        .amount-positive { color: #10b981; font-weight: 600; }
        .amount-negative { color: #111827; font-weight: 600; }
        .summary-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; margin-bottom: 24px; }
        .summary-card { background: #f9fafb; padding: 16px; border-radius: 8px; }
        .summary-label { font-size: 12px; color: #6b7280; margin-bottom: 4px; }
        .summary-value { font-size: 20px; font-weight: 700; color: #111827; }
      `}</style>
      <div className="app-container">
        <div className="top-nav">
          <img src="/assets/BofA_rgb.png" alt="Swift Financial" style={{ height: '24px' }} />
          <button onClick={() => router.push('/dashboard')} className="back-btn">
            BACK TO DASHBOARD
          </button>
        </div>

        <div className="content">
          <div className="card">
            <div className="card-header">
              <h1 className="card-title">Account Statements</h1>
            </div>
            <div className="card-content">
              <div className="summary-grid">
                <div className="summary-card">
                  <div className="summary-label">Account Holder</div>
                  <div className="summary-value">{name}</div>
                </div>
                <div className="summary-card">
                  <div className="summary-label">Account Number</div>
                  <div className="summary-value">...{accountId.slice(-4)}</div>
                </div>
                <div className="summary-card">
                  <div className="summary-label">Total Balance</div>
                  <div className="summary-value">${(balance + savingsBalance + creditBalance).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                </div>
                <div className="summary-card">
                  <div className="summary-label">Total Transactions</div>
                  <div className="summary-value">{filteredTransactions.length}</div>
                </div>
              </div>

              <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '16px' }}>Filter Transactions</h3>
              <div className="filter-grid">
                <div className="form-group">
                  <label className="form-label">Transaction Type</label>
                  <select className="form-select" value={filterType} onChange={(e) => setFilterType(e.target.value)}>
                    <option value="all">All Types</option>
                    <option value="deposit">Deposits</option>
                    <option value="withdraw">Withdrawals</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Start Date</label>
                  <input type="date" className="form-input" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                </div>
                <div className="form-group">
                  <label className="form-label">End Date</label>
                  <input type="date" className="form-input" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                </div>
              </div>

              <div className="btn-group" style={{ marginBottom: '24px' }}>
                <button className="btn btn-primary" onClick={() => downloadStatement(false)}>
                  Download Complete Statement
                </button>
                <button className="btn btn-secondary" onClick={() => downloadStatement(true)}>
                  Download Filtered Statement
                </button>
                <button className="btn" style={{ background: '#e5e7eb', color: '#111827' }} onClick={() => { setFilterType('all'); setStartDate(''); setEndDate(''); }}>
                  Clear Filters
                </button>
              </div>

              <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '16px' }}>Transaction History</h3>
              {filteredTransactions.length === 0 ? (
                <div style={{ padding: '40px', textAlign: 'center', color: '#6b7280' }}>
                  <div style={{ fontSize: '48px', marginBottom: '16px' }}>📄</div>
                  <div style={{ fontSize: '16px', fontWeight: 600, color: '#111827', marginBottom: '8px' }}>No Transactions Found</div>
                  <div style={{ fontSize: '14px' }}>Try adjusting your filters</div>
                </div>
              ) : (
                <table className="transaction-table">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Description</th>
                      <th>Type</th>
                      <th>Amount</th>
                      <th>Balance</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTransactions.slice().reverse().map((tx, idx) => (
                      <tr key={idx}>
                        <td>{new Date(tx.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</td>
                        <td>{tx.description || tx.type.replace('_', ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())}</td>
                        <td style={{ textTransform: 'capitalize' }}>{tx.type}</td>
                        <td className={tx.type === 'deposit' ? 'amount-positive' : 'amount-negative'}>
                          {tx.type === 'deposit' ? '+' : '-'}${Math.abs(tx.amount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </td>
                        <td>${tx.balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
