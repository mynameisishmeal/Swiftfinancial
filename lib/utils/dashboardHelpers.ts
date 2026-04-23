export async function loadAccountData(userEmail: string) {
  const res = await fetch(`/api/accounts?email=${userEmail}`);
  if (!res.ok) {
    const data = await res.json();
    if (data.accountDeleted || res.status === 404) {
      return { error: 'Account deleted', data: null };
    }
  }
  const data = await res.json();
  return { error: null, data };
}

export async function loadTransactions(userEmail: string) {
  const res = await fetch(`/api/accounts?email=${userEmail}&transactions=true`);
  if (res.ok) {
    const data = await res.json();
    return data.transactions || [];
  }
  return [];
}

export async function loadNotifications(userEmail: string) {
  const res = await fetch(`/api/admin/notifications?userEmail=${userEmail}`);
  const data = await res.json();
  return data.notifications || [];
}

export async function loadCustomBanks() {
  const res = await fetch('/api/admin/custom-banks');
  const data = await res.json();
  return data.banks || [];
}

export async function updateAvatar(email: string, avatar: string) {
  const res = await fetch('/api/accounts/avatar', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, avatar }),
  });
  return res.ok;
}

export function generateStatementText(
  name: string,
  accountId: string,
  iban: string,
  email: string,
  balance: number,
  savingsBalance: number,
  creditBalance: number,
  taxCleared: boolean,
  transactions: any[]
) {
  const sanitize = (str: string) => String(str || '').replace(/[<>"'&]/g, '');
  
  return `
Swift Financial Account Statement
==================================

Account Holder: ${sanitize(name)}
Account Number: ${sanitize(accountId)}
IBAN: ${sanitize(iban)}
Email: ${sanitize(email)}
Statement Date: ${new Date().toLocaleDateString()}

Account Balances:
-------------------
Checking Balance: $${balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
Savings Balance: $${savingsBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
Credit Card Balance: $${creditBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
Total Balance: $${(balance + savingsBalance + creditBalance).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}

Account Details:
-------------------
Rewards Points: 15,000 points (≈ $150.00 value)
FICO Score: 750
Tax Status: ${taxCleared ? 'Cleared' : 'Pending'}
Card Expiry: 12/28

Transaction History (CSV Format):
-------------------
Date,Description,Type,Amount,Balance
${transactions.slice().reverse().map(t => 
  `${new Date(t.date).toLocaleDateString()},"${sanitize(t.description || t.type.replace('_', ' ')).toUpperCase()}",${sanitize(t.type)},${(t.amount || 0).toFixed(2)},${(t.balance || 0).toFixed(2)}`
).join('\n')}

-------------------
End of Statement

Swift Financial, N.A. Member FDIC.
© ${new Date().getFullYear()} Swift Financial Corporation.
  `;
}

export function downloadTextFile(content: string, filename: string) {
  const blob = new Blob([content], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
