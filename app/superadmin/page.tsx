'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { initializeApp, getApps } from 'firebase/app';
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut } from 'firebase/auth';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export default function SuperAdminSettings() {
  const [userEmail, setUserEmail] = useState('');
  const [userRole, setUserRole] = useState('');
  const [googleEmail, setGoogleEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const email = localStorage.getItem('userEmail');
    const role = localStorage.getItem('userRole');
    
    if (!email || (role !== 'admin' && role !== 'superadmin')) {
      router.push('/admin');
      return;
    }
    
    setUserEmail(email);
    setUserRole(role);
    loadGoogleBinding(email);
  }, []);

  const loadGoogleBinding = async (email: string) => {
    const res = await fetch(`/api/admin/google-binding?email=${email}`);
    const data = await res.json();
    if (data.googleEmail) {
      setGoogleEmail(data.googleEmail);
    }
  };

  const bindGoogleAccount = async () => {
    try {
      setLoading(true);
      const result = await signInWithPopup(auth, googleProvider);
      const googleEmail = result.user.email;
      
      const res = await fetch('/api/admin/bind-google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ adminEmail: userEmail, googleEmail }),
      });
      
      const data = await res.json();
      if (res.ok) {
        setGoogleEmail(googleEmail!);
        setMessage('✓ Google account bound successfully');
      } else {
        setMessage('✕ ' + data.message);
      }
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('✕ Failed to bind Google account');
      setTimeout(() => setMessage(''), 3000);
    } finally {
      setLoading(false);
    }
  };

  const unbindGoogleAccount = async () => {
    if (!confirm('Unbind Google account?')) return;
    
    setLoading(true);
    
    // Sign out from Firebase
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Firebase sign out error:', error);
    }
    
    // Remove from MongoDB
    const res = await fetch('/api/admin/bind-google', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ adminEmail: userEmail }),
    });
    
    const data = await res.json();
    if (res.ok) {
      setGoogleEmail('');
      setMessage('✓ Google account unbound');
    } else {
      setMessage('✕ ' + data.message);
    }
    setTimeout(() => setMessage(''), 3000);
    setLoading(false);
  };

  return (
    <div>
      <link rel="stylesheet" href="/assets/bofa-dashboard.css" />
      <div className="bofa-dashboard">
        <div className="bofa-header">
          <div className="bofa-header-stripe"></div>
          <div className="bofa-header-nav">
            <div className="bofa-header-content">
              <img className="bofa-logo" src="/assets/BofA_rgb.png" alt="Swift Financial" />
              <div style={{ color: 'white', fontSize: '18px', fontWeight: '300' }}>Admin Settings</div>
              <div className="bofa-user-info">
                <span style={{ color: 'white', fontSize: '14px' }}>{userEmail}</span>
                <button onClick={() => router.push('/admin')} className="bofa-logout-btn">
                  BACK TO ADMIN
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="bofa-main">
          {message && (
            <div className={`bofa-alert ${message.includes('✓') ? 'bofa-alert-success' : 'bofa-alert-error'}`}>
              {message}
            </div>
          )}

          <div className="bofa-card">
            <div className="bofa-card-header">
              <h3 className="bofa-card-title">Google Account Binding</h3>
            </div>
            <div className="bofa-card-content">
              <p style={{ fontSize: '14px', color: 'var(--bofa-gray-600)', marginBottom: '24px' }}>
                Bind a Google account to enable quick verification when creating user accounts.
              </p>

              {googleEmail ? (
                <div>
                  <div style={{ background: '#f0fdf4', border: '1px solid #86efac', padding: '16px', borderRadius: '8px', marginBottom: '16px' }}>
                    <div style={{ fontSize: '13px', color: '#15803d', fontWeight: '600', marginBottom: '4px' }}>✓ Google Account Bound</div>
                    <div style={{ fontSize: '14px', color: '#16a34a' }}>{googleEmail}</div>
                  </div>
                  <button
                    onClick={unbindGoogleAccount}
                    disabled={loading}
                    className="bofa-btn"
                    style={{ width: '100%', background: '#dc2626', color: 'white' }}
                  >
                    {loading ? 'UNBINDING...' : 'UNBIND GOOGLE ACCOUNT'}
                  </button>
                </div>
              ) : (
                <button
                  onClick={bindGoogleAccount}
                  disabled={loading}
                  className="bofa-btn"
                  style={{ width: '100%', background: '#4285f4', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px' }}
                >
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                    <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z" fill="#4285F4"/>
                    <path d="M9.003 18c2.43 0 4.467-.806 5.956-2.18L12.05 13.56c-.806.54-1.836.86-3.047.86-2.344 0-4.328-1.584-5.036-3.711H.96v2.332C2.44 15.983 5.485 18 9.003 18z" fill="#34A853"/>
                    <path d="M3.964 10.712c-.18-.54-.282-1.117-.282-1.71 0-.593.102-1.17.282-1.71V4.96H.957C.347 6.175 0 7.55 0 9.002c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
                    <path d="M9.003 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.464.891 11.426 0 9.003 0 5.485 0 2.44 2.017.96 4.958L3.967 7.29c.708-2.127 2.692-3.71 5.036-3.71z" fill="#EA4335"/>
                  </svg>
                  {loading ? 'BINDING...' : 'BIND GOOGLE ACCOUNT'}
                </button>
              )}
            </div>
          </div>

          <div className="bofa-card">
            <div className="bofa-card-header">
              <h3 className="bofa-card-title">How It Works</h3>
            </div>
            <div className="bofa-card-content">
              <div style={{ fontSize: '14px', color: 'var(--bofa-gray-600)', lineHeight: '1.6' }}>
                <p style={{ marginBottom: '12px' }}>1. Click "Bind Google Account" above</p>
                <p style={{ marginBottom: '12px' }}>2. Sign in with your Google account</p>
                <p style={{ marginBottom: '12px' }}>3. Your Google email will be linked to this admin account</p>
                <p>4. Use Google sign-in for quick verification when creating accounts</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
