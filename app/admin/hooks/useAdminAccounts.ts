import { useState } from 'react';

export function useAdminAccounts(userEmail: string, userRole: string) {
  const [accounts, setAccounts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAccount, setSelectedAccount] = useState<any>(null);

  const loadAllAccounts = async () => {
    setLoading(true);
    const res = await fetch(`/api/admin/accounts?adminEmail=${userEmail}&role=${userRole}`);
    const data = await res.json();
    if (data.accounts) {
      setAccounts(data.accounts);
      if (selectedAccount) {
        const updated = data.accounts.find((acc: any) => acc.accountId === selectedAccount.accountId);
        if (updated) setSelectedAccount(updated);
      }
    }
    setLoading(false);
  };

  const deleteAccount = async (accountId: string, showToast: (msg: string, type: 'success' | 'error') => void) => {
    if (!confirm('Delete this account?')) return;
    const res = await fetch('/api/admin/accounts', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ accountId }),
    });
    const data = await res.json();
    showToast(data.message, 'success');
    await loadAllAccounts();
  };

  const adjustBalance = async (type: string, amount: string, showToast: (msg: string, type: 'success' | 'error') => void) => {
    if (!selectedAccount || !amount) return;
    const res = await fetch('/api/admin/adjust', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ accountId: selectedAccount.accountId, amount: parseFloat(amount), type }),
    });
    const data = await res.json();
    showToast(data.message, 'success');
    await loadAllAccounts();
  };

  const toggleTaxClearance = async (showToast: (msg: string, type: 'success' | 'error') => void) => {
    if (!selectedAccount) return;
    const res = await fetch('/api/admin/tax', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ accountId: selectedAccount.accountId, taxCleared: !selectedAccount.taxCleared }),
    });
    const data = await res.json();
    showToast(data.message, 'success');
    await loadAllAccounts();
  };

  const changeRole = async (newRole: string, showToast: (msg: string, type: 'success' | 'error') => void) => {
    if (!selectedAccount || userRole !== 'superadmin') return;
    const res = await fetch('/api/admin/role', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ accountId: selectedAccount.accountId, role: newRole }),
    });
    const data = await res.json();
    showToast(data.message, 'success');
    await loadAllAccounts();
  };

  const assignToSelf = async (showToast: (msg: string, type: 'success' | 'error') => void) => {
    if (!selectedAccount) return;
    const res = await fetch('/api/admin/assign', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ accountId: selectedAccount.accountId, adminEmail: userEmail }),
    });
    const data = await res.json();
    showToast(data.message, 'success');
    await loadAllAccounts();
  };

  const updateUserDetails = async (accountId: string, name: string, email: string, password: string, showToast: (msg: string, type: 'success' | 'error') => void) => {
    const res = await fetch('/api/admin/accounts', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ accountId, name, email, password }),
    });
    const data = await res.json();
    showToast(data.message, 'success');
    await loadAllAccounts();
  };

  return {
    accounts,
    loading,
    selectedAccount,
    setSelectedAccount,
    loadAllAccounts,
    deleteAccount,
    adjustBalance,
    toggleTaxClearance,
    changeRole,
    assignToSelf,
    updateUserDetails
  };
}
