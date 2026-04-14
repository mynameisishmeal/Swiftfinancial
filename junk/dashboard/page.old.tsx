'use client';

import '../globals.css';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Dashboard() {
  const [email, setEmail] = useState('');
  const [accountId, setAccountId] = useState('');
  const [iban, setIban] = useState('');
  const [name, setName] = useState('');
  const [avatar, setAvatar] = useState('');
  const [balance, setBalance] = useState(0);
  const [amount, setAmount] = useState('');
  const [toEmail, setToEmail] = useState('');
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState('');
  const [message, setMessage] = useState('');
  const [showAvatarUpload, setShowAvatarUpload] = useState(false);
  const [showStatements, setShowStatements] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [taxCleared, setTaxCleared] = useState(true);
  const [activeTab, setActiveTab] = useState('accounts');
  const [zelleRecipient, setZelleRecipient] = useState('');
  const [zelleAmount, setZelleAmount] = useState('');
  const [zelleMessage, setZelleMessage] = useState('');
  const [cardFlipped, setCardFlipped] = useState(false);
  const [userRole, setUserRole] = useState('');
  const router = useRouter();

  useEffect(() => {
    const userEmail = localStorage.getItem('userEmail');
    const role = localStorage.getItem('userRole');
    if (!userEmail) {
      router.push('/');
      return;
    }
    setEmail(userEmail);
    setUserRole(role || 'user');
    loadAccount(userEmail);
  }, []);

  const loadAccount = async (userEmail: string) => {
    const res = await fetch(`/api/accounts?email=${userEmail}`);
    const data = await res.json();
    if (data.balance !== undefined) {
      setBalance(data.balance);
      setAccountId(data.accountId);
      setIban(data.iban);
      setName(data.name);
      setAvatar(data.avatar);
      setTaxCleared(data.taxCleared !== false);
      
      const txRes = await fetch(`/api/accounts?email=${userEmail}&transactions=true`);
      const txData = await txRes.json();
      if (txData.transactions) setTransactions(txData.transactions);
    }
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const newAvatar = reader.result as string;
        setAvatar(newAvatar);
        
        const res = await fetch('/api/accounts/avatar', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, avatar: newAvatar }),
        });
        
        if (res.ok) {
          setMessage('Profile picture updated');
          setShowAvatarUpload(false);
          setTimeout(() => setMessage(''), 3000);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const deposit = async () => {
    setLoading('deposit');
    const res = await fetch('/api/accounts', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ accountId, amount: parseFloat(amount), type: 'deposit' }),
    });
    const data = await res.json();
    setMessage(data.message);
    if (data.balance !== undefined) {
      setBalance(data.balance);
      await loadAccount(email);
    }
    setAmount('');
    setLoading('');
    setTimeout(() => setMessage(''), 3000);
  };

  const withdraw = async () => {
    if (!taxCleared) {
      setMessage('Withdrawal blocked: You have outstanding tax issues. Please contact support to clear your tax status.');
      return;
    }

    setLoading('withdraw');
    const res = await fetch('/api/accounts', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ accountId, amount: parseFloat(amount), type: 'withdraw' }),
    });
    const data = await res.json();
    setMessage(data.message);
    if (data.balance !== undefined) {
      setBalance(data.balance);
      await loadAccount(email);
    }
    setAmount('');
    setLoading('');
    setTimeout(() => setMessage(''), 3000);
  };

  const transfer = async () => {
    if (!taxCleared) {
      setMessage('Transfer blocked: You have outstanding tax issues. Please contact support to clear your tax status.');
      return;
    }

    setLoading('transfer');
    const res = await fetch('/api/transfer', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fromEmail: email, toEmail, amount: parseFloat(amount) }),
    });
    const data = await res.json();
    setMessage(data.message);
    if (res.ok) {
      await loadAccount(email);
      setAmount('');
      setToEmail('');
    }
    setLoading('');
    setTimeout(() => setMessage(''), 3000);
  };

  const downloadStatement = () => {
    const statement = `
Bank of America Account Statement
==================================

Account Holder: ${name}
Account Number: ${accountId}
IBAN: ${iban}
Email: ${email}
Statement Date: ${new Date().toLocaleDateString()}

Current Balance: $${balance.toFixed(2)}

Transaction History:
-------------------
${transactions.slice().reverse().map(t => 
  `${new Date(t.date).toLocaleDateString()} - ${(t.description || t.type.replace('_', ' ')).toUpperCase()} - $${(t.amount || 0).toFixed(2)} - Balance: $${(t.balance || 0).toFixed(2)}`
).join('\n')}

-------------------
End of Statement
    `;

    const blob = new Blob([statement], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `BofA_Statement_${accountId}_${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
    setMessage('Statement downloaded successfully');
    setTimeout(() => setMessage(''), 3000);
  };

  const downloadTransactions = () => {
    const csv = `Date,Description,Type,Amount,Balance\n${transactions.slice().reverse().map(t => 
      `${new Date(t.date).toLocaleDateString()},"${t.description || t.type}",${t.type},${(t.amount || 0).toFixed(2)},${(t.balance || 0).toFixed(2)}`
    ).join('\n')}`;

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `BofA_Transactions_${accountId}_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    setMessage('Transactions exported successfully');
    setTimeout(() => setMessage(''), 3000);
  };

  const sendZelle = async () => {
    if (!taxCleared) {
      setMessage('Zelle blocked: You have outstanding tax issues. Please contact support to clear your tax status.');
      return;
    }

    setLoading('zelle');
    const res = await fetch('/api/zelle', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        fromEmail: email, 
        toIdentifier: zelleRecipient, 
        amount: parseFloat(zelleAmount),
        message: zelleMessage
      }),
    });
    const data = await res.json();
    setMessage(data.message);
    if (res.ok) {
      await loadAccount(email);
      setZelleAmount('');
      setZelleRecipient('');
      setZelleMessage('');
    }
    setLoading('');
    setTimeout(() => setMessage(''), 3000);
  };

  const logout = () => {
    localStorage.removeItem('userEmail');
    router.push('/');
  };

  return (
    <>
      <link rel="stylesheet" href="/assets/bofa-dashboard.css" />
      <div className="bofa-dashboard">
        <div className="bofa-header">
          <div className="bofa-header-stripe"></div>
          <div className="bofa-header-nav">
            <div className="bofa-header-content">
              <img className="bofa-logo" src="/assets/BofA_rgb.png" alt="Bank of America" />
              <div className="bofa-user-info">
                <div style={{ position: 'relative' }}>
                  <img 
                    className="bofa-avatar"
                    src={avatar || 'https://ui-avatars.com/api/?name=' + name + '&background=DB0011&color=fff'} 
                    alt="Avatar" 
                    onClick={() => setShowAvatarUpload(!showAvatarUpload)}
                    style={{ cursor: 'pointer' }}
                  />
                  {showAvatarUpload && (
                    <div style={{ position: 'absolute', right: '0', marginTop: '8px', background: 'white', boxShadow: '0 4px 12px rgba(0,0,0,0.15)', border: '1px solid var(--bofa-gray-200)', padding: '16px', zIndex: 10, width: '280px', borderRadius: '8px' }}>
                      <label className="bofa-label" style={{ marginBottom: '12px', display: 'block' }}>UPDATE PROFILE PICTURE</label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleAvatarChange}
                        style={{ display: 'none' }}
                        id="avatar-upload"
                      />
                      <label htmlFor="avatar-upload" style={{ padding: '12px 24px', border: 'none', borderRadius: '6px', fontSize: '14px', fontWeight: '600', cursor: 'pointer', textTransform: 'uppercase', letterSpacing: '0.5px', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)', background: 'linear-gradient(135deg, var(--bofa-red) 0%, var(--bofa-dark-red) 100%)', color: 'white', width: '100%', textAlign: 'center', display: 'block', boxSizing: 'border-box' }}>
                        Choose File
                      </label>
                    </div>
                  )}
                </div>
                <span className="text-white font-light">{name}</span>
                <button onClick={logout} className="bofa-logout-btn">
                  LOG OUT
                </button>
              </div>
            </div>
          </div>
          
          <div style={{ background: 'white', borderBottom: '1px solid #e5e7eb' }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 16px' }}>
              <div style={{ display: 'flex', gap: '4px', overflowX: 'auto', WebkitOverflowScrolling: 'touch', scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                <style>{`::-webkit-scrollbar { display: none; }`}</style>
                {['accounts', 'transfer', 'rewards', 'settings'].map(tab => (
                  <button 
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    style={{ 
                      padding: '16px 24px', 
                      background: 'none',
                      border: 'none',
                      borderBottom: activeTab === tab ? '3px solid #e31837' : '3px solid transparent',
                      cursor: 'pointer', 
                      fontSize: '14px', 
                      fontWeight: '600', 
                      color: activeTab === tab ? '#e31837' : '#6b7280',
                      transition: 'all 0.2s',
                      whiteSpace: 'nowrap',
                      textTransform: 'capitalize'
                    }}
                  >
                    {tab === 'transfer' ? 'Transfer' : tab}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="bofa-main" style={{ maxWidth: '1400px', margin: '0 auto', padding: '24px 16px' }}>
          {message && (
            <div className={`bofa-alert ${message.includes('blocked') || message.includes('tax') ? 'bofa-alert-error' : 'bofa-alert-success'}`}>
              {message}
            </div>
          )}

          {!taxCleared && (
            <div className="bofa-alert bofa-alert-warning">
              <strong>⚠️ Tax Clearance Required</strong><br />
              Your account has outstanding tax issues. Transfers and withdrawals are temporarily blocked. Please contact support.
            </div>
          )}

          {activeTab === 'accounts' && (
            <>
              {/* Hero Section with Total Balance */}
              <div style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e40af 100%)', borderRadius: '16px', padding: '40px', marginBottom: '32px', color: 'white', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: '-50px', right: '-50px', width: '200px', height: '200px', background: 'rgba(255,255,255,0.1)', borderRadius: '50%', filter: 'blur(60px)' }}></div>
                <div style={{ position: 'relative', zIndex: 1 }}>
                  <div style={{ fontSize: '14px', opacity: 0.9, marginBottom: '8px', fontWeight: '500' }}>Total Balance</div>
                  <div style={{ fontSize: '48px', fontWeight: '300', marginBottom: '16px', letterSpacing: '-1px' }}>${(balance * 1.15).toFixed(2)}</div>
                  <div style={{ display: 'flex', gap: '24px', fontSize: '14px' }}>
                    <div>
                      <div style={{ opacity: 0.8 }}>Income</div>
                      <div style={{ fontWeight: '600', marginTop: '4px' }}>+${(balance * 0.2).toFixed(2)}</div>
                    </div>
                    <div>
                      <div style={{ opacity: 0.8 }}>Expenses</div>
                      <div style={{ fontWeight: '600', marginTop: '4px' }}>-${(balance * 0.05).toFixed(2)}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Account Cards Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px', marginBottom: '32px' }}>
                {/* Checking Account */}
                <div style={{ background: 'white', borderRadius: '16px', padding: '24px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)', border: '1px solid rgba(0,0,0,0.05)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '20px' }}>
                    <div>
                      <div style={{ fontSize: '12px', color: '#6b7280', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Checking</div>
                      <div style={{ fontSize: '11px', color: '#9ca3af', marginTop: '4px' }}>•••• {accountId.slice(-4)}</div>
                    </div>
                    <div style={{ width: '40px', height: '40px', background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>💳</div>
                  </div>
                  <div style={{ fontSize: '32px', fontWeight: '600', color: '#111827', marginBottom: '8px' }}>${balance.toFixed(2)}</div>
                  <div style={{ fontSize: '13px', color: '#10b981', fontWeight: '500' }}>↑ 2.5% this month</div>
                </div>

                {/* Savings Account */}
                <div style={{ background: 'white', borderRadius: '16px', padding: '24px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)', border: '1px solid rgba(0,0,0,0.05)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '20px' }}>
                    <div>
                      <div style={{ fontSize: '12px', color: '#6b7280', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Savings</div>
                      <div style={{ fontSize: '11px', color: '#9ca3af', marginTop: '4px' }}>•••• {accountId.slice(-4)}</div>
                    </div>
                    <div style={{ width: '40px', height: '40px', background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>🏦</div>
                  </div>
                  <div style={{ fontSize: '32px', fontWeight: '600', color: '#111827', marginBottom: '8px' }}>${(balance * 0.15).toFixed(2)}</div>
                  <div style={{ fontSize: '13px', color: '#6b7280', fontWeight: '500' }}>APY 4.5%</div>
                </div>

                {/* Credit Card */}
                <div 
                  onClick={() => setCardFlipped(!cardFlipped)}
                  style={{ 
                    perspective: '1000px',
                    cursor: 'pointer',
                    height: '220px'
                  }}
                >
                  <div style={{
                    position: 'relative',
                    width: '100%',
                    height: '100%',
                    transition: 'transform 0.6s',
                    transformStyle: 'preserve-3d',
                    transform: cardFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)'
                  }}>
                    {/* Front of card */}
                    <div style={{ 
                      position: 'absolute',
                      width: '100%',
                      height: '100%',
                      backfaceVisibility: 'hidden',
                      background: '#000000', 
                      borderRadius: '16px', 
                      padding: '24px', 
                      boxShadow: '0 10px 15px -3px rgba(0,0,0,0.3)', 
                      color: 'white',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                        <div>
                          <img src="/assets/BofA_rgb.png" alt="Bank of America" style={{ height: '24px', display: 'block' }} />
                        </div>
                        <div style={{ fontSize: '36px', fontWeight: '700', fontStyle: 'italic', color: 'white', textShadow: '2px 2px 4px rgba(0,0,0,0.3)' }}>VISA</div>
                      </div>
                      <div>
                        <img src="/assets/creditcardchip.jpg" alt="chip" style={{ width: '50px', height: '40px', borderRadius: '6px', marginBottom: '16px', objectFit: 'cover' }} />
                        <div style={{ fontSize: '24px', letterSpacing: '4px', marginBottom: '20px', fontFamily: 'Courier New, monospace', fontWeight: '500' }}>
                          4532  {accountId.slice(-4).padStart(4, '0')}  {accountId.slice(-8, -4).padStart(4, '0')}  {accountId.slice(-12, -8).padStart(4, '0')}
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end' }}>
                          <div>
                            <div style={{ fontSize: '9px', opacity: 0.9, marginBottom: '4px', letterSpacing: '1px' }}>CARD HOLDER</div>
                            <div style={{ fontSize: '15px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '1px' }}>{name}</div>
                          </div>
                          <div>
                            <div style={{ fontSize: '9px', opacity: 0.9, marginBottom: '4px', letterSpacing: '1px' }}>VALID THRU</div>
                            <div style={{ fontSize: '15px', fontWeight: '600' }}>12/28</div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Back of card */}
                    <div style={{ 
                      position: 'absolute',
                      width: '100%',
                      height: '100%',
                      minHeight: '268px',
                      backfaceVisibility: 'hidden',
                      transform: 'rotateY(180deg)',
                      background: '#000000', 
                      borderRadius: '16px', 
                      boxShadow: '0 10px 15px -3px rgba(0,0,0,0.3)',
                      overflow: 'hidden'
                    }}>
                      <div style={{ width: '100%', height: '50px', background: '#000', marginTop: '30px' }}></div>
                      <div style={{ padding: '20px 24px' }}>
                        <div style={{ background: '#e5e7eb', height: '45px', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', paddingRight: '16px', marginBottom: '16px' }}>
                          <div style={{ background: 'white', padding: '6px 14px', borderRadius: '4px', fontSize: '18px', fontWeight: '700', color: '#1f2937', letterSpacing: '3px', fontStyle: 'italic' }}>***</div>
                        </div>
                        <div style={{ fontSize: '10px', color: 'white', opacity: 0.9, marginBottom: '12px', lineHeight: '1.4' }}>
                          This card is property of Bank of America. If found, please return to any Bank of America branch or call 1-800-432-1000.
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <div style={{ fontSize: '10px', color: 'white', opacity: 0.8 }}>Customer Service: 1-800-432-1000</div>
                          <div style={{ background: 'white', padding: '4px 8px', borderRadius: '4px' }}>
                            <img src="/assets/BofA_rgb.png" alt="Bank of America" style={{ height: '12px', display: 'block' }} />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Stats */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '32px' }}>
                <div style={{ background: 'white', borderRadius: '12px', padding: '20px', border: '1px solid #f3f4f6' }}>
                  <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '8px', fontWeight: '600' }}>REWARDS POINTS</div>
                  <div style={{ fontSize: '24px', fontWeight: '700', color: '#f59e0b', marginBottom: '4px' }}>12,450</div>
                  <div style={{ fontSize: '12px', color: '#6b7280' }}>≈ $124.50 value</div>
                </div>

                <div style={{ background: 'white', borderRadius: '12px', padding: '20px', border: '1px solid #f3f4f6' }}>
                  <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '8px', fontWeight: '600' }}>ACCOUNT HOLDER</div>
                  <div style={{ fontSize: '16px', fontWeight: '600', color: '#111827', marginBottom: '4px' }}>{name}</div>
                  <span style={{
                    fontSize: '10px',
                    padding: '4px 8px',
                    borderRadius: '6px',
                    display: 'inline-block',
                    background: userRole === 'superadmin' ? '#f3e8ff' : userRole === 'admin' ? '#dbeafe' : '#f3f4f6',
                    color: userRole === 'superadmin' ? '#7c3aed' : userRole === 'admin' ? '#1e40af' : '#6b7280',
                    fontWeight: '600'
                  }}>
                    {userRole.toUpperCase()}
                  </span>
                </div>

                <div style={{ background: 'white', borderRadius: '12px', padding: '20px', border: '1px solid #f3f4f6' }}>
                  <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '8px', fontWeight: '600' }}>TAX STATUS</div>
                  <div style={{ fontSize: '16px', fontWeight: '600', color: taxCleared ? '#10b981' : '#ef4444', marginBottom: '4px' }}>
                    {taxCleared ? '✓ Cleared' : '⚠ Pending'}
                  </div>
                  <div style={{ fontSize: '12px', color: '#6b7280' }}>{taxCleared ? 'All set' : 'Action required'}</div>
                </div>
              </div>

              <div className="bofa-quick-actions">
                <button className="bofa-action-btn" onClick={() => setActiveTab('transfer')}>
                  <div className="bofa-action-icon">💸</div>
                  <div className="bofa-action-title">Transfer Money</div>
                  <div className="bofa-action-desc">Send money to another account</div>
                </button>
                
                <button className="bofa-action-btn" onClick={() => setShowStatements(!showStatements)}>
                  <div className="bofa-action-icon">📄</div>
                  <div className="bofa-action-title">Statements</div>
                  <div className="bofa-action-desc">View and download statements</div>
                </button>
                
                <button className="bofa-action-btn" onClick={downloadTransactions}>
                  <div className="bofa-action-icon">📊</div>
                  <div className="bofa-action-title">Export Transactions</div>
                  <div className="bofa-action-desc">Download transaction history</div>
                </button>
                
                <button className="bofa-action-btn" onClick={() => setActiveTab('settings')}>
                  <div className="bofa-action-icon">⚙️</div>
                  <div className="bofa-action-title">Account Settings</div>
                  <div className="bofa-action-desc">Manage your account</div>
                </button>
              </div>

              <div className="bofa-card">
                <div className="bofa-card-header">
                  <h2 className="bofa-card-title">Recent Transactions</h2>
                </div>
                <div className="bofa-transaction-list">
                  {transactions.length === 0 ? (
                    <div style={{ padding: '48px 24px', textAlign: 'center', color: 'var(--bofa-gray-600)' }}>
                      No transactions yet
                    </div>
                  ) : (
                    transactions.slice().reverse().slice(0, 10).map((t, i) => (
                      <div key={i} className="bofa-transaction-item">
                        <div className="bofa-transaction-info">
                          <div className="bofa-transaction-desc">
                            {t.description || t.type.replace('_', ' ')}
                          </div>
                          <div className="bofa-transaction-date">
                            {new Date(t.date).toLocaleDateString('en-US', { 
                              month: 'short', 
                              day: 'numeric', 
                              year: 'numeric' 
                            })}
                          </div>
                        </div>
                        <div className="bofa-transaction-amount">
                          <div className={`bofa-amount-value ${
                            t.type.includes('in') || t.type === 'deposit' 
                              ? 'bofa-amount-positive' 
                              : 'bofa-amount-negative'
                          }`}>
                            {t.type.includes('in') || t.type === 'deposit' ? '+' : '-'}${(t.amount || 0).toFixed(2)}
                          </div>
                          <div className="bofa-amount-balance">${(t.balance || 0).toFixed(2)}</div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </>
          )}

          {activeTab === 'transfer' && (
            <>
              <div className="bofa-card">
                <div className="bofa-card-header">
                  <h2 className="bofa-card-title">Make a Transaction</h2>
                </div>
                <div className="bofa-card-content">
                  <div className="bofa-form-group">
                    <label className="bofa-label">Amount</label>
                    <input
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="bofa-input"
                      placeholder="0.00"
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
                    <button
                      onClick={deposit}
                      disabled={loading !== '' || !amount}
                      className="bofa-btn bofa-btn-primary"
                    >
                      {loading === 'deposit' ? 'Processing...' : 'Deposit'}
                    </button>
                    <button
                      onClick={withdraw}
                      disabled={loading !== '' || !amount || !taxCleared}
                      className="bofa-btn bofa-btn-secondary"
                    >
                      {loading === 'withdraw' ? 'Processing...' : 'Withdraw'}
                    </button>
                  </div>

                  <div style={{ borderTop: '1px solid var(--bofa-gray-200)', paddingTop: '24px' }}>
                    <div className="bofa-form-group">
                      <label className="bofa-label">Transfer to (Email)</label>
                      <input
                        type="email"
                        value={toEmail}
                        onChange={(e) => setToEmail(e.target.value)}
                        className="bofa-input"
                        placeholder="recipient@email.com"
                      />
                    </div>
                    <button
                      onClick={transfer}
                      disabled={loading !== '' || !amount || !toEmail || !taxCleared}
                      className="bofa-btn bofa-btn-primary"
                      style={{ width: '100%' }}
                    >
                      {loading === 'transfer' ? 'Processing...' : 'Transfer Money'}
                    </button>
                    {!taxCleared && (
                      <p style={{ fontSize: '12px', color: 'var(--bofa-red)', marginTop: '8px' }}>
                        ⚠️ Transfers and withdrawals blocked due to tax clearance
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="bofa-card">
                <div className="bofa-card-header">
                  <h2 className="bofa-card-title">Send Money with Zelle®</h2>
                </div>
                <div className="bofa-card-content">
                  <p style={{ color: 'var(--bofa-gray-600)', marginBottom: '24px' }}>
                    Send money to friends and family in minutes with just their email address.
                  </p>
                  
                  <div className="bofa-form-group">
                    <label className="bofa-label">Recipient Email</label>
                    <input
                      type="email"
                      value={zelleRecipient}
                      onChange={(e) => setZelleRecipient(e.target.value)}
                      className="bofa-input"
                      placeholder="recipient@email.com"
                    />
                  </div>
                  
                  <div className="bofa-form-group">
                    <label className="bofa-label">Amount</label>
                    <input
                      type="number"
                      value={zelleAmount}
                      onChange={(e) => setZelleAmount(e.target.value)}
                      className="bofa-input"
                      placeholder="0.00"
                    />
                  </div>
                  
                  <div className="bofa-form-group">
                    <label className="bofa-label">Message (Optional)</label>
                    <input
                      type="text"
                      value={zelleMessage}
                      onChange={(e) => setZelleMessage(e.target.value)}
                      className="bofa-input"
                      placeholder="What's this for?"
                    />
                  </div>
                  
                  <button
                    onClick={sendZelle}
                    disabled={loading !== '' || !zelleAmount || !zelleRecipient || !taxCleared}
                    className="bofa-btn bofa-btn-primary"
                    style={{ width: '100%' }}
                  >
                    {loading === 'zelle' ? 'Sending...' : 'Send with Zelle®'}
                  </button>
                  
                  {!taxCleared && (
                    <p style={{ fontSize: '12px', color: 'var(--bofa-red)', marginTop: '8px' }}>
                      ⚠️ Zelle blocked due to tax clearance
                    </p>
                  )}
                </div>
              </div>
            </>
          )}

          {activeTab === 'rewards' && (
            <div className="bofa-card">
              <div className="bofa-card-header">
                <h2 className="bofa-card-title">Rewards & Deals</h2>
              </div>
              <div className="bofa-card-content">
                <p style={{ color: 'var(--bofa-gray-600)', textAlign: 'center', padding: '48px 0' }}>
                  Rewards program coming soon! Earn points on every transaction.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <>
              <div className="bofa-card">
                <div className="bofa-card-header">
                  <h2 className="bofa-card-title">Account Information</h2>
                </div>
                <div className="bofa-card-content">
                  <div style={{ display: 'grid', gap: '16px' }}>
                    <div>
                      <div className="bofa-label">Account Number</div>
                      <div style={{ fontSize: '14px', color: 'var(--bofa-gray-900)' }}>{accountId}</div>
                    </div>
                    <div>
                      <div className="bofa-label">IBAN</div>
                      <div style={{ fontSize: '14px', color: 'var(--bofa-gray-900)' }}>{iban}</div>
                    </div>
                    <div>
                      <div className="bofa-label">Account Type</div>
                      <div style={{ fontSize: '14px', color: 'var(--bofa-gray-900)' }}>Checking Account</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bofa-card">
                <div className="bofa-card-header">
                  <h2 className="bofa-card-title">Security</h2>
                </div>
                <div className="bofa-card-content">
                  <button className="bofa-btn bofa-btn-secondary" disabled>
                    Change Password (Coming Soon)
                  </button>
                </div>
              </div>
            </>
          )}

          {showStatements && (
            <div className="bofa-card">
              <div className="bofa-card-header">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h2 className="bofa-card-title">Account Statements</h2>
                  <button onClick={() => setShowStatements(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px' }}>✕</button>
                </div>
              </div>
              <div className="bofa-card-content">
                <button 
                  onClick={downloadStatement}
                  className="bofa-action-btn"
                  style={{ width: '100%', textAlign: 'left' }}
                >
                  <div className="bofa-action-title">Current Statement</div>
                  <div className="bofa-action-desc">{new Date().toLocaleDateString()}</div>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
