export async function insertTransaction(
  accountId: string,
  adminEmail: string,
  type: string,
  amount: string,
  description: string,
  category: string
) {
  const res = await fetch('/api/admin/insert-transaction', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ 
      accountId, 
      adminEmail,
      type,
      amount,
      description,
      category
    }),
  });
  return await res.json();
}

export async function modifyTransaction(
  accountId: string,
  adminEmail: string,
  action: 'edit' | 'delete',
  transactionIndex: number,
  updates?: any
) {
  const res = await fetch('/api/admin/modify-transaction', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      accountId,
      adminEmail,
      action,
      transactionIndex,
      updates
    }),
  });
  return await res.json();
}

export async function modifyUserFinancials(
  accountId: string,
  adminEmail: string,
  updates: any
) {
  const res = await fetch('/api/admin/modify-user', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      accountId,
      adminEmail,
      updates
    }),
  });
  return await res.json();
}

export async function generateOTP(adminEmail: string, userEmail: string) {
  const res = await fetch('/api/admin/send-otp', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      action: 'generate',
      adminEmail,
      userEmail
    }),
  });
  return await res.json();
}

export async function clearOTP(adminEmail: string, userEmail: string) {
  const res = await fetch('/api/admin/send-otp', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      action: 'clear',
      adminEmail,
      userEmail
    }),
  });
  return await res.json();
}

export async function regenerateHistory(
  accountId: string,
  adminEmail: string,
  mockHistory: any
) {
  const res = await fetch('/api/admin/regen-history', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      accountId,
      adminEmail,
      mockHistory
    }),
  });
  return await res.json();
}
