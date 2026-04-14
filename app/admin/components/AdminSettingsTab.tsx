export default function AdminSettingsTab({ 
  googleEmail, 
  bindGoogleAccount, 
  unbindGoogleAccount, 
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
