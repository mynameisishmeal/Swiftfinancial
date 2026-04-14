import { useState, useEffect } from 'react';

export default function AdminSettingsTab({ 
  googleEmail, 
  bindGoogleAccount, 
  unbindGoogleAccount, 
  loading,
  userRole,
  showToast
}: any) {
  const [telegramBotToken, setTelegramBotToken] = useState('');
  const [telegramChatId, setTelegramChatId] = useState('');
  const [telegramEnabled, setTelegramEnabled] = useState(false);
  const [telegramLoading, setTelegramLoading] = useState(false);

  useEffect(() => {
    loadTelegramConfig();
  }, []);

  const loadTelegramConfig = async () => {
    const email = localStorage.getItem('userEmail');
    const res = await fetch(`/api/telegram-config?email=${email}`);
    const data = await res.json();
    if (data.success) {
      setTelegramBotToken(data.telegramBotToken || '');
      setTelegramChatId(data.telegramChatId || '');
      setTelegramEnabled(data.telegramEnabled || false);
    }
  };

  const handleSaveTelegram = async () => {
    if (!telegramBotToken.trim() || !telegramChatId.trim()) {
      showToast?.('Please enter both Bot Token and Chat ID', 'error');
      return;
    }
    setTelegramLoading(true);
    const email = localStorage.getItem('userEmail');
    const res = await fetch('/api/telegram-config', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        email, 
        telegramBotToken: telegramBotToken.trim(), 
        telegramChatId: telegramChatId.trim(), 
        enabled: telegramEnabled, 
        isAdmin: true 
      })
    });
    const data = await res.json();
    setTelegramLoading(false);
    if (data.success) {
      showToast?.('Telegram settings saved successfully', 'success');
    } else {
      showToast?.('Failed to save Telegram settings', 'error');
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

        .btn {
          padding: 12px 24px;
          border-radius: 8px;
          border: none;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
        }

        .btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
      `}</style>

      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Google Account Binding</h3>
        </div>
        <div className="card-content">
          <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '24px' }}>
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
                className="btn"
                style={{ width: '100%', background: '#dc2626', color: 'white' }}
              >
                {loading ? 'UNBINDING...' : 'UNBIND GOOGLE ACCOUNT'}
              </button>
            </div>
          ) : (
            <button
              onClick={bindGoogleAccount}
              disabled={loading}
              className="btn"
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

      <div className="card" style={{ marginTop: '24px' }}>
        <div className="card-header">
          <h3 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69.01-.03.01-.14-.07-.2-.08-.06-.19-.04-.27-.02-.12.03-1.99 1.27-5.61 3.73-.53.36-1.01.54-1.44.53-.47-.01-1.38-.27-2.06-.49-.83-.27-1.49-.42-1.43-.88.03-.24.37-.48 1.02-.73 4-1.74 6.68-2.88 8.03-3.44 3.82-1.59 4.61-1.87 5.13-1.87.11 0 .37.03.53.16.14.11.18.26.2.37.01.06.03.21.01.33z" fill="#0088cc"/>
            </svg>
            Telegram Bot Configuration
          </h3>
        </div>
        <div className="card-content">
          <div style={{ background: '#f0f9ff', padding: '16px', borderRadius: '8px', marginBottom: '16px', border: '1px solid #bae6fd' }}>
            <div style={{ fontSize: '14px', color: '#0369a1', marginBottom: '12px', fontWeight: '600' }}>Setup Instructions:</div>
            <ol style={{ fontSize: '13px', color: '#0c4a6e', paddingLeft: '20px', margin: 0, lineHeight: '1.8' }}>
              <li>Open Telegram and search for <strong>@BotFather</strong></li>
              <li>Send <strong>/newbot</strong> and follow the instructions to create your bot</li>
              <li>Copy the <strong>Bot Token</strong> provided by BotFather</li>
              <li>Search for <strong>@userinfobot</strong> on Telegram</li>
              <li>Send <strong>/start</strong> to get your <strong>Chat ID</strong></li>
              <li>Start a chat with your bot (search for it by name) and send <strong>/start</strong></li>
              <li>Paste both Bot Token and Chat ID below</li>
            </ol>
          </div>
          <div style={{ marginBottom: '12px' }}>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#111827', marginBottom: '8px' }}>Bot Token</label>
            <input 
              type="text" 
              value={telegramBotToken}
              onChange={(e) => setTelegramBotToken(e.target.value)}
              placeholder="Enter your Telegram Bot Token (e.g., 123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11)"
              style={{ width: '100%', padding: '12px', border: '2px solid #e5e7eb', borderRadius: '8px', fontSize: '14px', fontFamily: 'monospace' }} 
            />
          </div>
          <div style={{ marginBottom: '12px' }}>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#111827', marginBottom: '8px' }}>Chat ID</label>
            <input 
              type="text" 
              value={telegramChatId}
              onChange={(e) => setTelegramChatId(e.target.value)}
              placeholder="Enter your Telegram Chat ID (e.g., 123456789)"
              style={{ width: '100%', padding: '12px', border: '2px solid #e5e7eb', borderRadius: '8px', fontSize: '14px', fontFamily: 'monospace' }} 
            />
          </div>
          <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', marginBottom: '16px' }}>
            <input 
              type="checkbox" 
              checked={telegramEnabled}
              onChange={(e) => setTelegramEnabled(e.target.checked)}
              style={{ width: '20px', height: '20px', accentColor: '#0088cc' }} 
            />
            <span style={{ fontSize: '14px', color: '#111827' }}>
              {userRole === 'superadmin' ? 'Enable Telegram notifications for homepage chat messages' : 'Enable Telegram notifications for live chat messages from your managed users'}
            </span>
          </label>
          <button 
            disabled={telegramLoading}
            style={{ width: '100%', padding: '12px 24px', background: telegramLoading ? '#9ca3af' : '#0088cc', color: 'white', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '600', cursor: telegramLoading ? 'not-allowed' : 'pointer' }} 
            onClick={handleSaveTelegram}
          >
            {telegramLoading ? 'SAVING...' : 'SAVE TELEGRAM SETTINGS'}
          </button>
        </div>
      </div>

      <div className="card" style={{ marginTop: '24px' }}>
        <div className="card-header">
          <h3 className="card-title">How It Works</h3>
        </div>
        <div className="card-content">
          <div style={{ fontSize: '14px', color: '#6b7280', lineHeight: '1.6' }}>
            <p style={{ marginBottom: '12px' }}>1. Click "Bind Google Account" above</p>
            <p style={{ marginBottom: '12px' }}>2. Sign in with your Google account</p>
            <p style={{ marginBottom: '12px' }}>3. Your Google email will be linked to this admin account</p>
            <p>4. Use Google sign-in for quick verification when creating accounts</p>
          </div>
        </div>
      </div>
    </>
  );
}
