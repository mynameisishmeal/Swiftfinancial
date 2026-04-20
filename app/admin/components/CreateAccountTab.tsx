export default function CreateAccountTab({ 
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
          <div style={{ padding: '12px', marginBottom: '16px', background: '#f0f9ff', border: '1px solid #bae6fd', borderRadius: '8px', fontSize: '13px', color: '#0369a1' }}>
            ℹ️ No Google verification required. Fill out the form below to create a new account directly.
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
      </div>
    </>
  );
}
