import React, { useState, useEffect } from 'react';

export default function AssignUsersTab({ userEmail }: { userEmail: string }) {
  const [users, setUsers] = useState<any[]>([]);
  const [admins, setAdmins] = useState<any[]>([]);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [selectedAdmin, setSelectedAdmin] = useState<string>('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const res = await fetch(`/api/admin/accounts?adminEmail=${userEmail}&role=superadmin`);
    const data = await res.json();
    if (data.accounts) {
      setUsers(data.accounts.filter((a: any) => a.role === 'user'));
      setAdmins(data.accounts.filter((a: any) => a.role === 'admin'));
    }
  };

  const handleAssign = async () => {
    if (!selectedUser || !selectedAdmin) return;
    const res = await fetch('/api/superadmin/assign-user', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        userId: selectedUser.accountId, 
        adminEmail: selectedAdmin,
        superadminEmail: userEmail
      }),
    });
    const data = await res.json();
    alert(data.message);
    loadData();
    setSelectedUser(null);
    setSelectedAdmin('');
  };

  return (
    <>
      <style jsx>{`
        .card { background: white; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.05); overflow: hidden; }
        .card-header { padding: 20px 24px; border-bottom: 1px solid #e5e7eb; }
        .card-title { font-size: 18px; font-weight: 700; color: #111827; }
        .card-content { padding: 24px; }
        .user-item { border: 1px solid #e5e7eb; padding: 16px; margin-bottom: 12px; cursor: pointer; border-radius: 8px; transition: all 0.2s; }
        .user-item:hover { border-color: #E31837; box-shadow: 0 2px 8px rgba(227, 24, 55, 0.1); }
        .user-item.selected { border-color: #E31837; background: #fef2f2; }
        .logo { width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 700; color: white; }
        .btn { padding: 12px 24px; border-radius: 8px; border: none; font-size: 14px; font-weight: 600; cursor: pointer; transition: all 0.2s; }
        .btn-primary { background: #E31837; color: white; }
        .btn-primary:hover { background: #c41530; }
        .btn:disabled { opacity: 0.5; cursor: not-allowed; }
      `}</style>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '24px' }}>
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Users ({users.length})</h2>
          </div>
          <div className="card-content" style={{ maxHeight: '600px', overflowY: 'auto' }}>
            {users.map((user) => (
              <div 
                key={user.accountId} 
                onClick={() => setSelectedUser(user)}
                className={`user-item ${selectedUser?.accountId === user.accountId ? 'selected' : ''}`}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div className="logo" style={{ background: '#3b82f6' }}>
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontWeight: '600', color: '#111827', marginBottom: '4px' }}>{user.name}</p>
                    <p style={{ fontSize: '12px', color: '#6b7280' }}>{user.email}</p>
                    {user.managedBy && (
                      <p style={{ fontSize: '11px', color: '#10b981', marginTop: '4px' }}>
                        Managed by: {user.managedBy}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Admins ({admins.length})</h2>
          </div>
          <div className="card-content" style={{ maxHeight: '600px', overflowY: 'auto' }}>
            {admins.map((admin) => (
              <div 
                key={admin.accountId} 
                onClick={() => setSelectedAdmin(admin.email)}
                className={`user-item ${selectedAdmin === admin.email ? 'selected' : ''}`}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div className="logo" style={{ background: '#0055C4' }}>
                    {admin.name.charAt(0).toUpperCase()}
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontWeight: '600', color: '#111827', marginBottom: '4px' }}>{admin.name}</p>
                    <p style={{ fontSize: '12px', color: '#6b7280' }}>{admin.email}</p>
                    <p style={{ fontSize: '11px', color: '#6b7280', marginTop: '4px' }}>
                      Limit: {admin.userLimit || 0}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Assign User</h2>
          </div>
          <div className="card-content">
            {selectedUser && selectedAdmin ? (
              <div>
                <div style={{ background: '#f9fafb', padding: '16px', borderRadius: '8px', marginBottom: '16px' }}>
                  <p style={{ fontSize: '12px', color: '#6b7280', marginBottom: '8px' }}>SELECTED USER</p>
                  <p style={{ fontWeight: '600', color: '#111827' }}>{selectedUser.name}</p>
                  <p style={{ fontSize: '12px', color: '#6b7280' }}>{selectedUser.email}</p>
                  {selectedUser.managedBy && (
                    <p style={{ fontSize: '11px', color: '#ef4444', marginTop: '8px' }}>
                      Currently: {selectedUser.managedBy}
                    </p>
                  )}
                </div>
                <div style={{ background: '#f9fafb', padding: '16px', borderRadius: '8px', marginBottom: '16px' }}>
                  <p style={{ fontSize: '12px', color: '#6b7280', marginBottom: '8px' }}>ASSIGN TO ADMIN</p>
                  <p style={{ fontWeight: '600', color: '#111827' }}>{selectedAdmin}</p>
                </div>
                <button onClick={handleAssign} className="btn btn-primary" style={{ width: '100%' }}>
                  ASSIGN USER TO ADMIN
                </button>
              </div>
            ) : (
              <p style={{ textAlign: 'center', padding: '32px', color: '#6b7280' }}>
                Select a user and an admin to assign
              </p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
