import React from 'react';

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
  const [showPassword, setShowPassword] = React.useState(false);
  const [accountRole, setAccountRole] = React.useState('user');
  const [showSuccess, setShowSuccess] = React.useState(false);
  const [successMessage, setSuccessMessage] = React.useState('');
  
  const autofillForm = () => {
    const form = document.getElementById('create-account-form') as HTMLFormElement;
    if (form) {
      (form.elements.namedItem('name') as HTMLInputElement).value = 'John Doe';
      (form.elements.namedItem('email') as HTMLInputElement).value = `user${Date.now()}@example.com`;
      (form.elements.namedItem('phone') as HTMLInputElement).value = '+1234567890';
      (form.elements.namedItem('password') as HTMLInputElement).value = 'Password123';
      (form.elements.namedItem('amount') as HTMLInputElement).value = '5000';
      (form.elements.namedItem('savingsBalance') as HTMLInputElement).value = '10000';
      (form.elements.namedItem('creditBalance') as HTMLInputElement).value = '0';
      (form.elements.namedItem('creditLimit') as HTMLInputElement).value = '5000';
      (form.elements.namedItem('ficoScore') as HTMLInputElement).value = '750';
      (form.elements.namedItem('rewardsPoints') as HTMLInputElement).value = '1000';
      (form.elements.namedItem('cardExpiry') as HTMLInputElement).value = '12/28';
      (form.elements.namedItem('iban') as HTMLInputElement).value = 'US12345678901234567890';
      (form.elements.namedItem('dailyLimit') as HTMLInputElement).value = '10000';
      (form.elements.namedItem('monthlyLimit') as HTMLInputElement).value = '50000';
      (form.elements.namedItem('interestRate') as HTMLInputElement).value = '0.01';
    }
  };
  
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

        @keyframes scaleIn {
          from {
            transform: translate(-50%, -50%) scale(0.8);
            opacity: 0;
          }
          to {
            transform: translate(-50%, -50%) scale(1);
            opacity: 1;
          }
        }
      `}</style>

      <div className="card">
        <div className="card-header">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 className="card-title">Create New Account</h3>
            {accountRole === 'user' && (
              <button
                type="button"
                onClick={autofillForm}
                style={{ padding: '8px 16px', background: '#0055C4', color: 'white', border: 'none', borderRadius: '6px', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}
              >
                AUTOFILL
              </button>
            )}
          </div>
        </div>
        <div className="card-content">
          {showSuccess && (
            <div style={{ 
              position: 'fixed',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              zIndex: 9999,
              background: 'white',
              padding: '32px',
              borderRadius: '16px',
              boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
              minWidth: '400px',
              maxWidth: '90%',
              animation: 'scaleIn 0.3s ease-out'
            }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '64px', marginBottom: '16px' }}>🎉</div>
                <div style={{ fontSize: '24px', fontWeight: '700', color: '#065f46', marginBottom: '12px' }}>Success!</div>
                <div style={{ fontSize: '14px', color: '#047857', marginBottom: '24px', lineHeight: '1.6' }}>{successMessage}</div>
                <button
                  onClick={() => setShowSuccess(false)}
                  style={{
                    width: '100%',
                    padding: '12px',
                    background: '#10b981',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  OK
                </button>
              </div>
            </div>
          )}
          {showSuccess && (
            <div
              style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'rgba(0,0,0,0.5)',
                zIndex: 9998
              }}
              onClick={() => setShowSuccess(false)}
            />
          )}
          <div style={{ padding: '12px', marginBottom: '16px', background: '#f0f9ff', border: '1px solid #bae6fd', borderRadius: '8px', fontSize: '13px', color: '#0369a1' }}>
            ℹ️ No Google verification required. Fill out the form below to create a new account directly.
          </div>
          <form id="create-account-form" onSubmit={async (e) => {
            e.preventDefault();
            setFormError('');
            const form = e.currentTarget;
            const formData = new FormData(form);
            const accountRole = formData.get('accountRole') as string;
            const wantMockHistory = formData.get('wantMockHistory') === 'on';
            const mockAmount = parseFloat(formData.get('mockAmount') as string) || 0;
            const mockTimeframe = formData.get('mockTimeframe') as string;
            const userProfile = formData.get('userProfile') as string;
            const lifestyle = formData.get('lifestyle') as string;
            const location = formData.get('location') as string;
            
            const res = await fetch('/api/admin/create-account', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                adminEmail: userEmail,
                name: formData.get('email')?.toString().split('@')[0],
                email: formData.get('email'),
                phone: formData.get('phone'),
                password: formData.get('password'),
                transactionPin: formData.get('transactionPin'),
                initialAmount: accountRole === 'admin' ? 0 : (wantMockHistory ? 0 : parseFloat(formData.get('amount') as string) || 0),
                role: accountRole,
                userLimit: accountRole === 'admin' ? Math.max(1, parseInt(formData.get('userLimit') as string) || 1) : undefined,
                savingsBalance: parseFloat(formData.get('savingsBalance') as string) || 0,
                creditBalance: parseFloat(formData.get('creditBalance') as string) || 0,
                creditLimit: parseFloat(formData.get('creditLimit') as string) || 5000,
                ficoScore: parseInt(formData.get('ficoScore') as string) || 750,
                rewardsPoints: parseInt(formData.get('rewardsPoints') as string) || 0,
                cardExpiry: formData.get('cardExpiry') || '12/28',
                iban: formData.get('iban') || '',
                dailyLimit: parseFloat(formData.get('dailyLimit') as string) || 10000,
                monthlyLimit: parseFloat(formData.get('monthlyLimit') as string) || 50000,
                interestRate: parseFloat(formData.get('interestRate') as string) || 0.01,
                accountStatus: formData.get('accountStatus') || 'active',
                taxCleared: formData.get('taxCleared') === 'on',
                overdraftProtection: formData.get('overdraftProtection') === 'on',
                mockHistory: wantMockHistory && mockAmount > 0 ? {
                  totalAmount: mockAmount,
                  timeframe: mockTimeframe,
                  profile: userProfile,
                  lifestyle: lifestyle,
                  location: location,
                  intelligent: true
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
            setSuccessMessage(`Account created successfully for ${formData.get('email')}! Account ID: ${data.accountId}`);
            setShowSuccess(true);
            setTimeout(() => setShowSuccess(false), 5000);
            form.reset();
            setAccountRole('user');
            await loadAllAccounts();
          }}>
            {userRole === 'superadmin' && (
              <div className="form-group">
                <label className="label">ACCOUNT TYPE</label>
                <select name="accountRole" className="input" value={accountRole} onChange={(e) => setAccountRole(e.target.value)}>
                  <option value="user">User Account</option>
                  <option value="admin">Admin Account</option>
                </select>
              </div>
            )}
            {accountRole === 'admin' ? (
              <>
                <div className="form-group">
                  <label className="label">ADMIN EMAIL</label>
                  <input name="email" type="email" required className="input" />
                </div>
                <div className="form-group">
                  <label className="label">PHONE NUMBER</label>
                  <input name="phone" type="tel" placeholder="+1234567890" className="input" required />
                </div>
                <div className="form-group">
                  <label className="label">PASSWORD</label>
                  <div style={{ position: 'relative' }}>
                    <input name="password" type={showPassword ? 'text' : 'password'} required className="input" style={{ paddingRight: '40px' }} />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      style={{
                        position: 'absolute',
                        right: '8px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        padding: '4px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#6b7280'
                      }}
                    >
                      {showPassword ? (
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                          <line x1="1" y1="1" x2="23" y2="23"/>
                        </svg>
                      ) : (
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                          <circle cx="12" cy="12" r="3"/>
                        </svg>
                      )}
                    </button>
                  </div>
                </div>
                <div className="form-group">
                  <label className="label">USER LIMIT</label>
                  <input name="userLimit" type="number" min="1" placeholder="10" defaultValue="10" className="input" required />
                </div>
              </>
            ) : (
              // Full user form
              <>
            <div className="form-group">
              <label className="label">FULL NAME</label>
              <input name="name" className="input" required />
            </div>
            <div className="form-group">
              <label className="label">EMAIL</label>
              <input name="email" type="email" required className="input" />
            </div>
            <div className="form-group">
              <label className="label">PHONE NUMBER</label>
              <input name="phone" type="tel" placeholder="+1234567890" className="input" required />
            </div>
            <div className="form-group">
              <label className="label">TRANSACTION PIN (4 DIGITS)</label>
              <input name="transactionPin" type="password" maxLength={4} placeholder="••••" className="input" required onChange={(e) => e.target.value = e.target.value.replace(/[^0-9]/g, '')} />
            </div>
            <div className="form-group">
              <label className="label">TRANSACTION PIN (4 DIGITS)</label>
              <input name="transactionPin" type="password" maxLength={4} placeholder="••••" className="input" required onChange={(e) => e.target.value = e.target.value.replace(/[^0-9]/g, '')} />
            </div>
            <div className="form-group">
              <label className="label">PASSWORD</label>
              <div style={{ position: 'relative' }}>
                <input name="password" type={showPassword ? 'text' : 'password'} required className="input" style={{ paddingRight: '40px' }} />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '8px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#6b7280'
                  }}
                >
                  {showPassword ? (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                      <line x1="1" y1="1" x2="23" y2="23"/>
                    </svg>
                  ) : (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                      <circle cx="12" cy="12" r="3"/>
                    </svg>
                  )}
                </button>
              </div>
            </div>
            <div className="form-group">
              <label className="label">INITIAL CHECKING BALANCE</label>
              <input name="amount" type="number" step="0.01" placeholder="0.00" className="input" />
            </div>
            <div className="form-group">
              <label className="label">SAVINGS BALANCE</label>
              <input name="savingsBalance" type="number" step="0.01" placeholder="0.00" className="input" />
            </div>
            <div className="form-group">
              <label className="label">CREDIT CARD BALANCE</label>
              <input name="creditBalance" type="number" step="0.01" placeholder="0.00" className="input" />
            </div>
            <div className="form-group">
              <label className="label">CREDIT LIMIT</label>
              <input name="creditLimit" type="number" step="0.01" placeholder="5000" className="input" />
            </div>
            <div className="form-group">
              <label className="label">FICO SCORE (300-850)</label>
              <input name="ficoScore" type="number" min="300" max="850" placeholder="750" className="input" />
            </div>
            <div className="form-group">
              <label className="label">REWARDS POINTS</label>
              <input name="rewardsPoints" type="number" placeholder="0" className="input" />
            </div>
            <div className="form-group">
              <label className="label">CARD EXPIRY (MM/YY)</label>
              <input name="cardExpiry" type="text" placeholder="12/28" className="input" />
            </div>
            <div className="form-group">
              <label className="label">IBAN</label>
              <input name="iban" type="text" placeholder="" className="input" />
            </div>
            <div className="form-group">
              <label className="label">DAILY TRANSACTION LIMIT</label>
              <input name="dailyLimit" type="number" step="0.01" placeholder="10000" className="input" />
            </div>
            <div className="form-group">
              <label className="label">MONTHLY TRANSACTION LIMIT</label>
              <input name="monthlyLimit" type="number" step="0.01" placeholder="50000" className="input" />
            </div>
            <div className="form-group">
              <label className="label">INTEREST RATE (%)</label>
              <input name="interestRate" type="number" step="0.01" placeholder="0.01" className="input" />
            </div>
            <div className="form-group">
              <label className="label">ACCOUNT STATUS</label>
              <select name="accountStatus" className="input" defaultValue="active">
                <option value="active">Active</option>
                <option value="frozen">Frozen</option>
                <option value="suspended">Suspended</option>
                <option value="closed">Closed</option>
              </select>
            </div>
            <div className="form-group">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input type="checkbox" id="taxCleared" name="taxCleared" defaultChecked style={{ width: '16px', height: '16px' }} />
                <label htmlFor="taxCleared" className="label" style={{ marginBottom: 0 }}>TAX CLEARED</label>
              </div>
            </div>
            <div className="form-group">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input type="checkbox" id="overdraftProtection" name="overdraftProtection" defaultChecked style={{ width: '16px', height: '16px' }} />
                <label htmlFor="overdraftProtection" className="label" style={{ marginBottom: 0 }}>OVERDRAFT PROTECTION</label>
              </div>
            </div>
            <div className="form-group">
              <label className="label">USER LIMIT (Admin only)</label>
              <input name="userLimit" type="number" min="1" placeholder="1" className="input" />
            </div>
            </>)}
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
                  ADD INTELLIGENT TRANSACTION HISTORY
                </label>
              </div>
              <div id="mockHistoryFields" style={{ display: 'none', marginLeft: '24px' }}>
                <div className="form-group">
                  <label className="label">USER PROFILE</label>
                  <select name="userProfile" className="input" defaultValue="corporate">
                    <option value="military">Military Personnel</option>
                    <option value="corporate">Corporate Employee (9-5)</option>
                    <option value="freelancer">Freelancer/Contractor</option>
                    <option value="student">Student</option>
                    <option value="retiree">Retiree</option>
                    <option value="business_owner">Business Owner</option>
                    <option value="healthcare">Healthcare Worker</option>
                    <option value="tech_worker">Tech Worker</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="label">LIFESTYLE</label>
                  <select name="lifestyle" className="input" defaultValue="moderate">
                    <option value="frugal">Frugal (70% spending)</option>
                    <option value="moderate">Moderate (100% spending)</option>
                    <option value="luxury">Luxury (150% spending)</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="label">LOCATION TYPE</label>
                  <select name="location" className="input" defaultValue="domestic">
                    <option value="domestic">Domestic</option>
                    <option value="international">International</option>
                    <option value="deployed">Deployed/Remote</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="label">TOTAL HISTORY AMOUNT</label>
                  <input name="mockAmount" type="number" placeholder="e.g., 100000 for $100K" className="input" />
                </div>
                <div className="form-group">
                  <label className="label">HISTORY TIMEFRAME</label>
                  <select name="mockTimeframe" className="input" defaultValue="1year">
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
