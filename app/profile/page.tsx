'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Profile() {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [avatar, setAvatar] = useState('');
  const [accountId, setAccountId] = useState('');
  const [iban, setIban] = useState('');
  const [message, setMessage] = useState('');
  const [activeSection, setActiveSection] = useState('personal');
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

  const loadAccount = async (userEmail: string) => {
    const res = await fetch(`/api/accounts?email=${userEmail}`);
    const data = await res.json();
    if (data.balance !== undefined) {
      setName(data.name);
      setAvatar(data.avatar);
      setAccountId(data.accountId);
      setIban(data.iban);
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
          setMessage('Profile picture updated successfully');
          setTimeout(() => setMessage(''), 3000);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const logout = () => {
    localStorage.removeItem('userEmail');
    router.push('/');
  };

  return (
    <>
      <style jsx>{`
        * { margin: 0; padding: 0; box-sizing: border-box; }
        .app-container { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #F4F4F4; min-height: 100vh; }
        .top-nav { background: white; padding: 16px 20px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); display: flex; justify-content: space-between; align-items: center; }
        .logout-btn { background: #E31837; color: white; border: none; padding: 10px 20px; border-radius: 6px; font-size: 13px; font-weight: 600; cursor: pointer; }
        .logout-btn:hover { background: #c41230; }
        .content { padding: 20px; max-width: 1200px; margin: 0 auto; }
        .card { background: white; border-radius: 12px; margin-bottom: 16px; box-shadow: 0 2px 8px rgba(0,0,0,0.08); overflow: hidden; }
        .card-header { padding: 20px; border-bottom: 1px solid #f3f4f6; }
        .card-title { font-size: 20px; font-weight: 700; color: #111827; }
        .card-content { padding: 20px; }
        .sidebar { background: white; border-radius: 12px; padding: 20px; box-shadow: 0 2px 8px rgba(0,0,0,0.08); }
        .sidebar-btn { width: 100%; padding: 12px 16px; text-align: left; background: none; border: none; border-radius: 8px; cursor: pointer; font-size: 14px; color: #111827; transition: all 0.2s; }
        .sidebar-btn:hover { background: #f9fafb; }
        .sidebar-btn.active { background: #fef2f2; color: #e31837; font-weight: 600; }
        .form-input { width: 100%; padding: 12px 16px; border: 2px solid #e5e7eb; border-radius: 8px; font-size: 14px; outline: none; }
        .form-input:focus { border-color: #e31837; box-shadow: 0 0 0 3px rgba(227, 24, 55, 0.1); }
        .form-input:disabled { background: #f9fafb; color: #6b7280; }
        .btn-secondary { padding: 10px 20px; background: #e5e7eb; border: none; border-radius: 6px; cursor: pointer; font-weight: 600; font-size: 13px; }
        .btn-secondary:hover { background: #d1d5db; }
        .grid-2 { display: grid; grid-template-columns: 250px 1fr; gap: 24px; }
        @media (max-width: 768px) { .grid-2 { grid-template-columns: 1fr; } }
      `}</style>
      <div className="app-container">
        <div className="top-nav">
          <img src="/assets/sfb-logo.png" alt="Swift Financial" style={{ height: '24px' }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <button onClick={() => router.push('/dashboard')} style={{ background: '#0055C4', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '6px', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}>
              DASHBOARD
            </button>
            <img 
              src={avatar || 'https://ui-avatars.com/api/?name=' + name + '&background=e31837&color=fff'} 
              alt="Avatar" 
              style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }}
            />
            <span style={{ fontSize: '14px', fontWeight: '600', color: '#111827' }}>{name}</span>
            <button onClick={logout} className="logout-btn">
              LOG OUT
            </button>
          </div>
        </div>

        <div className="content">
          {message && (
            <div style={{ padding: '16px', background: '#d1fae5', border: '1px solid #6ee7b7', borderRadius: '8px', marginBottom: '16px', color: '#065f46', fontWeight: '600' }}>
              {message}
            </div>
          )}

          <div className="grid-2">
            <div className="sidebar">
              <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '16px', color: '#111827' }}>Settings</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <button className={`sidebar-btn ${activeSection === 'personal' ? 'active' : ''}`} onClick={() => setActiveSection('personal')}>
                  Personal Information
                </button>
                <button className={`sidebar-btn ${activeSection === 'account' ? 'active' : ''}`} onClick={() => setActiveSection('account')}>
                  Account Details
                </button>
                <button className={`sidebar-btn ${activeSection === 'security' ? 'active' : ''}`} onClick={() => setActiveSection('security')}>
                  Security & Privacy
                </button>
                <button className={`sidebar-btn ${activeSection === 'notifications' ? 'active' : ''}`} onClick={() => setActiveSection('notifications')}>
                  Notifications
                </button>
              </div>
            </div>

            <div>
              {activeSection === 'personal' && (
                <div className="card">
                  <div className="card-header">
                    <h2 className="card-title">Personal Information</h2>
                  </div>
                  <div className="card-content">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '24px', marginBottom: '32px' }}>
                      <img 
                        src={avatar || 'https://ui-avatars.com/api/?name=' + name + '&background=e31837&color=fff'} 
                        alt="Profile" 
                        style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover' }}
                      />
                      <div>
                        <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px' }}>{name}</h3>
                        <label className="btn-secondary" style={{ cursor: 'pointer' }}>
                          Change Photo
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleAvatarChange}
                            style={{ display: 'none' }}
                          />
                        </label>
                      </div>
                    </div>
                    
                    <div style={{ marginBottom: '20px' }}>
                      <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#111827', marginBottom: '8px' }}>Full Name</label>
                      <input
                        type="text"
                        value={name}
                        className="form-input"
                        disabled
                      />
                    </div>
                    
                    <div style={{ marginBottom: '20px' }}>
                      <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#111827', marginBottom: '8px' }}>Email Address</label>
                      <input
                        type="email"
                        value={email}
                        className="form-input"
                        disabled
                      />
                    </div>
                    
                    <p style={{ fontSize: '12px', color: '#6b7280' }}>
                      Contact customer service to update your personal information.
                    </p>
                  </div>
                </div>
              )}

              {activeSection === 'account' && (
                <div className="card">
                  <div className="card-header">
                    <h2 className="card-title">Account Details</h2>
                  </div>
                  <div className="card-content">
                    <div style={{ marginBottom: '20px' }}>
                      <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#111827', marginBottom: '8px' }}>Account Number</label>
                      <input
                        type="text"
                        value={accountId}
                        className="form-input"
                        disabled
                      />
                    </div>
                    
                    <div style={{ marginBottom: '20px' }}>
                      <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#111827', marginBottom: '8px' }}>IBAN</label>
                      <input
                        type="text"
                        value={iban}
                        className="form-input"
                        disabled
                      />
                    </div>
                    
                    <div style={{ marginBottom: '20px' }}>
                      <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#111827', marginBottom: '8px' }}>Account Type</label>
                      <input
                        type="text"
                        value="Checking Account"
                        className="form-input"
                        disabled
                      />
                    </div>
                  </div>
                </div>
              )}

              {activeSection === 'security' && (
                <div className="card">
                  <div className="card-header">
                    <h2 className="card-title">Security & Privacy</h2>
                  </div>
                  <div className="card-content">
                    <div style={{ marginBottom: '24px' }}>
                      <h4 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>Password</h4>
                      <p style={{ fontSize: '12px', color: '#6b7280', marginBottom: '16px' }}>
                        Last changed: Never
                      </p>
                      <button className="btn-secondary" disabled>
                        Change Password (Coming Soon)
                      </button>
                    </div>
                    
                    <div style={{ marginBottom: '24px' }}>
                      <h4 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>Two-Factor Authentication</h4>
                      <p style={{ fontSize: '12px', color: '#6b7280', marginBottom: '16px' }}>
                        Add an extra layer of security to your account
                      </p>
                      <button className="btn-secondary" disabled>
                        Enable 2FA (Coming Soon)
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {activeSection === 'notifications' && (
                <div className="card">
                  <div className="card-header">
                    <h2 className="card-title">Notification Preferences</h2>
                  </div>
                  <div className="card-content">
                    <div style={{ marginBottom: '24px' }}>
                      <h4 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '16px' }}>Email Notifications</h4>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <input type="checkbox" defaultChecked disabled />
                          <span style={{ fontSize: '14px' }}>Transaction alerts</span>
                        </label>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <input type="checkbox" defaultChecked disabled />
                          <span style={{ fontSize: '14px' }}>Security alerts</span>
                        </label>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <input type="checkbox" disabled />
                          <span style={{ fontSize: '14px' }}>Promotional offers</span>
                        </label>
                      </div>
                    </div>
                    
                    <p style={{ fontSize: '12px', color: '#6b7280' }}>
                      Notification settings coming soon.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
