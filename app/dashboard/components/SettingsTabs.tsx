'use client';

import { useState } from 'react';

export function PreferencesTab({ showToast }: { showToast: (msg: string, type: 'success' | 'error') => void }) {
  return (
    <>
      <style jsx>{`
        .card { background: white; border-radius: 12px; margin-bottom: 16px; box-shadow: 0 4px 6px rgba(0,0,0,0.05); overflow: hidden; }
      `}</style>
    <div className="card">
      <div style={{ padding: '24px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '24px', color: '#111827' }}>Account Preferences</h2>
        
        <div style={{ marginBottom: '24px' }}>
          <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#111827', marginBottom: '8px' }}>Language</label>
          <select style={{ width: '100%', padding: '12px', border: '2px solid #e5e7eb', borderRadius: '8px', fontSize: '14px' }}>
            <option>English</option>
            <option>Spanish</option>
            <option>French</option>
          </select>
        </div>

        <div style={{ marginBottom: '24px' }}>
          <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#111827', marginBottom: '8px' }}>Currency Display</label>
          <select style={{ width: '100%', padding: '12px', border: '2px solid #e5e7eb', borderRadius: '8px', fontSize: '14px' }}>
            <option>USD ($)</option>
            <option>EUR (€)</option>
            <option>GBP (£)</option>
          </select>
        </div>

        {['Show account balances on dashboard', 'Enable quick balance view'].map((label, idx) => (
          <div key={idx} style={{ marginBottom: '24px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
              <input type="checkbox" defaultChecked style={{ width: '20px', height: '20px', accentColor: '#E31837' }} />
              <span style={{ fontSize: '14px', color: '#111827' }}>{label}</span>
            </label>
          </div>
        ))}

        <button style={{ width: '100%', padding: '14px', background: '#E31837', color: 'white', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }} onClick={() => showToast('Preferences saved successfully', 'success')}>Save Preferences</button>
      </div>
    </div>
    </>
  );
}

export function NotificationsTab({ showToast }: { showToast: (msg: string, type: 'success' | 'error') => void }) {
  const sections = [
    { title: 'Email Notifications', items: ['Transaction alerts', 'Monthly statements', 'Promotional offers'], checked: [true, true, false] },
    { title: 'SMS Notifications', items: ['Large transactions (over $500)', 'Low balance alerts', 'Security alerts'], checked: [true, false, true] },
    { title: 'Push Notifications', items: ['All transactions', 'Bill payment reminders'], checked: [true, true] }
  ];

  return (
    <>
      <style jsx>{`
        .card { background: white; border-radius: 12px; margin-bottom: 16px; box-shadow: 0 4px 6px rgba(0,0,0,0.05); overflow: hidden; }
      `}</style>
    <div className="card">
      <div style={{ padding: '24px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '24px', color: '#111827' }}>Notification Settings</h2>
        
        {sections.map((section, idx) => (
          <div key={idx} style={{ marginBottom: '24px', paddingBottom: idx < sections.length - 1 ? '24px' : '0', borderBottom: idx < sections.length - 1 ? '1px solid #e5e7eb' : 'none' }}>
            <div style={{ fontSize: '16px', fontWeight: '600', color: '#111827', marginBottom: '16px' }}>{section.title}</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {section.items.map((item, i) => (
                <label key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
                  <input type="checkbox" defaultChecked={section.checked[i]} style={{ width: '20px', height: '20px', accentColor: '#E31837' }} />
                  <span style={{ fontSize: '14px', color: '#111827' }}>{item}</span>
                </label>
              ))}
            </div>
          </div>
        ))}

        <button style={{ width: '100%', padding: '14px', background: '#E31837', color: 'white', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }} onClick={() => showToast('Notification settings saved', 'success')}>Save Settings</button>
      </div>
    </div>
    </>
  );
}

export function SecurityTab({ showToast }: { showToast: (msg: string, type: 'success' | 'error') => void }) {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [show2FASetup, setShow2FASetup] = useState(false);
  const [qrCode, setQrCode] = useState('');
  const [verificationCode, setVerificationCode] = useState('');

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      showToast('Please fill all fields', 'error');
      return;
    }
    if (newPassword !== confirmPassword) {
      showToast('New passwords do not match', 'error');
      return;
    }
    if (newPassword.length < 6) {
      showToast('Password must be at least 6 characters', 'error');
      return;
    }

    setLoading(true);
    const email = localStorage.getItem('userEmail');
    const res = await fetch('/api/change-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, currentPassword, newPassword })
    });
    const data = await res.json();
    setLoading(false);

    if (data.success) {
      showToast('Password changed successfully', 'success');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } else {
      showToast(data.error || 'Failed to change password', 'error');
    }
  };

  const handleSetup2FA = async () => {
    const email = localStorage.getItem('userEmail');
    const res = await fetch('/api/setup-2fa', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });
    const data = await res.json();

    if (data.success) {
      setQrCode(data.qrCode);
      setShow2FASetup(true);
    } else {
      showToast(data.error || 'Failed to setup 2FA', 'error');
    }
  };

  const handleVerify2FA = async () => {
    if (!verificationCode || verificationCode.length !== 6) {
      showToast('Please enter 6-digit code', 'error');
      return;
    }

    const email = localStorage.getItem('userEmail');
    const res = await fetch('/api/verify-2fa', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, token: verificationCode })
    });
    const data = await res.json();

    if (data.success) {
      showToast('2FA enabled successfully', 'success');
      setShow2FASetup(false);
      setVerificationCode('');
    } else {
      showToast(data.error || 'Invalid verification code', 'error');
    }
  };

  return (
    <>
      <style jsx>{`
        .card { background: white; border-radius: 12px; margin-bottom: 16px; box-shadow: 0 4px 6px rgba(0,0,0,0.05); overflow: hidden; }
      `}</style>
    <div className="card">
      <div style={{ padding: '24px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '24px', color: '#111827' }}>Security Settings</h2>
        
        <div style={{ marginBottom: '24px', paddingBottom: '24px', borderBottom: '1px solid #e5e7eb' }}>
          <div style={{ fontSize: '16px', fontWeight: '600', color: '#111827', marginBottom: '16px' }}>Two-Factor Authentication</div>
          {!show2FASetup ? (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <div>
                <div style={{ fontSize: '14px', color: '#111827', marginBottom: '4px' }}>Status: <span style={{ color: '#6b7280', fontWeight: '600' }}>Not Enabled</span></div>
                <div style={{ fontSize: '12px', color: '#6b7280' }}>Add an extra layer of security</div>
              </div>
              <button style={{ padding: '8px 16px', background: '#E31837', color: 'white', border: 'none', borderRadius: '6px', fontSize: '12px', fontWeight: '600', cursor: 'pointer' }} onClick={handleSetup2FA}>Enable 2FA</button>
            </div>
          ) : (
            <div style={{ background: '#f9fafb', padding: '20px', borderRadius: '8px' }}>
              <div style={{ textAlign: 'center', marginBottom: '16px' }}>
                <div style={{ fontSize: '14px', fontWeight: '600', marginBottom: '12px' }}>Scan this QR code with your authenticator app</div>
                {qrCode && <img src={qrCode} alt="QR Code" style={{ width: '200px', height: '200px', margin: '0 auto' }} />}
              </div>
              <div style={{ marginBottom: '12px' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#111827', marginBottom: '8px' }}>Enter 6-digit code</label>
                <input 
                  type="text" 
                  maxLength={6}
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value.replace(/[^0-9]/g, ''))}
                  style={{ width: '100%', padding: '12px', border: '2px solid #e5e7eb', borderRadius: '8px', fontSize: '14px', textAlign: 'center', letterSpacing: '8px', fontWeight: '600' }} 
                  placeholder="000000"
                />
              </div>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button style={{ flex: 1, padding: '12px', background: '#e5e7eb', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }} onClick={() => { setShow2FASetup(false); setVerificationCode(''); }}>Cancel</button>
                <button style={{ flex: 1, padding: '12px', background: '#10b981', color: 'white', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }} onClick={handleVerify2FA}>Verify & Enable</button>
              </div>
            </div>
          )}
        </div>

        <div style={{ marginBottom: '24px', paddingBottom: '24px', borderBottom: '1px solid #e5e7eb' }}>
          <div style={{ fontSize: '16px', fontWeight: '600', color: '#111827', marginBottom: '16px' }}>Change Password</div>
          <div style={{ marginBottom: '12px' }}>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#111827', marginBottom: '8px' }}>Current Password</label>
            <input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} style={{ width: '100%', padding: '12px', border: '2px solid #e5e7eb', borderRadius: '8px', fontSize: '14px' }} />
          </div>
          <div style={{ marginBottom: '12px' }}>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#111827', marginBottom: '8px' }}>New Password</label>
            <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} style={{ width: '100%', padding: '12px', border: '2px solid #e5e7eb', borderRadius: '8px', fontSize: '14px' }} />
          </div>
          <div style={{ marginBottom: '12px' }}>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#111827', marginBottom: '8px' }}>Confirm New Password</label>
            <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} style={{ width: '100%', padding: '12px', border: '2px solid #e5e7eb', borderRadius: '8px', fontSize: '14px' }} />
          </div>
          <button disabled={loading} style={{ padding: '12px 24px', background: loading ? '#9ca3af' : '#E31837', color: 'white', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '600', cursor: loading ? 'not-allowed' : 'pointer' }} onClick={handleChangePassword}>{loading ? 'Updating...' : 'Update Password'}</button>
        </div>

        <div>
          <div style={{ fontSize: '16px', fontWeight: '600', color: '#111827', marginBottom: '16px' }}>Login Activity</div>
          <div style={{ border: '1px solid #e5e7eb', borderRadius: '8px', overflow: 'hidden' }}>
            {[
              { device: 'Chrome on Windows', time: 'Current session', status: 'Active', color: '#10b981' },
              { device: 'Mobile App', time: '2 hours ago', status: 'Inactive', color: '#6b7280' }
            ].map((activity, idx) => (
              <div key={idx} style={{ padding: '12px', borderBottom: idx === 0 ? '1px solid #e5e7eb' : 'none', display: 'flex', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: '600', color: '#111827' }}>{activity.device}</div>
                  <div style={{ fontSize: '12px', color: '#6b7280' }}>{activity.time}</div>
                </div>
                <div style={{ fontSize: '12px', color: activity.color }}>{activity.status}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
    </>
  );
}

export function FAQTab() {
  const faqs = [
    { q: 'How do I transfer money?', a: 'Go to Pay & Transfer tab, select the transfer type, enter the amount and recipient details, then click Continue.' },
    { q: 'How do I download my statement?', a: 'Click on your account in the Accounts tab, then click the Statement button to download your account statement.' },
    { q: 'What is Zelle?', a: 'Zelle is a fast, safe way to send and receive money with friends and family. Money is typically available in minutes.' },
    { q: 'How do I deposit a check?', a: 'Go to Deposit Checks tab, take photos of the front and back of your check, enter the amount, and submit.' },
    { q: 'How do I change my password?', a: 'Go to More > Security Settings, then enter your current password and new password to update it.' },
    { q: 'What are rewards points?', a: 'Rewards points are earned on eligible purchases with your credit card. You can redeem them for cash back, gift cards, or travel.' }
  ];

  return (
    <>
      <style jsx>{`
        .card { background: white; border-radius: 12px; margin-bottom: 16px; box-shadow: 0 4px 6px rgba(0,0,0,0.05); overflow: hidden; }
      `}</style>
    <div className="card">
      <div style={{ padding: '24px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '24px', color: '#111827' }}>Frequently Asked Questions</h2>
        
        {faqs.map((faq, idx) => (
          <div key={idx} style={{ marginBottom: '16px', paddingBottom: '16px', borderBottom: idx < faqs.length - 1 ? '1px solid #e5e7eb' : 'none' }}>
            <div style={{ fontSize: '16px', fontWeight: '600', color: '#111827', marginBottom: '8px' }}>{faq.q}</div>
            <div style={{ fontSize: '14px', color: '#6b7280', lineHeight: '1.6' }}>{faq.a}</div>
          </div>
        ))}
      </div>
    </div>
    </>
  );
}

export function LiveChatTab({ liveChatMessage, setLiveChatMessage, liveChatMessages, handleLiveChatSubmit }: any) {
  return (
    <>
      <style jsx>{`
        .card { background: white; border-radius: 12px; margin-bottom: 16px; box-shadow: 0 4px 6px rgba(0,0,0,0.05); overflow: hidden; }
      `}</style>
    <div className="card">
      <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', height: '500px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '16px', color: '#111827' }}>Live Chat Support</h2>
        
        <div style={{ flex: 1, overflowY: 'auto', marginBottom: '16px', border: '1px solid #e5e7eb', borderRadius: '8px', padding: '16px' }}>
          {liveChatMessages.length === 0 && (
            <div style={{ textAlign: 'center', padding: '40px 20px', color: '#6b7280' }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>💬</div>
              <div style={{ fontSize: '16px', fontWeight: '600', color: '#111827', marginBottom: '8px' }}>Start a conversation</div>
              <div style={{ fontSize: '14px' }}>Our support team will respond shortly</div>
            </div>
          )}
          {liveChatMessages.map((msg: any, idx: number) => (
            <div key={idx} style={{ display: 'flex', justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start', marginBottom: '12px' }}>
              <div style={{ maxWidth: '70%', padding: '12px 16px', borderRadius: '16px', background: msg.sender === 'user' ? '#E31837' : '#f3f4f6', color: msg.sender === 'user' ? 'white' : '#111827' }}>
                <div style={{ fontSize: '14px', marginBottom: '4px' }}>{msg.message}</div>
                <div style={{ fontSize: '11px', opacity: 0.7 }}>{new Date(msg.timestamp).toLocaleTimeString()}</div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <input type="text" value={liveChatMessage} onChange={(e) => setLiveChatMessage(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleLiveChatSubmit()} placeholder="Type your message..." style={{ flex: 1, padding: '12px 16px', border: '2px solid #e5e7eb', borderRadius: '24px', fontSize: '14px', outline: 'none' }} />
          <button onClick={handleLiveChatSubmit} disabled={!liveChatMessage.trim()} style={{ width: '48px', height: '48px', borderRadius: '50%', background: liveChatMessage.trim() ? '#E31837' : '#e5e7eb', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: liveChatMessage.trim() ? 'pointer' : 'not-allowed', color: 'white' }}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M18 2L9 11M18 2l-6 16-3-7-7-3 16-6z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
    </>
  );
}
