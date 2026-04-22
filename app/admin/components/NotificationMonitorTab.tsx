import React from 'react';

export default function NotificationMonitorTab({ accounts, userEmail }: any) {
  const [selectedUser, setSelectedUser] = React.useState<any>(null);
  const [notifications, setNotifications] = React.useState<any[]>([]);
  const [notifType, setNotifType] = React.useState('inbox');
  const [notifTitle, setNotifTitle] = React.useState('');
  const [notifText, setNotifText] = React.useState('');
  const [inboxCount, setInboxCount] = React.useState(0);
  const [productsCount, setProductsCount] = React.useState(0);
  const [alertsCount, setAlertsCount] = React.useState(0);

  React.useEffect(() => {
    if (selectedUser) {
      loadNotifications();
    }
  }, [selectedUser]);

  React.useEffect(() => {
    if (selectedUser) {
      setInboxCount(inboxNotifs.length);
      setProductsCount(productNotifs.length);
      setAlertsCount(alertNotifs.length);
    }
  }, [notifications, selectedUser]);

  const loadNotifications = async () => {
    if (!selectedUser) return;
    const res = await fetch(`/api/admin/notifications?userEmail=${selectedUser.email}`);
    const data = await res.json();
    if (data.notifications) {
      setNotifications(data.notifications);
    }
  };

  const createNotification = async () => {
    if (!selectedUser || !notifTitle || !notifText) return;
    const res = await fetch('/api/admin/notifications', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'create',
        adminEmail: userEmail,
        userEmail: selectedUser.email,
        notification: {
          type: notifType,
          title: notifTitle,
          text: notifText
        }
      }),
    });
    const data = await res.json();
    alert(data.message);
    setNotifTitle('');
    setNotifText('');
    loadNotifications();
  };

  const markRead = async (notifId: string) => {
    if (!selectedUser) return;
    await fetch('/api/admin/notifications', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'markRead',
        adminEmail: userEmail,
        userEmail: selectedUser.email,
        notification: { id: notifId }
      }),
    });
    loadNotifications();
  };

  const markUnread = async (notifId: string) => {
    if (!selectedUser) return;
    await fetch('/api/admin/notifications', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'markUnread',
        adminEmail: userEmail,
        userEmail: selectedUser.email,
        notification: { id: notifId }
      }),
    });
    loadNotifications();
  };

  const deleteNotification = async (notifId: string) => {
    if (!selectedUser || !confirm('Delete this notification?')) return;
    await fetch('/api/admin/notifications', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'delete',
        adminEmail: userEmail,
        userEmail: selectedUser.email,
        notification: { id: notifId }
      }),
    });
    loadNotifications();
  };

  const deleteAll = async () => {
    if (!selectedUser || !confirm('Delete all notifications for this user?')) return;
    await fetch('/api/admin/notifications', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'deleteAll',
        adminEmail: userEmail,
        userEmail: selectedUser.email,
        notification: {}
      }),
    });
    loadNotifications();
  };

  const updateCounts = async () => {
    if (!selectedUser) return;
    const res = await fetch('/api/admin/notifications', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'setCounts',
        adminEmail: userEmail,
        userEmail: selectedUser.email,
        counts: {
          inbox: parseInt(inboxCount.toString()),
          products: parseInt(productsCount.toString()),
          alerts: parseInt(alertsCount.toString())
        }
      }),
    });
    const data = await res.json();
    alert(data.message);
    loadNotifications();
  };

  const userAccounts = accounts.filter((acc: any) => acc.role === 'user');
  const inboxNotifs = notifications.filter(n => n.type === 'inbox');
  const productNotifs = notifications.filter(n => n.type === 'products');
  const alertNotifs = notifications.filter(n => n.type === 'alerts');
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <>
      <style jsx>{`
        .card { background: white; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.05); overflow: hidden; }
        .card-header { padding: 20px 24px; border-bottom: 1px solid #e5e7eb; }
        .card-title { font-size: 18px; font-weight: 700; color: #111827; }
        .card-content { padding: 24px; }
        .user-item { border: 1px solid #e5e7eb; padding: 12px; margin-bottom: 8px; cursor: pointer; border-radius: 8px; transition: all 0.2s; }
        .user-item:hover { border-color: #E31837; box-shadow: 0 2px 8px rgba(227, 24, 55, 0.1); }
        .user-item.selected { border-color: #E31837; background: #fef2f2; }
        .input { width: 100%; padding: 12px; border: 2px solid #e5e7eb; border-radius: 8px; font-size: 14px; outline: none; }
        .input:focus { border-color: #E31837; }
        .label { display: block; font-size: 13px; font-weight: 600; color: #111827; margin-bottom: 8px; text-transform: uppercase; letter-spacing: 0.5px; }
        .btn { padding: 12px 24px; border-radius: 8px; border: none; font-size: 14px; font-weight: 600; cursor: pointer; transition: all 0.2s; }
        .btn-primary { background: #E31837; color: white; }
        .btn-primary:hover { background: #c41530; }
        .btn:disabled { opacity: 0.5; cursor: not-allowed; }
        .notif-item { padding: 12px; border: 1px solid #e5e7eb; border-radius: 6px; margin-bottom: 8px; background: #f9fafb; }
        .notif-item.unread { background: #fff3cd; border-color: #ffc107; }
      `}</style>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '24px' }}>
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Users ({userAccounts.length})</h2>
          </div>
          <div className="card-content" style={{ maxHeight: '600px', overflowY: 'auto', padding: '16px' }}>
            {userAccounts.map((acc: any) => (
              <div 
                key={acc.accountId} 
                onClick={() => setSelectedUser(acc)}
                className={`user-item ${selectedUser?.accountId === acc.accountId ? 'selected' : ''}`}
              >
                <p style={{ fontWeight: '600', color: '#111827', marginBottom: '4px' }}>{acc.name}</p>
                <p style={{ fontSize: '12px', color: '#6b7280' }}>{acc.email}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Notification Monitor</h2>
          </div>
          <div className="card-content">
            {selectedUser ? (
              <>
                <div style={{ background: '#f9fafb', padding: '16px', border: '1px solid #e5e7eb', marginBottom: '16px', borderRadius: '8px' }}>
                  <p className="label" style={{ marginBottom: 8 }}>Selected User</p>
                  <p style={{ fontSize: '16px', fontWeight: '600', color: '#111827' }}>{selectedUser.name}</p>
                  <p style={{ fontSize: '13px', color: '#6b7280' }}>{selectedUser.email}</p>
                  <div style={{ marginTop: '12px', display: 'flex', gap: '16px' }}>
                    <div>
                      <p style={{ fontSize: '11px', color: '#6b7280', textTransform: 'uppercase' }}>Total</p>
                      <p style={{ fontSize: '20px', fontWeight: '600', color: '#111827' }}>{notifications.length}</p>
                    </div>
                    <div>
                      <p style={{ fontSize: '11px', color: '#6b7280', textTransform: 'uppercase' }}>Unread</p>
                      <p style={{ fontSize: '20px', fontWeight: '600', color: '#e31837' }}>{unreadCount}</p>
                    </div>
                    <div>
                      <p style={{ fontSize: '11px', color: '#6b7280', textTransform: 'uppercase' }}>Inbox</p>
                      <p style={{ fontSize: '20px', fontWeight: '600', color: '#0055C4' }}>{inboxNotifs.length}</p>
                    </div>
                    <div>
                      <p style={{ fontSize: '11px', color: '#6b7280', textTransform: 'uppercase' }}>Products</p>
                      <p style={{ fontSize: '20px', fontWeight: '600', color: '#10b981' }}>{productNotifs.length}</p>
                    </div>
                    <div>
                      <p style={{ fontSize: '11px', color: '#6b7280', textTransform: 'uppercase' }}>Alerts</p>
                      <p style={{ fontSize: '20px', fontWeight: '600', color: '#f59e0b' }}>{alertNotifs.length}</p>
                    </div>
                  </div>
                </div>

                <div style={{ marginBottom: '16px', paddingBottom: '16px', borderBottom: '1px solid #e5e7eb' }}>
                  <p className="label">Set Notification Counts</p>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                    <div>
                      <label style={{ fontSize: '11px', color: '#6b7280', display: 'block', marginBottom: '4px' }}>Inbox</label>
                      <input
                        type="number"
                        value={inboxCount}
                        onChange={(e) => setInboxCount(parseInt(e.target.value) || 0)}
                        className="input"
                        min="0"
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: '11px', color: '#6b7280', display: 'block', marginBottom: '4px' }}>Products</label>
                      <input
                        type="number"
                        value={productsCount}
                        onChange={(e) => setProductsCount(parseInt(e.target.value) || 0)}
                        className="input"
                        min="0"
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: '11px', color: '#6b7280', display: 'block', marginBottom: '4px' }}>Alerts</label>
                      <input
                        type="number"
                        value={alertsCount}
                        onChange={(e) => setAlertsCount(parseInt(e.target.value) || 0)}
                        className="input"
                        min="0"
                      />
                    </div>
                  </div>
                  <button
                    onClick={updateCounts}
                    className="btn btn-primary"
                    style={{ width: '100%' }}
                  >
                    UPDATE COUNTS
                  </button>
                </div>

                <div style={{ marginBottom: '16px', paddingBottom: '16px', borderBottom: '1px solid #e5e7eb' }}>
                  <p className="label">Create Notification</p>
                  <div style={{ display: 'grid', gap: '12px' }}>
                    <select value={notifType} onChange={(e) => setNotifType(e.target.value)} className="input">
                      <option value="inbox">Inbox</option>
                      <option value="products">Products</option>
                      <option value="alerts">Alerts</option>
                    </select>
                    <input
                      type="text"
                      value={notifTitle}
                      onChange={(e) => setNotifTitle(e.target.value)}
                      className="input"
                      placeholder="Notification Title"
                    />
                    <textarea
                      value={notifText}
                      onChange={(e) => setNotifText(e.target.value)}
                      className="input"
                      placeholder="Notification Text"
                      rows={3}
                    />
                    <button
                      onClick={createNotification}
                      disabled={!notifTitle || !notifText}
                      className="btn btn-primary"
                    >
                      CREATE NOTIFICATION
                    </button>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <p className="label" style={{ marginBottom: 0 }}>All Notifications ({notifications.length})</p>
                  <button onClick={deleteAll} style={{ padding: '6px 12px', background: '#ef4444', color: 'white', border: 'none', borderRadius: '6px', fontSize: '12px', fontWeight: '600', cursor: 'pointer' }}>
                    DELETE ALL
                  </button>
                </div>

                <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                  {notifications.length === 0 ? (
                    <p style={{ textAlign: 'center', padding: '32px', color: '#6b7280' }}>No notifications</p>
                  ) : (
                    notifications.map((notif: any) => (
                      <div key={notif.id} className={`notif-item ${!notif.read ? 'unread' : ''}`}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '8px' }}>
                          <div style={{ flex: 1 }}>
                            <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '4px' }}>
                              <span style={{ fontSize: '10px', padding: '2px 6px', borderRadius: '4px', background: notif.type === 'inbox' ? '#dbeafe' : notif.type === 'products' ? '#d1fae5' : '#fef3c7', color: notif.type === 'inbox' ? '#1e40af' : notif.type === 'products' ? '#065f46' : '#92400e', fontWeight: '600', textTransform: 'uppercase' }}>
                                {notif.type}
                              </span>
                              {!notif.read && <span style={{ fontSize: '10px', padding: '2px 6px', borderRadius: '4px', background: '#e31837', color: 'white', fontWeight: '600' }}>UNREAD</span>}
                            </div>
                            <p style={{ fontSize: '13px', fontWeight: '600', color: '#111827', marginBottom: '4px' }}>{notif.title}</p>
                            <p style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>{notif.text}</p>
                            <p style={{ fontSize: '10px', color: '#9ca3af' }}>{new Date(notif.time).toLocaleString()}</p>
                          </div>
                          <div style={{ display: 'flex', gap: '4px', flexDirection: 'column' }}>
                            {notif.read ? (
                              <button onClick={() => markUnread(notif.id)} style={{ padding: '4px 8px', background: '#f59e0b', color: 'white', border: 'none', borderRadius: '4px', fontSize: '10px', cursor: 'pointer', whiteSpace: 'nowrap' }}>
                                UNREAD
                              </button>
                            ) : (
                              <button onClick={() => markRead(notif.id)} style={{ padding: '4px 8px', background: '#10b981', color: 'white', border: 'none', borderRadius: '4px', fontSize: '10px', cursor: 'pointer', whiteSpace: 'nowrap' }}>
                                READ
                              </button>
                            )}
                            <button onClick={() => deleteNotification(notif.id)} style={{ padding: '4px 8px', background: '#ef4444', color: 'white', border: 'none', borderRadius: '4px', fontSize: '10px', cursor: 'pointer' }}>
                              DELETE
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </>
            ) : (
              <p style={{ textAlign: 'center', padding: '32px', color: '#6b7280' }}>Select a user to manage notifications</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
