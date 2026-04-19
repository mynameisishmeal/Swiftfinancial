export default function CreateAccountTab({ 
  googleVerified, 
  googleEmail, 
  verifyWithGoogle, 
  signOutGoogle, 
  userEmail, 
  userRole, 
  setFormError, 
  setMessage, 
  loadAllAccounts,
  claimIdentifier,
  setClaimIdentifier,
  claimUser
}: any) {
  return (
    <>
      <style jsx>{`
        .card {
          background: white;
          border-radius: 12px;
          margin-bottom: 24px;
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
        }

        .btn-primary {
          background: #E31837;
          color: white;
        }

        .btn-primary:hover {
          background: #c41530;
        }

        .form-group {
          margin-bottom: 16px;
        }
      `}</style>

      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Claim User to Manage</h3>
        </div>
        <div className="card-content">
          <div style={{ display: 'flex', gap: '12px', marginBottom: '8px' }}>
            <input
              type="text"
              value={claimIdentifier}
              onChange={(e) => setClaimIdentifier(e.target.value)}
              placeholder="Enter Account Number or Email"
              className="input"
              style={{ flex: 1 }}
            />
            <button
              onClick={() => {
                claimUser(claimIdentifier);
                setClaimIdentifier('');
              }}
              disabled={!claimIdentifier}
              className="btn btn-primary"
            >
              CLAIM USER
            </button>
          </div>
          <p style={{ fontSize: '12px', color: '#6b7280' }}>Assign a user to yourself by their account number or email</p>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Create New Account</h3>
        </div>
        <div className="card-content">
          {!googleVerified ? (
            <div style={{ textAlign: 'center', padding: '32px 0' }}>
              <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '24px' }}>Verify your admin identity with Google to create accounts</p>
              <button
                onClick={verifyWithGoogle}
                className="btn"
                style={{ background: '#4285f4', color: 'white', display: 'inline-flex', alignItems: 'center', gap: '12px', padding: '12px 24px' }}
              >
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z" fill="#4285F4"/>
                  <path d="M9.003 18c2.43 0 4.467-.806 5.956-2.18L12.05 13.56c-.806.54-1.836.86-3.047.86-2.344 0-4.328-1.584-5.036-3.711H.96v2.332C2.44 15.983 5.485 18 9.003 18z" fill="#34A853"/>
                  <path d="M3.964 10.712c-.18-.54-.282-1.117-.282-1.71 0-.593.102-1.17.282-1.71V4.96H.957C.347 6.175 0 7.55 0 9.002c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
                  <path d="M9.003 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.464.891 11.426 0 9.003 0 5.485 0 2.44 2.017.96 4.958L3.967 7.29c.708-2.127 2.692-3.71 5.036-3.71z" fill="#EA4335"/>
                </svg>
                Sign in with Google
              </button>
            </div>
          ) : (
            <div>
              <div style={{ background: '#f0fdf4', border: '1px solid #86efac', padding: '12px', marginBottom: '16px', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <p style={{ fontSize: '13px', color: '#15803d', fontWeight: '600' }}>✓ Verified as Admin</p>
                  <p style={{ fontSize: '12px', color: '#16a34a', marginTop: '2px' }}>{googleEmail}</p>
                </div>
                <button onClick={signOutGoogle} style={{ fontSize: '12px', color: '#dc2626', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}>Sign Out</button>
              </div>
              <form id="create-account-form" onSubmit={async (e) => {
                e.preventDefault();
                setFormError('');
                const formData = new FormData(e.currentTarget);
                const accountRole = formData.get('accountRole') as string;
                const wantMockHistory = formData.get('wantMockHistory') === 'on';
                const mockAmount = parseFloat(formData.get('mockAmount') as string) || 0;
                const mockTimeframe = formData.get('mockTimeframe') as string;
                
                const res = await fetch('/api/admin/create-account', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    adminEmail: userEmail,
                    name: accountRole === 'admin' ? formData.get('email')?.toString().split('@')[0] : formData.get('name'),
                    email: formData.get('email'),
                    password: formData.get('password'),
                    initialAmount: accountRole === 'admin' ? 0 : (wantMockHistory ? 0 : parseFloat(formData.get('amount') as string) || 0),
                    role: accountRole,
                    userLimit: accountRole === 'admin' ? Math.max(1, parseInt(formData.get('userLimit') as string) || 1) : undefined,
                    mockHistory: wantMockHistory && mockAmount > 0 ? {
                      totalAmount: mockAmount,
                      timeframe: mockTimeframe
                    } : null
                  }),
                });
                const data = await res.json();
                if (!res.ok) {
                  setFormError(data.message || 'Failed to create account');
                  setMessage('');
                  return;
                }
                setFormError('');
                setMessage(data.message);
                if (res.ok) {
                  e.currentTarget.reset();
                  await loadAllAccounts();
                }
                setTimeout(() => setMessage(''), 3000);
              }}>
                {userRole === 'superadmin' && (
                  <div className="form-group">
                    <label className="label">ACCOUNT TYPE</label>
                    <select name="accountRole" className="input" defaultValue="user">
                      <option value="user">User Account</option>
                      <option value="admin">Admin Account</option>
                    </select>
                  </div>
                )}
                <div className="form-group">
                  <label className="label">FULL NAME</label>
                  <input name="name" className="input" required />
                </div>
                <div className="form-group">
                  <label className="label">EMAIL</label>
                  <input name="email" type="email" required className="input" />
                </div>
                <div className="form-group">
                  <label className="label">PASSWORD</label>
                  <input name="password" type="password" required className="input" />
                </div>
                <div className="form-group">
                  <label className="label">INITIAL AMOUNT</label>
                  <input name="amount" type="number" placeholder="0.00" className="input" />
                </div>
                <div className="form-group">
                  <label className="label">USER LIMIT (Admin only)</label>
                  <input name="userLimit" type="number" min="1" placeholder="1" className="input" />
                </div>
                <div className="form-group" style={{ borderTop: '1px solid #e5e7eb', paddingTop: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                    <input
                      type="checkbox"
                      id="wantMockHistory"
                      name="wantMockHistory"
                      onChange={(e) => {
                        const mockFields = document.getElementById('mockHistoryFields');
                        if (mockFields) mockFields.style.display = e.target.checked ? 'block' : 'none';
                      }}
                      style={{ width: '16px', height: '16px' }}
                    />
                    <label htmlFor="wantMockHistory" className="label" style={{ marginBottom: 0 }}>
                      ADD MOCK TRANSACTION HISTORY
                    </label>
                  </div>
                  <div id="mockHistoryFields" style={{ display: 'none', marginLeft: '24px' }}>
                    <div className="form-group">
                      <label className="label">TOTAL HISTORY AMOUNT</label>
                      <input name="mockAmount" type="number" placeholder="e.g., 1000000 for $1M" className="input" />
                    </div>
                    <div className="form-group">
                      <label className="label">HISTORY TIMEFRAME</label>
                      <select name="mockTimeframe" className="input" defaultValue="6months">
                        <option value="1month">1 Month</option>
                        <option value="6months">6 Months</option>
                        <option value="1year">1 Year</option>
                        <option value="2years">2 Years</option>
                        <option value="3years">3 Years</option>
                        <option value="4years">4 Years</option>
                        <option value="5years">5 Years</option>
                        <option value="6years">6 Years</option>
                      </select>
                    </div>
                  </div>
                </div>
                <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                  CREATE ACCOUNT
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
