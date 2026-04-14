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
  loading 
}: any) {
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
                      <p style={{ fontSize: '12px', color: '#6b7280', marginBottom: '2px', wordBreak: 'break-all' }}>{acc.email}</p>
                      <p style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px', wordBreak: 'break-all' }}>{acc.accountId}</p>
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
                  <p className="label">SELECTED ACCOUNT</p>
                  <p style={{ fontSize: '14px', fontWeight: '600', color: '#111827', marginTop: '8px' }}>{selectedAccount.name}</p>
                  <p style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>{selectedAccount.email}</p>
                  <p style={{ fontSize: '18px', fontWeight: '600', color: '#111827', marginTop: '12px' }}>
                    ${(selectedAccount.balance || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </p>
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

                <button
                  onClick={assignToSelf}
                  className="btn"
                  style={{ width: '100%', background: '#0055C4', color: 'white', marginBottom: '16px' }}
                >
                  ASSIGN TO ME
                </button>

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
