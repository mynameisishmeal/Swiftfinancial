export function DepositTab({ checkFront, checkBack, depositAmount, setDepositAmount, handleCheckUpload, handleMobileDeposit, paymentLoading }: any) {
  return (
    <>
      <style jsx>{`
        .card { background: white; border-radius: 12px; margin-bottom: 16px; box-shadow: 0 4px 6px rgba(0,0,0,0.05); overflow: hidden; }
        .form-group { margin-bottom: 20px; }
        .form-label { display: block; font-size: 13px; font-weight: 600; color: #111827; margin-bottom: 8px; }
        .form-input { width: 100%; padding: 12px 16px; border: 2px solid #e5e7eb; border-radius: 8px; font-size: 14px; outline: none; transition: all 0.2s; }
        .form-input:focus { border-color: #e31837; box-shadow: 0 0 0 3px rgba(227, 24, 55, 0.1); }
        .form-input[type="number"]::-webkit-inner-spin-button,
        .form-input[type="number"]::-webkit-outer-spin-button { -webkit-appearance: none; margin: 0; }
        .form-input[type="number"] { -moz-appearance: textfield; }
        .submit-btn { width: 100%; padding: 14px; background: #e31837; color: white; border: none; border-radius: 8px; font-size: 14px; font-weight: 600; cursor: pointer; transition: all 0.2s; }
        .submit-btn:hover { background: #c41230; }
        .submit-btn:disabled { background: #9ca3af; cursor: not-allowed; }
      `}</style>
    <div className="card">
      <div style={{ padding: '24px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '24px', color: '#111827' }}>Mobile Check Deposit</h2>
        
        <div className="form-group">
          <label className="form-label">Front of Check</label>
          <input type="file" accept="image/*" capture="environment" onChange={(e) => handleCheckUpload(e, 'front')} style={{ display: 'none' }} id="check-front-main" />
          <label htmlFor="check-front-main" style={{ display: 'block', padding: '60px 20px', border: '2px dashed #e5e7eb', borderRadius: '8px', textAlign: 'center', cursor: 'pointer', background: checkFront ? '#f0fdf4' : '#fafafa', fontSize: '16px', color: checkFront ? '#10b981' : '#6b7280', fontWeight: '600' }}>
            {checkFront ? '✓ Front of Check Uploaded' : '📷 Tap to Capture Front of Check'}
          </label>
        </div>
        
        <div className="form-group">
          <label className="form-label">Back of Check</label>
          <input type="file" accept="image/*" capture="environment" onChange={(e) => handleCheckUpload(e, 'back')} style={{ display: 'none' }} id="check-back-main" />
          <label htmlFor="check-back-main" style={{ display: 'block', padding: '60px 20px', border: '2px dashed #e5e7eb', borderRadius: '8px', textAlign: 'center', cursor: 'pointer', background: checkBack ? '#f0fdf4' : '#fafafa', fontSize: '16px', color: checkBack ? '#10b981' : '#6b7280', fontWeight: '600' }}>
            {checkBack ? '✓ Back of Check Uploaded' : '📷 Tap to Capture Back of Check'}
          </label>
        </div>
        
        <div className="form-group">
          <label className="form-label">Check Amount</label>
          <input 
            type="number" 
            className="form-input" 
            value={depositAmount} 
            onChange={(e) => {
              const value = e.target.value;
              if (value === '' || (parseFloat(value) >= 0 && !value.includes('-'))) {
                setDepositAmount(value);
              }
            }}
            onKeyDown={(e) => {
              if (e.key === '-' || e.key === 'e' || e.key === 'E') {
                e.preventDefault();
              }
            }}
            placeholder="0.00"
            min="0"
            step="0.01"
          />
        </div>
        
        <button className="submit-btn" onClick={handleMobileDeposit} disabled={paymentLoading}>
          {paymentLoading ? 'Processing Deposit...' : 'Submit Deposit'}
        </button>
      </div>
      
      <div style={{ borderTop: '1px solid #F3F4F6', padding: '20px', background: '#f8f9fa' }}>
        <div style={{ fontSize: '12px', fontWeight: 700, color: '#6b7280', letterSpacing: '0.5px', textTransform: 'uppercase', marginBottom: '12px' }}>DEPOSIT TIPS</div>
        <div style={{ fontSize: '14px', color: '#6b7280', lineHeight: '1.6' }}>
          <p style={{ marginBottom: '12px' }}>• Endorse the back of your check</p>
          <p style={{ marginBottom: '12px' }}>• Place check on a dark surface</p>
          <p style={{ marginBottom: '12px' }}>• Ensure all corners are visible</p>
          <p style={{ marginBottom: '12px' }}>• Use good lighting</p>
          <p>• Keep check for 30 days after deposit</p>
        </div>
      </div>
    </div>
    </>
  );
}

export function MoreTab({ router, setActiveTab, setActiveNav, handleAvatarChange }: any) {
  return (
    <>
      <style jsx>{`
        .card { background: white; border-radius: 12px; margin-bottom: 16px; box-shadow: 0 4px 6px rgba(0,0,0,0.05); overflow: hidden; }
        .card-row { padding: 16px 20px; display: flex; justify-content: space-between; align-items: center; cursor: pointer; border-bottom: 1px solid #F3F4F6; }
        .card-row:last-child { border-bottom: none; }
        .card-row:hover { background: #F9FAFB; }
        .row-left { flex: 1; }
        .row-title { font-size: 16px; font-weight: 700; color: #111827; margin-bottom: 4px; }
        .row-subtitle { font-size: 13px; color: #6B7280; }
      `}</style>
      <div className="card">
        <div style={{ padding: '16px 20px', background: '#f8f9fa', borderBottom: '1px solid #F3F4F6' }}>
          <div style={{ fontSize: '12px', fontWeight: 700, color: '#6b7280', letterSpacing: '0.5px', textTransform: 'uppercase' }}>SETTINGS</div>
        </div>
        <div className="card-row" onClick={() => { setActiveTab('preferences'); setActiveNav('more'); }}>
          <div className="row-left">
            <div className="row-title">Account Preferences</div>
            <div className="row-subtitle">Manage your account settings</div>
          </div>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M7 4l6 6-6 6" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </div>
        <div className="card-row" onClick={() => { setActiveTab('notifications'); setActiveNav('more'); }}>
          <div className="row-left">
            <div className="row-title">Notification Settings</div>
            <div className="row-subtitle">Email, SMS, and push notifications</div>
          </div>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M7 4l6 6-6 6" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </div>
        <div className="card-row" onClick={() => { setActiveTab('security'); setActiveNav('more'); }}>
          <div className="row-left">
            <div className="row-title">Security Settings</div>
            <div className="row-subtitle">2FA, password, and security</div>
          </div>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M7 4l6 6-6 6" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </div>
      </div>

      <div className="card">
        <div style={{ padding: '16px 20px', background: '#f8f9fa', borderBottom: '1px solid #F3F4F6' }}>
          <div style={{ fontSize: '12px', fontWeight: 700, color: '#6b7280', letterSpacing: '0.5px', textTransform: 'uppercase' }}>PROFILE</div>
        </div>
        <div className="card-row" onClick={() => router.push('/profile')}>
          <div className="row-left">
            <div className="row-title">Personal Information</div>
            <div className="row-subtitle">Name, email, phone number</div>
          </div>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M7 4l6 6-6 6" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </div>
        <div className="card-row" onClick={() => document.getElementById('avatar-upload')?.click()}>
          <div className="row-left">
            <div className="row-title">Change Avatar</div>
            <div className="row-subtitle">Upload profile picture</div>
          </div>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M7 4l6 6-6 6" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </div>
        <input type="file" accept="image/*" id="avatar-upload" style={{ display: 'none' }} onChange={handleAvatarChange} />
      </div>

      <div className="card">
        <div style={{ padding: '16px 20px', background: '#f8f9fa', borderBottom: '1px solid #F3F4F6' }}>
          <div style={{ fontSize: '12px', fontWeight: 700, color: '#6b7280', letterSpacing: '0.5px', textTransform: 'uppercase' }}>HELP & SUPPORT</div>
        </div>
        <div className="card-row" onClick={() => { setActiveTab('faq'); setActiveNav('more'); }}>
          <div className="row-left">
            <div className="row-title">FAQ</div>
            <div className="row-subtitle">Frequently asked questions</div>
          </div>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M7 4l6 6-6 6" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </div>
        <div className="card-row" onClick={() => router.push('/help')}>
          <div className="row-left">
            <div className="row-title">Contact Support</div>
            <div className="row-subtitle">Get help from our team</div>
          </div>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M7 4l6 6-6 6" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </div>
        <div className="card-row" onClick={() => { setActiveTab('livechat'); setActiveNav('more'); }}>
          <div className="row-left">
            <div className="row-title">Live Chat</div>
            <div className="row-subtitle">Chat with a representative</div>
          </div>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M7 4l6 6-6 6" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </div>
      </div>

      <div className="card">
        <div style={{ padding: '16px 20px', background: '#f8f9fa', borderBottom: '1px solid #F3F4F6' }}>
          <div style={{ fontSize: '12px', fontWeight: 700, color: '#6b7280', letterSpacing: '0.5px', textTransform: 'uppercase' }}>ABOUT</div>
        </div>
        <div className="card-row">
          <div className="row-left">
            <div className="row-title">Version</div>
            <div className="row-subtitle">1.0.0</div>
          </div>
        </div>
        <div className="card-row" onClick={() => { localStorage.removeItem('userEmail'); localStorage.removeItem('userRole'); router.push('/'); }} style={{ cursor: 'pointer' }}>
          <div className="row-left">
            <div className="row-title" style={{ color: '#E31837' }}>Logout</div>
            <div className="row-subtitle">Sign out of your account</div>
          </div>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M7 4l6 6-6 6" stroke="#E31837" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </div>
      </div>
    </>
  );
}
