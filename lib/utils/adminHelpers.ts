export async function loadLiveChats(adminEmail: string) {
  const res = await fetch(`/api/livechat?adminEmail=${adminEmail}`);
  const data = await res.json();
  return data.chats || [];
}

export async function loadGoogleBinding(email: string) {
  const res = await fetch(`/api/admin/google-binding?email=${email}`);
  const data = await res.json();
  return data.googleEmail || '';
}

export async function loadAdminSelf(email: string) {
  const res = await fetch(`/api/admin/self?email=${email}`);
  const data = await res.json();
  return data;
}

export async function claimUser(identifier: string, adminEmail: string) {
  const res = await fetch('/api/admin/claim', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ identifier, adminEmail }),
  });
  return await res.json();
}

export async function sendAdminReply(userEmail: string, message: string) {
  const res = await fetch('/api/livechat', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userEmail, message, timestamp: new Date() }),
  });
  return await res.json();
}

export async function bindGoogleAccount(adminEmail: string, googleEmail: string) {
  const res = await fetch('/api/admin/bind-google', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ adminEmail, googleEmail }),
  });
  return await res.json();
}

export async function unbindGoogleAccount(adminEmail: string) {
  const res = await fetch('/api/admin/bind-google', {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ adminEmail }),
  });
  return await res.json();
}
