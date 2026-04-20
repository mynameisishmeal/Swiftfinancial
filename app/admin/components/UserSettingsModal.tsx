'use client';

import { useState } from 'react';

interface UserSettingsModalProps {
  user: any;
  onClose: () => void;
  onUpdate: () => void;
  showToast: (message: string, type: 'success' | 'error') => void;
}

export default function UserSettingsModal({ user, onClose, onUpdate, showToast }: UserSettingsModalProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    checkingBalance: user.balance || 0,
    savingsBalance: user.savingsBalance || 0,
    creditBalance: user.creditBalance || 0,
    creditLimit: user.creditLimit || 5000,
    ficoScore: user.ficoScore || 750,
    rewardsPoints: user.rewardsPoints || 0,
    cardExpiry: user.cardExpiry || '12/28',
    taxCleared: user.taxCleared !== false,
    accountStatus: user.accountStatus || 'active',
    dailyLimit: user.dailyLimit || 10000,
    monthlyLimit: user.monthlyLimit || 50000,
    overdraftProtection: user.overdraftProtection !== false,
    interestRate: user.interestRate || 0.01,
    iban: user.iban || ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/admin/update-settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: user.email,
          ...formData
        })
      });

      const data = await res.json();

      if (res.ok) {
        showToast('Settings updated successfully!', 'success');
        onUpdate();
        onClose();
      } else {
        showToast(data.message || 'Failed to update settings', 'error');
      }
    } catch (error) {
      showToast('Error updating settings', 'error');
    }

    setLoading(false);
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0,0,0,0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      padding: '20px'
    }}>
      <div style={{
        background: 'white',
        borderRadius: '12px',
        maxWidth: '800px',
        width: '100%',
        maxHeight: '90vh',
        overflow: 'auto',
        padding: '32px'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#111' }}>
            Manage User Settings - {user.name}
          </h2>
          <button onClick={onClose} style={{
            background: 'none',
            border: 'none',
            fontSize: '28px',
            cursor: 'pointer',
            color: '#666'
          }}>×</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            {/* Account Balances */}
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#666', marginBottom: '8px' }}>
                CHECKING BALANCE
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.checkingBalance}
                onChange={(e) => setFormData({ ...formData, checkingBalance: parseFloat(e.target.value) })}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid #ddd',
                  borderRadius: '6px',
                  fontSize: '14px'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#666', marginBottom: '8px' }}>
                SAVINGS BALANCE
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.savingsBalance}
                onChange={(e) => setFormData({ ...formData, savingsBalance: parseFloat(e.target.value) })}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid #ddd',
                  borderRadius: '6px',
                  fontSize: '14px'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#666', marginBottom: '8px' }}>
                CREDIT CARD BALANCE
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.creditBalance}
                onChange={(e) => setFormData({ ...formData, creditBalance: parseFloat(e.target.value) })}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid #ddd',
                  borderRadius: '6px',
                  fontSize: '14px'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#666', marginBottom: '8px' }}>
                CREDIT LIMIT
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.creditLimit}
                onChange={(e) => setFormData({ ...formData, creditLimit: parseFloat(e.target.value) })}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid #ddd',
                  borderRadius: '6px',
                  fontSize: '14px'
                }}
              />
            </div>

            {/* Credit Info */}
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#666', marginBottom: '8px' }}>
                FICO SCORE
              </label>
              <input
                type="number"
                min="300"
                max="850"
                value={formData.ficoScore}
                onChange={(e) => setFormData({ ...formData, ficoScore: parseInt(e.target.value) })}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid #ddd',
                  borderRadius: '6px',
                  fontSize: '14px'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#666', marginBottom: '8px' }}>
                REWARDS POINTS
              </label>
              <input
                type="number"
                value={formData.rewardsPoints}
                onChange={(e) => setFormData({ ...formData, rewardsPoints: parseInt(e.target.value) })}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid #ddd',
                  borderRadius: '6px',
                  fontSize: '14px'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#666', marginBottom: '8px' }}>
                CARD EXPIRY (MM/YY)
              </label>
              <input
                type="text"
                placeholder="12/28"
                value={formData.cardExpiry}
                onChange={(e) => setFormData({ ...formData, cardExpiry: e.target.value })}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid #ddd',
                  borderRadius: '6px',
                  fontSize: '14px'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#666', marginBottom: '8px' }}>
                IBAN
              </label>
              <input
                type="text"
                value={formData.iban}
                onChange={(e) => setFormData({ ...formData, iban: e.target.value })}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid #ddd',
                  borderRadius: '6px',
                  fontSize: '14px'
                }}
              />
            </div>

            {/* Limits */}
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#666', marginBottom: '8px' }}>
                DAILY TRANSACTION LIMIT
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.dailyLimit}
                onChange={(e) => setFormData({ ...formData, dailyLimit: parseFloat(e.target.value) })}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid #ddd',
                  borderRadius: '6px',
                  fontSize: '14px'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#666', marginBottom: '8px' }}>
                MONTHLY TRANSACTION LIMIT
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.monthlyLimit}
                onChange={(e) => setFormData({ ...formData, monthlyLimit: parseFloat(e.target.value) })}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid #ddd',
                  borderRadius: '6px',
                  fontSize: '14px'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#666', marginBottom: '8px' }}>
                INTEREST RATE (%)
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.interestRate}
                onChange={(e) => setFormData({ ...formData, interestRate: parseFloat(e.target.value) })}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid #ddd',
                  borderRadius: '6px',
                  fontSize: '14px'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#666', marginBottom: '8px' }}>
                ACCOUNT STATUS
              </label>
              <select
                value={formData.accountStatus}
                onChange={(e) => setFormData({ ...formData, accountStatus: e.target.value })}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid #ddd',
                  borderRadius: '6px',
                  fontSize: '14px'
                }}
              >
                <option value="active">Active</option>
                <option value="frozen">Frozen</option>
                <option value="suspended">Suspended</option>
                <option value="closed">Closed</option>
              </select>
            </div>

            {/* Toggles */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <input
                type="checkbox"
                id="taxCleared"
                checked={formData.taxCleared}
                onChange={(e) => setFormData({ ...formData, taxCleared: e.target.checked })}
                style={{ width: '20px', height: '20px', cursor: 'pointer' }}
              />
              <label htmlFor="taxCleared" style={{ fontSize: '14px', fontWeight: '600', color: '#333', cursor: 'pointer' }}>
                Tax Cleared
              </label>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <input
                type="checkbox"
                id="overdraft"
                checked={formData.overdraftProtection}
                onChange={(e) => setFormData({ ...formData, overdraftProtection: e.target.checked })}
                style={{ width: '20px', height: '20px', cursor: 'pointer' }}
              />
              <label htmlFor="overdraft" style={{ fontSize: '14px', fontWeight: '600', color: '#333', cursor: 'pointer' }}>
                Overdraft Protection
              </label>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px', marginTop: '32px' }}>
            <button
              type="submit"
              disabled={loading}
              style={{
                flex: 1,
                padding: '14px',
                background: loading ? '#ccc' : '#0066CC',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: loading ? 'not-allowed' : 'pointer'
              }}
            >
              {loading ? 'Updating...' : 'Update Settings'}
            </button>
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: '14px 32px',
                background: '#f3f4f6',
                color: '#333',
                border: 'none',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
