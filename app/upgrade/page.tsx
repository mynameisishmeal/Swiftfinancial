'use client';

import { useState } from 'react';

export default function UpgradeRole() {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('user');
  const [secretKey, setSecretKey] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const upgradeRole = async () => {
    setLoading(true);
    const res = await fetch('/api/upgrade-role', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, role, secretKey }),
    });
    const data = await res.json();
    setMessage(data.message);
    setLoading(false);
  };

  return (
    <>
      <style jsx>{`
        * { margin: 0; padding: 0; box-sizing: border-box; }
        .app-container { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #F4F4F4; min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 20px; }
        .card { background: white; border-radius: 12px; padding: 32px; width: 100%; max-width: 450px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
        .title { font-size: 24px; font-weight: 700; color: #111827; margin-bottom: 24px; }
        .form-group { margin-bottom: 20px; }
        .label { display: block; font-size: 12px; font-weight: 700; color: #6b7280; margin-bottom: 8px; letter-spacing: 0.5px; text-transform: uppercase; }
        .form-input { width: 100%; padding: 12px 16px; border: 2px solid #e5e7eb; border-radius: 8px; font-size: 14px; outline: none; transition: all 0.2s; }
        .form-input:focus { border-color: #e31837; box-shadow: 0 0 0 3px rgba(227, 24, 55, 0.1); }
        .form-select { width: 100%; padding: 12px 16px; border: 2px solid #e5e7eb; border-radius: 8px; font-size: 14px; outline: none; background: white; transition: all 0.2s; }
        .form-select:focus { border-color: #e31837; box-shadow: 0 0 0 3px rgba(227, 24, 55, 0.1); }
        .submit-btn { width: 100%; padding: 14px; background: #e31837; color: white; border: none; border-radius: 8px; font-size: 14px; font-weight: 600; cursor: pointer; transition: all 0.2s; }
        .submit-btn:hover { background: #c41230; }
        .submit-btn:disabled { background: #9ca3af; cursor: not-allowed; }
        .alert { padding: 16px; border-radius: 8px; margin-top: 16px; font-size: 14px; font-weight: 600; }
        .alert-success { background: #d1fae5; border: 1px solid #6ee7b7; color: #065f46; }
        .alert-error { background: #fee2e2; border: 1px solid #fca5a5; color: #991b1b; }
        .back-link { display: inline-block; margin-top: 20px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #e31837; font-size: 14px; font-weight: 600; text-decoration: none; }
        .back-link:hover { text-decoration: underline; }
      `}</style>
      <div className="app-container">
        <div className="card">
          <h1 className="title">Upgrade User Role</h1>
          
          <div>
            <div className="form-group">
              <label className="label">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-input"
                placeholder="user@example.com"
              />
            </div>

            <div className="form-group">
              <label className="label">Secret Key</label>
              <input
                type="password"
                value={secretKey}
                onChange={(e) => setSecretKey(e.target.value)}
                className="form-input"
                placeholder="Enter secret key"
              />
            </div>

            <div className="form-group">
              <label className="label">New Role</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="form-select"
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
                <option value="superadmin">Superadmin</option>
              </select>
            </div>

            <button
              onClick={upgradeRole}
              disabled={loading || !email || !secretKey}
              className="submit-btn"
            >
              {loading ? 'UPDATING...' : 'UPGRADE ROLE'}
            </button>

            {message && (
              <div className={`alert ${message.includes('success') ? 'alert-success' : 'alert-error'}`}>
                {message}
              </div>
            )}
          </div>

          <a href="/" className="back-link">← Back to Login</a>
        </div>
      </div>
    </>
  );
}
