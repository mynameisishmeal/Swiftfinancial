import React from 'react';

export default function ManageAccountsTab({ 
  accounts, 
  selectedAccount, 
  setSelectedAccount, 
  amount, 
  setAmount, 
  adjustBalance, 
  deleteAccount, 
  toggleTaxClearance, 
  changeRole, 
  assignToSelf, 
  userRole, 
  loading,
  updateUserDetails,
  userEmail
}: any) {
  const [isEditing, setIsEditing] = React.useState(false);
  const [editName, setEditName] = React.useState('');
  const [editEmail, setEditEmail] = React.useState('');
  const [editPassword, setEditPassword] = React.useState('');
  const [txType, setTxType] = React.useState('deposit');
  const [txAmount, setTxAmount] = React.useState('');
  const [txDescription, setTxDescription] = React.useState('');
  const [txCategory, setTxCategory] = React.useState('Other');
  const [editingTx, setEditingTx] = React.useState<number | null>(null);
  const [editBalance, setEditBalance] = React.useState('');
  const [editChecking, setEditChecking] = React.useState('');
  const [editSavings, setEditSavings] = React.useState('');
  const [editCredit, setEditCredit] = React.useState('');
  const [editFico, setEditFico] = React.useState('');
  const [editRewards, setEditRewards] = React.useState('');
  const [editDaily, setEditDaily] = React.useState('');
  const [editMonthly, setEditMonthly] = React.useState('');
  const [editInterest, setEditInterest] = React.useState('');
  const [showFinancials, setShowFinancials] = React.useState(false);
  const [editAvatar, setEditAvatar] = React.useState('');
  const [editIban, setEditIban] = React.useState('');
  const [editCardExpiry, setEditCardExpiry] = React.useState('');
  const [editTxType, setEditTxType] = React.useState('');
  const [editTxAmount, setEditTxAmount] = React.useState('');
  const [editTxDescription, setEditTxDescription] = React.useState('');
  const [editTxCategory, setEditTxCategory] = React.useState('');
  const [editTxDate, setEditTxDate] = React.useState('');

  React.useEffect(() => {
    if (selectedAccount) {
      setEditName(selectedAccount.name || '');
      setEditEmail(selectedAccount.email || '');
      setEditPassword(selectedAccount.password || '');
      setIsEditing(false);
      setEditBalance(selectedAccount.balance?.toString() || '0');
      setEditChecking(selectedAccount.checkingBalance?.toString() || '0');
      setEditSavings(selectedAccount.savingsBalance?.toString() || '0');
      setEditCredit(selectedAccount.creditLimit?.toString() || '0');
      setEditFico(selectedAccount.ficoScore?.toString() || '0');
      setEditRewards(selectedAccount.rewardsPoints?.toString() || '0');
      setEditDaily(selectedAccount.dailyLimit?.toString() || '0');
      setEditMonthly(selectedAccount.monthlyLimit?.toString() || '0');
      setEditInterest(selectedAccount.interestRate?.toString() || '0');
      setEditAvatar(selectedAccount.avatar || '');
      setEditIban(selectedAccount.iban || '');
      setEditCardExpiry(selectedAccount.cardExpiry || '');
    }
  }, [selectedAccount]);

  const handleSaveEdit = async () => {
    if (!selectedAccount) return;
    await updateUserDetails(selectedAccount.accountId, editName, editEmail, editPassword);
    
    const res = await fetch('/api/admin/modify-user', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        accountId: selectedAccount.accountId,
        adminEmail: userEmail,
        updates: {
          avatar: editAvatar,
          iban: editIban,
          cardExpiry: editCardExpiry
        }
      }),
    });
    
    setIsEditing(false);
    window.location.reload();
  };

  const handleCancelEdit = () => {
    setEditName(selectedAccount?.name || '');
    setEditEmail(selectedAccount?.email || '');
    setEditPassword(selectedAccount?.password || '');
    setEditAvatar(selectedAccount?.avatar || '');
    setEditIban(selectedAccount?.iban || '');
    setEditCardExpiry(selectedAccount?.cardExpiry || '');
    setIsEditing(false);
  };

  const handleInsertTransaction = async () => {
    if (!selectedAccount || !txAmount || !txDescription) return;
    const res = await fetch('/api/admin/insert-transaction', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        accountId: selectedAccount.accountId, 
        adminEmail: userEmail,
        type: txType,
        amount: txAmount,
        description: txDescription,
        category: txCategory
      }),
    });
    const data = await res.json();
    alert(data.message);
    setTxAmount('');
    setTxDescription('');
    setTxCategory('Other');
    window.location.reload();
  };

  const handleModifyFinancials = async () => {
    if (!selectedAccount) return;
    const res = await fetch('/api/admin/modify-user', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        accountId: selectedAccount.accountId,
        adminEmail: userEmail,
        updates: {
          balance: editBalance,
          checkingBalance: editChecking,
          savingsBalance: editSavings,
          creditLimit: editCredit,
          ficoScore: editFico,
          rewardsPoints: editRewards,
          dailyLimit: editDaily,
          monthlyLimit: editMonthly,
          interestRate: editInterest
        }
      }),
    });
    const data = await res.json();
    alert(data.message);
    setShowFinancials(false);
    window.location.reload();
  };

  const handleDeleteTransaction = async (index: number) => {
    if (!selectedAccount || !confirm('Delete this transaction?')) return;
    const res = await fetch('/api/admin/modify-transaction', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        accountId: selectedAccount.accountId,
        adminEmail: userEmail,
        action: 'delete',
        transactionIndex: index
      }),
    });
    const data = await res.json();
    alert(data.message);
    window.location.reload();
  };

  const handleEditTransaction = async (index: number) => {
    if (!selectedAccount) return;
    const res = await fetch('/api/admin/modify-transaction', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        accountId: selectedAccount.accountId,
        adminEmail: userEmail,
        action: 'edit',
        transactionIndex: index,
        updates: {
          type: editTxType,
          amount: editTxAmount,
          description: editTxDescription,
          category: editTxCategory,
          date: editTxDate
        }
      }),
    });
    const data = await res.json();
    alert(data.message);
    setEditingTx(null);
    window.location.reload();
  };

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditAvatar(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <>
      <style jsx>{`
        .card {
          background: white;
          border-radius: 12px;
          box-shadow: 0 4px 6px rgba(0,0,0,0.05);
          overflow: hidden;
        }

        .card-header {
          padding: 20px 24px;
          border-bottom: 1px solid #e5e7eb;
        }

        .card-title {
          font-size: 18px;
          font-weight: 700;
          color: #111827;
        }

        .card-content {
          padding: 24px;
        }

        .account-item {
          border: 1px solid #e5e7eb;
          padding: 16px;
          margin-bottom: 12px;
          cursor: pointer;
          border-radius: 8px;
          transition: all 0.2s;
          box-sizing: border-box;
        }

        .account-item:hover {
          border-color: #E31837;
          box-shadow: 0 2px 8px rgba(227, 24, 55, 0.1);
        }

        .account-item.selected {
          border-color: #E31837;
          background: #fef2f2;
        }

        .input {
          width: 100%;
          padding: 12px;
          border: 2px solid #e5e7eb;
          border-radius: 8px;
          font-size: 14px;
          outline: none;
        }

        .input:focus {
          border-color: #E31837;
        }

        .label {
          display: block;
          font-size: 13px;
          font-weight: 600;
          color: #111827;
          margin-bottom: 8px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .btn {
          padding: 12px 24px;
          border-radius: 8px;
          border: none;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .btn-primary {
          background: #E31837;
          color: white;
        }

        .btn-primary:hover {
          background: #c41530;
        }

        .btn-secondary {
          background: #f3f4f6;
          color: #111827;
        }

        .btn-secondary:hover {
          background: #e5e7eb;
        }

        .btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
      `}</style>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '24px' }}>
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">All Accounts ({accounts.length})</h2>
          </div>
          <div className="card-content" style={{ maxHeight: '600px', overflowY: 'auto', padding: '16px' }}>
            {loading ? (
              <p style={{ textAlign: 'center', padding: '32px', color: '#6b7280' }}>Loading...</p>
            ) : (
              accounts.map((acc: any) => (
                <div 
                  key={acc.accountId} 
                  onClick={() => setSelectedAccount(acc)}
                  className={`account-item ${selectedAccount?.accountId === acc.accountId ? 'selected' : ''}`}
                >
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <div>
                      <p style={{ fontWeight: '600', color: '#111827', marginBottom: '4px', wordBreak: 'break-word' }}>{acc.name}</p>
                      <p style={{ fontSize: '12px', color: '#6b7280', marginBottom: '2px', wordBreak: 'break-all' }}>
                        <span style={{ fontWeight: '600' }}>Email:</span> {acc.email}
                      </p>
                      <p style={{ fontSize: '12px', color: '#6b7280', marginBottom: '2px', wordBreak: 'break-all' }}>
                        <span style={{ fontWeight: '600' }}>Password:</span> <span style={{ fontFamily: 'monospace', background: '#fff', padding: '2px 6px', borderRadius: '3px', border: '1px solid #e5e7eb' }}>{acc.password || 'N/A'}</span>
                      </p>
                      <p style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px', wordBreak: 'break-all' }}>
                        <span style={{ fontWeight: '600' }}>Account:</span> {acc.accountId}
                      </p>
                      <span style={{
                        fontSize: '11px',
                        padding: '2px 8px',
                        borderRadius: '4px',
                        display: 'inline-block',
                        background: acc.role === 'superadmin' ? '#f3e8ff' : acc.role === 'admin' ? '#dbeafe' : '#f3f4f6',
                        color: acc.role === 'superadmin' ? '#7c3aed' : acc.role === 'admin' ? '#1e40af' : '#6b7280'
                      }}>
                        {(acc.role || 'user').toUpperCase()}
                      </span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <p style={{ fontSize: '18px', fontWeight: '600', color: '#111827' }}>
                        ${(acc.balance || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </p>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <p style={{ fontSize: '12px', color: acc.taxCleared ? '#10b981' : '#ef4444' }}>
                          Tax: {acc.taxCleared ? '✓' : '⚠'}
                        </p>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteAccount(acc.accountId);
                          }}
                          style={{ fontSize: '12px', color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Manage Account</h2>
          </div>
          <div className="card-content">
            {selectedAccount ? (
              <div>
                <div style={{ background: '#f9fafb', padding: '16px', border: '1px solid #e5e7eb', marginBottom: '16px', borderRadius: '8px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <p className="label" style={{ marginBottom: 0 }}>SELECTED ACCOUNT DETAILS</p>
                    {!isEditing ? (
                      <button
                        onClick={() => setIsEditing(true)}
                        style={{ padding: '6px 12px', background: '#0055C4', color: 'white', border: 'none', borderRadius: '6px', fontSize: '12px', fontWeight: '600', cursor: 'pointer' }}
                      >
                        EDIT
                      </button>
                    ) : (
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                          onClick={handleSaveEdit}
                          style={{ padding: '6px 12px', background: '#10b981', color: 'white', border: 'none', borderRadius: '6px', fontSize: '12px', fontWeight: '600', cursor: 'pointer' }}
                        >
                          SAVE
                        </button>
                        <button
                          onClick={handleCancelEdit}
                          style={{ padding: '6px 12px', background: '#6b7280', color: 'white', border: 'none', borderRadius: '6px', fontSize: '12px', fontWeight: '600', cursor: 'pointer' }}
                        >
                          CANCEL
                        </button>
                      </div>
                    )}
                  </div>
                  <div style={{ marginTop: '12px', display: 'grid', gap: '12px' }}>
                    <div>
                      <p style={{ fontSize: '11px', color: '#6b7280', textTransform: 'uppercase', fontWeight: '600', marginBottom: '4px' }}>Avatar</p>
                      {isEditing ? (
                        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                          {editAvatar && <img src={editAvatar} alt="Avatar" style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover' }} />}
                          <input type="file" accept="image/*" onChange={handleAvatarUpload} style={{ fontSize: '12px' }} />
                        </div>
                      ) : (
                        selectedAccount.avatar ? <img src={selectedAccount.avatar} alt="Avatar" style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover' }} /> : <p style={{ fontSize: '13px', color: '#6b7280' }}>No avatar</p>
                      )}
                    </div>
                    <div>
                      <p style={{ fontSize: '11px', color: '#6b7280', textTransform: 'uppercase', fontWeight: '600', marginBottom: '4px' }}>Full Name</p>
                      {isEditing ? (
                        <input
                          type="text"
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          className="input"
                          style={{ fontSize: '14px', padding: '8px' }}
                        />
                      ) : (
                        <p style={{ fontSize: '14px', fontWeight: '600', color: '#111827' }}>{selectedAccount.name}</p>
                      )}
                    </div>
                    <div>
                      <p style={{ fontSize: '11px', color: '#6b7280', textTransform: 'uppercase', fontWeight: '600', marginBottom: '4px' }}>Email</p>
                      {isEditing ? (
                        <input
                          type="email"
                          value={editEmail}
                          onChange={(e) => setEditEmail(e.target.value)}
                          className="input"
                          style={{ fontSize: '13px', padding: '8px' }}
                        />
                      ) : (
                        <p style={{ fontSize: '13px', color: '#111827', wordBreak: 'break-all' }}>{selectedAccount.email}</p>
                      )}
                    </div>
                    <div>
                      <p style={{ fontSize: '11px', color: '#6b7280', textTransform: 'uppercase', fontWeight: '600', marginBottom: '4px' }}>Phone</p>
                      {isEditing ? (
                        <input
                          type="tel"
                          value={selectedAccount.phone || ''}
                          onChange={async (e) => {
                            const newPhone = e.target.value;
                            const res = await fetch('/api/admin/modify-user', {
                              method: 'POST',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({
                                accountId: selectedAccount.accountId,
                                adminEmail: userEmail,
                                updates: { phone: newPhone }
                              }),
                            });
                            if (res.ok) {
                              selectedAccount.phone = newPhone;
                            }
                          }}
                          className="input"
                          style={{ fontSize: '13px', padding: '8px' }}
                          placeholder="+1234567890"
                        />
                      ) : (
                        <p style={{ fontSize: '13px', color: '#111827' }}>{selectedAccount.phone || 'N/A'}</p>
                      )}
                    </div>
                    <div>
                      <p style={{ fontSize: '11px', color: '#6b7280', textTransform: 'uppercase', fontWeight: '600', marginBottom: '4px' }}>Password</p>
                      {isEditing ? (
                        <input
                          type="text"
                          value={editPassword}
                          onChange={(e) => setEditPassword(e.target.value)}
                          className="input"
                          style={{ fontSize: '13px', padding: '8px', fontFamily: 'monospace' }}
                        />
                      ) : (
                        <p style={{ fontSize: '13px', color: '#111827', fontFamily: 'monospace', background: '#fff', padding: '8px', borderRadius: '4px', border: '1px solid #e5e7eb' }}>{selectedAccount.password || 'N/A'}</p>
                      )}
                    </div>
                    <div>
                      <p style={{ fontSize: '11px', color: '#6b7280', textTransform: 'uppercase', fontWeight: '600', marginBottom: '4px' }}>Transaction PIN</p>
                      <p style={{ fontSize: '20px', color: '#111827', fontFamily: 'monospace', background: '#fef9c3', padding: '8px 12px', borderRadius: '4px', border: '1px solid #fde047', letterSpacing: '6px', display: 'inline-block' }}>
                        {selectedAccount.transactionPin || selectedAccount.pin || <span style={{ fontSize: '13px', letterSpacing: 'normal', color: '#9ca3af' }}>Not set</span>}
                      </p>
                    </div>
                    <div>
                      <p style={{ fontSize: '11px', color: '#6b7280', textTransform: 'uppercase', fontWeight: '600' }}>Account Number</p>
                      <p style={{ fontSize: '13px', color: '#111827', fontFamily: 'monospace' }}>{selectedAccount.accountId}</p>
                    </div>
                    <div>
                      <p style={{ fontSize: '11px', color: '#6b7280', textTransform: 'uppercase', fontWeight: '600', marginBottom: '4px' }}>IBAN</p>
                      {isEditing ? (
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <input
                            type="text"
                            value={editIban}
                            onChange={(e) => setEditIban(e.target.value)}
                            className="input"
                            style={{ fontSize: '13px', padding: '8px', fontFamily: 'monospace' }}
                            placeholder="GB00XXXX00000000000000"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const num = Math.floor(10 + Math.random() * 89).toString() + Date.now().toString().slice(-14);
                              setEditIban('US' + num);
                            }}
                            style={{ padding: '8px 12px', background: '#0055C4', color: 'white', border: 'none', borderRadius: '6px', fontSize: '12px', fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap' }}
                          >
                            GEN
                          </button>
                        </div>
                      ) : (
                        <p style={{ fontSize: '13px', color: '#111827', fontFamily: 'monospace' }}>{selectedAccount.iban || 'N/A'}</p>
                      )}
                    </div>
                    <div>
                      <p style={{ fontSize: '11px', color: '#6b7280', textTransform: 'uppercase', fontWeight: '600', marginBottom: '4px' }}>Card Expiry</p>
                      {isEditing ? (
                        <input
                          type="text"
                          value={editCardExpiry}
                          onChange={(e) => setEditCardExpiry(e.target.value)}
                          className="input"
                          style={{ fontSize: '13px', padding: '8px' }}
                          placeholder="12/28"
                        />
                      ) : (
                        <p style={{ fontSize: '13px', color: '#111827' }}>{selectedAccount.cardExpiry || 'N/A'}</p>
                      )}
                    </div>
                    <div>
                      <p style={{ fontSize: '11px', color: '#6b7280', textTransform: 'uppercase', fontWeight: '600' }}>Balance</p>
                      <p style={{ fontSize: '18px', fontWeight: '600', color: '#111827' }}>
                        ${(selectedAccount.balance || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </p>
                    </div>
                  </div>
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <label className="label">UPDATE PASSWORD</label>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <input
                      type="text"
                      value={editPassword}
                      onChange={(e) => setEditPassword(e.target.value)}
                      className="input"
                      placeholder="New password"
                      style={{ fontFamily: 'monospace', fontSize: '13px' }}
                    />
                    <button
                      onClick={async () => {
                        if (!editPassword.trim()) return;
                        await updateUserDetails(selectedAccount.accountId, selectedAccount.name, selectedAccount.email, editPassword);
                      }}
                      disabled={!editPassword.trim()}
                      className="btn"
                      style={{ background: '#0055C4', color: 'white', whiteSpace: 'nowrap', padding: '12px 16px' }}
                    >
                      SAVE
                    </button>
                  </div>
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <label className="label">AMOUNT</label>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="input"
                    placeholder="0.00"
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
                  <button
                    onClick={() => adjustBalance('add')}
                    disabled={!amount}
                    className="btn"
                    style={{ background: '#10b981', color: 'white' }}
                  >
                    ADD FUNDS
                  </button>
                  <button
                    onClick={() => adjustBalance('deduct')}
                    disabled={!amount}
                    className="btn btn-primary"
                  >
                    DEDUCT FUNDS
                  </button>
                </div>

                {userRole === 'superadmin' && (
                  <button
                    onClick={assignToSelf}
                    className="btn"
                    style={{ width: '100%', background: '#0055C4', color: 'white', marginBottom: '16px' }}
                  >
                    ASSIGN TO ME
                  </button>
                )}

                {selectedAccount.role === 'user' && (
                  <>
                    <div style={{ paddingTop: '16px', borderTop: '1px solid #e5e7eb', marginBottom: '16px' }}>
                      <p className="label">OTP MANAGEMENT</p>
                      <div style={{ background: '#f9fafb', padding: '12px', borderRadius: '6px', marginBottom: '12px' }}>
                        <p style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Phone: {selectedAccount.phone || 'No phone number'}</p>
                        <p style={{ fontSize: '12px', color: '#6b7280' }}>Status: {selectedAccount.otpVerified ? '✓ Verified' : 'Not verified'}</p>
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                        <button
                          onClick={async () => {
                            const res = await fetch('/api/admin/send-otp', {
                              method: 'POST',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({
                                action: 'generate',
                                adminEmail: userEmail,
                                userEmail: selectedAccount.email
                              }),
                            });
                            const data = await res.json();
                            alert(`OTP Generated: ${data.otp}\nPhone: ${data.phone}\nExpires in: ${data.expiresIn}`);
                          }}
                          className="btn"
                          style={{ background: '#0055C4', color: 'white', fontSize: '12px', padding: '8px' }}
                        >
                          GENERATE OTP
                        </button>
                        <button
                          onClick={async () => {
                            const res = await fetch('/api/admin/send-otp', {
                              method: 'POST',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({
                                action: 'clear',
                                adminEmail: userEmail,
                                userEmail: selectedAccount.email
                              }),
                            });
                            const data = await res.json();
                            alert(data.message);
                          }}
                          className="btn"
                          style={{ background: '#6b7280', color: 'white', fontSize: '12px', padding: '8px' }}
                        >
                          CLEAR OTP
                        </button>
                      </div>
                    </div>

                    <div style={{ paddingTop: '16px', borderTop: '1px solid #e5e7eb', marginBottom: '16px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                        <p className="label" style={{ marginBottom: 0 }}>FINANCIAL DETAILS</p>
                        <button
                          onClick={() => setShowFinancials(!showFinancials)}
                          style={{ padding: '6px 12px', background: '#0055C4', color: 'white', border: 'none', borderRadius: '6px', fontSize: '12px', fontWeight: '600', cursor: 'pointer' }}
                        >
                          {showFinancials ? 'HIDE' : 'EDIT'}
                        </button>
                      </div>
                      {showFinancials && (
                        <div style={{ display: 'grid', gap: '12px', marginTop: '12px' }}>
                          <input type="number" value={editBalance} onChange={(e) => setEditBalance(e.target.value)} className="input" placeholder="Balance" />
                          <input type="number" value={editChecking} onChange={(e) => setEditChecking(e.target.value)} className="input" placeholder="Checking Balance" />
                          <input type="number" value={editSavings} onChange={(e) => setEditSavings(e.target.value)} className="input" placeholder="Savings Balance" />
                          <input type="number" value={editCredit} onChange={(e) => setEditCredit(e.target.value)} className="input" placeholder="Credit Limit" />
                          <input type="number" value={editFico} onChange={(e) => setEditFico(e.target.value)} className="input" placeholder="FICO Score" />
                          <input type="number" value={editRewards} onChange={(e) => setEditRewards(e.target.value)} className="input" placeholder="Rewards Points" />
                          <input type="number" value={editDaily} onChange={(e) => setEditDaily(e.target.value)} className="input" placeholder="Daily Limit" />
                          <input type="number" value={editMonthly} onChange={(e) => setEditMonthly(e.target.value)} className="input" placeholder="Monthly Limit" />
                          <input type="number" value={editInterest} onChange={(e) => setEditInterest(e.target.value)} className="input" placeholder="Interest Rate" step="0.01" />
                          <button onClick={handleModifyFinancials} className="btn" style={{ background: '#10b981', color: 'white' }}>SAVE CHANGES</button>
                        </div>
                      )}
                    </div>

                    <div style={{ paddingTop: '16px', borderTop: '1px solid #e5e7eb', marginBottom: '16px' }}>
                      <p className="label">TRANSACTION HISTORY</p>
                      <div style={{ maxHeight: '300px', overflowY: 'auto', marginBottom: '12px' }}>
                        {(selectedAccount.transactions || []).map((tx: any, i: number) => (
                          <div key={i} style={{ padding: '12px', border: '1px solid #e5e7eb', borderRadius: '6px', marginBottom: '8px', background: editingTx === i ? '#fff3cd' : '#f9fafb' }}>
                            {editingTx === i ? (
                              <div style={{ display: 'grid', gap: '8px' }}>
                                <select value={editTxType} onChange={(e) => setEditTxType(e.target.value)} className="input" style={{ padding: '6px', fontSize: '12px' }}>
                                  <option value="deposit">Deposit</option>
                                  <option value="withdrawal">Withdrawal</option>
                                </select>
                                <input type="number" value={editTxAmount} onChange={(e) => setEditTxAmount(e.target.value)} className="input" style={{ padding: '6px', fontSize: '12px' }} placeholder="Amount" />
                                <input type="text" value={editTxDescription} onChange={(e) => setEditTxDescription(e.target.value)} className="input" style={{ padding: '6px', fontSize: '12px' }} placeholder="Description" />
                                <input type="text" value={editTxCategory} onChange={(e) => setEditTxCategory(e.target.value)} className="input" style={{ padding: '6px', fontSize: '12px' }} placeholder="Category" />
                                <input type="datetime-local" value={editTxDate} onChange={(e) => setEditTxDate(e.target.value)} className="input" style={{ padding: '6px', fontSize: '12px' }} />
                                <div style={{ display: 'flex', gap: '8px' }}>
                                  <button onClick={() => handleEditTransaction(i)} style={{ flex: 1, padding: '6px', background: '#10b981', color: 'white', border: 'none', borderRadius: '4px', fontSize: '11px', cursor: 'pointer' }}>SAVE</button>
                                  <button onClick={() => setEditingTx(null)} style={{ flex: 1, padding: '6px', background: '#6b7280', color: 'white', border: 'none', borderRadius: '4px', fontSize: '11px', cursor: 'pointer' }}>CANCEL</button>
                                </div>
                              </div>
                            ) : (
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                  <p style={{ fontSize: '13px', fontWeight: '600', color: '#111827' }}>{tx.description}</p>
                                  <p style={{ fontSize: '11px', color: '#6b7280' }}>{tx.type} • ${tx.amount} • {tx.category || 'N/A'}</p>
                                  <p style={{ fontSize: '10px', color: '#9ca3af' }}>{new Date(tx.date).toLocaleString()}</p>
                                </div>
                                <div style={{ display: 'flex', gap: '4px' }}>
                                  <button
                                    onClick={() => {
                                      setEditingTx(i);
                                      setEditTxType(tx.type);
                                      setEditTxAmount(tx.amount.toString());
                                      setEditTxDescription(tx.description);
                                      setEditTxCategory(tx.category || '');
                                      setEditTxDate(new Date(tx.date).toISOString().slice(0, 16));
                                    }}
                                    style={{ padding: '4px 8px', background: '#0055C4', color: 'white', border: 'none', borderRadius: '4px', fontSize: '11px', cursor: 'pointer' }}
                                  >
                                    EDIT
                                  </button>
                                  <button
                                    onClick={() => handleDeleteTransaction(i)}
                                    style={{ padding: '4px 8px', background: '#ef4444', color: 'white', border: 'none', borderRadius: '4px', fontSize: '11px', cursor: 'pointer' }}
                                  >
                                    DELETE
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div style={{ paddingTop: '16px', borderTop: '1px solid #e5e7eb', marginBottom: '16px' }}>
                      <p className="label">REGENERATE MOCK HISTORY</p>
                      <div style={{ display: 'grid', gap: '10px' }}>
                        <select id="regenProfile" className="input" defaultValue="corporate">
                          <option value="military">Military Personnel</option>
                          <option value="corporate">Corporate Employee (9-5)</option>
                          <option value="freelancer">Freelancer/Contractor</option>
                          <option value="student">Student</option>
                          <option value="retiree">Retiree</option>
                          <option value="business_owner">Business Owner</option>
                          <option value="healthcare">Healthcare Worker</option>
                          <option value="tech_worker">Tech Worker</option>
                        </select>
                        <select id="regenLifestyle" className="input" defaultValue="moderate">
                          <option value="frugal">Frugal (70% spending)</option>
                          <option value="moderate">Moderate (100% spending)</option>
                          <option value="luxury">Luxury (150% spending)</option>
                        </select>
                        <select id="regenLocation" className="input" defaultValue="domestic">
                          <option value="domestic">Domestic</option>
                          <option value="international">International</option>
                          <option value="deployed">Deployed/Remote</option>
                        </select>
                        <input id="regenAmount" type="number" className="input" placeholder="Total amount (e.g. 100000)" />
                        <select id="regenTimeframe" className="input" defaultValue="1year">
                          <option value="1month">1 Month</option>
                          <option value="6months">6 Months</option>
                          <option value="1year">1 Year</option>
                          <option value="2years">2 Years</option>
                          <option value="3years">3 Years</option>
                          <option value="4years">4 Years</option>
                          <option value="5years">5 Years</option>
                          <option value="6years">6 Years</option>
                        </select>
                        <button
                          onClick={async () => {
                            const amount = parseFloat((document.getElementById('regenAmount') as HTMLInputElement)?.value);
                            if (!amount || amount <= 0) { alert('Enter a valid amount'); return; }
                            if (!confirm('This will REPLACE all existing transactions. Continue?')) return;
                            const res = await fetch('/api/admin/regen-history', {
                              method: 'POST',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({
                                accountId: selectedAccount.accountId,
                                adminEmail: userEmail,
                                mockHistory: {
                                  totalAmount: amount,
                                  timeframe: (document.getElementById('regenTimeframe') as HTMLSelectElement)?.value || '1year',
                                  profile: (document.getElementById('regenProfile') as HTMLSelectElement)?.value || 'corporate',
                                  lifestyle: (document.getElementById('regenLifestyle') as HTMLSelectElement)?.value || 'moderate',
                                  location: (document.getElementById('regenLocation') as HTMLSelectElement)?.value || 'domestic',
                                  intelligent: true
                                }
                              }),
                            });
                            const data = await res.json();
                            alert(data.message);
                            if (res.ok) window.location.reload();
                          }}
                          className="btn"
                          style={{ background: '#7c3aed', color: 'white' }}
                        >
                          REGENERATE HISTORY
                        </button>
                      </div>
                    </div>

                    <div style={{ paddingTop: '16px', borderTop: '1px solid #e5e7eb', marginBottom: '16px' }}>
                      <p className="label">INSERT TRANSACTION</p>
                      <div style={{ display: 'grid', gap: '12px' }}>
                        <div>
                          <select value={txType} onChange={(e) => setTxType(e.target.value)} className="input">
                            <option value="deposit">Deposit</option>
                            <option value="withdrawal">Withdrawal</option>
                          </select>
                        </div>
                        <div>
                          <input
                            type="number"
                            value={txAmount}
                            onChange={(e) => setTxAmount(e.target.value)}
                            className="input"
                            placeholder="Amount"
                          />
                        </div>
                        <div>
                          <input
                            type="text"
                            value={txDescription}
                            onChange={(e) => setTxDescription(e.target.value)}
                            className="input"
                            placeholder="Description"
                          />
                        </div>
                        <div>
                          <select value={txCategory} onChange={(e) => setTxCategory(e.target.value)} className="input">
                            <option>Other</option>
                            <option>Income</option>
                            <option>Groceries</option>
                            <option>Dining</option>
                            <option>Shopping</option>
                            <option>Utilities</option>
                            <option>Transportation</option>
                            <option>Entertainment</option>
                            <option>Healthcare</option>
                            <option>Transfer</option>
                          </select>
                        </div>
                        <button
                          onClick={handleInsertTransaction}
                          disabled={!txAmount || !txDescription}
                          className="btn btn-primary"
                          style={{ width: '100%' }}
                        >
                          INSERT TRANSACTION
                        </button>
                      </div>
                    </div>
                  </>
                )}

                {userRole === 'superadmin' && (
                  <div style={{ paddingTop: '16px', borderTop: '1px solid #e5e7eb', marginBottom: '16px' }}>
                    <p className="label">USER ROLE</p>
                    <p style={{ fontSize: '14px', color: '#111827', marginBottom: '12px' }}>
                      Current: <span style={{ fontWeight: '600', textTransform: 'capitalize' }}>{selectedAccount.role || 'user'}</span>
                    </p>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                      <button
                        onClick={() => changeRole('user')}
                        disabled={selectedAccount.role === 'user'}
                        className="btn btn-secondary"
                        style={{ fontSize: '12px', padding: '8px' }}
                      >
                        USER
                      </button>
                      <button
                        onClick={() => changeRole('admin')}
                        disabled={selectedAccount.role === 'admin'}
                        className="btn"
                        style={{ fontSize: '12px', padding: '8px', background: '#0055C4', color: 'white' }}
                      >
                        ADMIN
                      </button>
                      <button
                        onClick={() => changeRole('superadmin')}
                        disabled={selectedAccount.role === 'superadmin'}
                        className="btn"
                        style={{ fontSize: '12px', padding: '8px', background: '#7c3aed', color: 'white' }}
                      >
                        SUPER
                      </button>
                    </div>
                  </div>
                )}

                <div style={{ paddingTop: '16px', borderTop: '1px solid #e5e7eb' }}>
                  <p className="label">TAX CLEARANCE</p>
                  <button
                    onClick={toggleTaxClearance}
                    className="btn"
                    style={{ width: '100%', background: selectedAccount.taxCleared ? '#d97706' : '#10b981', color: 'white' }}
                  >
                    {selectedAccount.taxCleared ? 'MARK AS PENDING' : 'CLEAR TAX STATUS'}
                  </button>
                  <p style={{ fontSize: '12px', marginTop: '8px', color: selectedAccount.taxCleared ? '#10b981' : '#ef4444' }}>
                    Status: {selectedAccount.taxCleared ? '✓ Cleared' : '⚠ Pending'}
                  </p>
                </div>
              </div>
            ) : (
              <p style={{ textAlign: 'center', padding: '32px', color: '#6b7280' }}>Select an account to manage</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
