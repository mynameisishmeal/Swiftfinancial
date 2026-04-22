import { Menu, Mail, ShoppingCart, Search } from 'lucide-react';

interface TopNavigationProps {
  isDesktop: boolean;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  setShowMenu: (show: boolean) => void;
  showMenu: boolean;
  showInbox: boolean;
  setShowInbox: (show: boolean) => void;
  showProducts: boolean;
  setShowProducts: (show: boolean) => void;
  showNotifications: boolean;
  setShowNotifications: (show: boolean) => void;
  showProfileMenu: boolean;
  setShowProfileMenu: (show: boolean) => void;
  avatar: string;
  name: string;
  searchQuery: string;
  handleSearch: (query: string) => void;
  showSearchResults: boolean;
  setShowSearchResults: (show: boolean) => void;
  searchResults: any[];
  showAria: boolean;
  setshowAria: (show: boolean) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  showToast: (message: string, type: 'success' | 'error') => void;
  router: any;
  handleAvatarChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  logout: () => void;
  notifications: any[];
  email: string;
  loadNotifications: (email: string) => void;
}

export default function TopNavigation(props: TopNavigationProps) {
  const {
    isDesktop, sidebarOpen, setSidebarOpen, setShowMenu, showMenu,
    showInbox, setShowInbox, showProducts, setShowProducts,
    showNotifications, setShowNotifications, showProfileMenu, setShowProfileMenu,
    avatar, name, searchQuery, handleSearch, showSearchResults, setShowSearchResults,
    searchResults, showAria, setshowAria, activeTab, setActiveTab,
    showToast, router, handleAvatarChange, logout, notifications, email, loadNotifications
  } = props;

  const inboxNotifs = notifications.filter((n: any) => n.type === 'inbox');
  const productNotifs = notifications.filter((n: any) => n.type === 'products');
  const alertNotifs = notifications.filter((n: any) => n.type === 'alerts');
  const totalUnread = notifications.filter((n: any) => !n.read).length;

  return (
    <>
      <style jsx>{`
        .top-nav { background: white; padding: 16px 20px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); position: relative; }
        .nav-row { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 16px; }
        .menu-btn { display: flex; flex-direction: column; align-items: center; justify-content: flex-start; gap: 4px; background: none; border: none; cursor: pointer; color: #333; padding: 0; }
        .menu-btn > svg { display: block; width: 24px; height: 24px; }
        .menu-label { font-size: 11px; color: #333; line-height: 1; margin-top: 4px; }
        .quick-actions { display: flex; gap: 24px; align-items: flex-start; }
        .action-btn { display: flex; flex-direction: column; align-items: center; justify-content: flex-start; gap: 4px; background: none; border: none; cursor: pointer; color: #333; padding: 0; }
        .action-btn > svg, .action-btn > img { display: block; width: 24px; height: 24px; }
        .action-label { font-size: 11px; color: #333; line-height: 1; margin-top: 4px; }
        .badge { position: absolute; top: -4px; right: -4px; background: #e31837; color: white; border-radius: 50%; width: 16px; height: 16px; font-size: 10px; display: flex; align-items: center; justify-content: center; font-weight: 600; }
        .profile-avatar { width: 24px; height: 24px; border-radius: 50%; border: none; cursor: pointer; object-fit: cover; display: block; }
        .notification-panel { position: absolute; top: 60px; right: 80px; background: white; border-radius: 12px; box-shadow: 0 8px 24px rgba(0,0,0,0.15); width: 320px; max-height: 500px; overflow: hidden; z-index: 200; margin-top: 8px; display: flex; flex-direction: column; border: 1px solid #e5e7eb; }
        .notification-header { padding: 16px 20px; border-bottom: 1px solid #e5e7eb; font-weight: 600; color: #111827; font-size: 14px; background: white; flex-shrink: 0; }
        .notification-list { overflow-y: auto; flex: 1; max-height: 440px; }
        .notification-list::-webkit-scrollbar { width: 6px; }
        .notification-list::-webkit-scrollbar-track { background: #f1f1f1; }
        .notification-list::-webkit-scrollbar-thumb { background: #888; border-radius: 3px; }
        .notification-list::-webkit-scrollbar-thumb:hover { background: #555; }
        .notification-item { padding: 16px 20px; border-bottom: 1px solid #f3f4f6; cursor: pointer; transition: background 0.2s; }
        .notification-item:hover { background: #f9fafb; }
        .notification-item:last-child { border-bottom: none; }
        .notification-title { font-size: 14px; font-weight: 600; color: #111827; margin-bottom: 4px; }
        .notification-text { font-size: 13px; color: #6b7280; margin-bottom: 4px; }
        .notification-time { font-size: 12px; color: #9ca3af; }
        .search-row { display: flex; gap: 12px; align-items: center; margin-bottom: 16px; }
        .search-pill { flex: 1; background: #EAEAEA; border-radius: 24px; padding: 12px 16px; display: flex; align-items: center; gap: 8px; }
        .search-pill input { flex: 1; background: none; border: none; outline: none; color: #555; font-size: 14px; }
        .aria-btn { width: 48px; height: 48px; border-radius: 50%; background: #E31837; border: none; display: flex; align-items: center; justify-content: center; cursor: pointer; color: white; }
        .search-results-panel { position: absolute; top: 100%; left: 0; right: 60px; background: white; border-radius: 12px; box-shadow: 0 8px 24px rgba(0,0,0,0.15); max-height: 400px; overflow-y: auto; z-index: 200; margin-top: 8px; border: 1px solid #e5e7eb; }
        .search-result-item { padding: 16px 20px; border-bottom: 1px solid #f3f4f6; cursor: pointer; transition: background 0.2s; display: flex; align-items: center; gap: 12px; }
        .search-result-item:hover { background: #f9fafb; }
        .search-result-item:last-child { border-bottom: none; }
        .search-result-icon { width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .search-result-content { flex: 1; }
        .search-result-title { font-size: 14px; font-weight: 600; color: #111827; margin-bottom: 4px; }
        .search-result-subtitle { font-size: 13px; color: #6b7280; }
        .tabs { display: flex; border-bottom: 1px solid #E5E7EB; }
        .tab { flex: 1; padding: 12px; text-align: center; font-size: 13px; font-weight: 600; letter-spacing: 0.5px; cursor: pointer; border: none; background: none; position: relative; }
        .tab.active { color: #E31837; }
        .tab.active::after { content: ''; position: absolute; bottom: -1px; left: 0; right: 0; height: 3px; background: #E31837; }
        .tab.inactive { color: #6B7280; }
      `}</style>
    <div className="top-nav">
      <div className="nav-row">
        <button className="menu-btn" onClick={() => isDesktop ? setSidebarOpen(!sidebarOpen) : setShowMenu(!showMenu)}>
          <Menu size={24} />
          <span className="menu-label">Menu</span>
        </button>
        <div className="quick-actions">
          <button className="action-btn" onClick={() => { setShowInbox(!showInbox); setShowProducts(false); setShowNotifications(false); setShowProfileMenu(false); }} style={{ position: 'relative' }}>
            <div style={{ width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Mail size={24} />
            </div>
            {inboxNotifs.filter((n: any) => !n.read).length > 0 && <span className="badge">{inboxNotifs.filter((n: any) => !n.read).length}</span>}
            <span className="action-label">Inbox</span>
          </button>
          <button className="action-btn" onClick={() => { setShowProducts(!showProducts); setShowInbox(false); setShowNotifications(false); setShowProfileMenu(false); }} style={{ position: 'relative' }}>
            <div style={{ width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ShoppingCart size={24} />
            </div>
            {productNotifs.filter((n: any) => !n.read).length > 0 && <span className="badge">{productNotifs.filter((n: any) => !n.read).length}</span>}
            <span className="action-label">Products</span>
          </button>
          <button className="action-btn" onClick={() => { setShowNotifications(!showNotifications); setShowInbox(false); setShowProducts(false); setShowProfileMenu(false); }} style={{ position: 'relative' }}>
            <div style={{ width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
              </svg>
            </div>
            {alertNotifs.filter((n: any) => !n.read).length > 0 && <span className="badge">{alertNotifs.filter((n: any) => !n.read).length}</span>}
            <span className="action-label">Alerts</span>
          </button>
          <button className="action-btn" onClick={() => { setShowProfileMenu(!showProfileMenu); setShowInbox(false); setShowProducts(false); setShowNotifications(false); }} style={{ position: 'relative' }}>
            <div style={{ width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <img 
                src={avatar || `https://ui-avatars.com/api/?name=${name.replace(' ', '+')}&background=e31837&color=fff&size=24`}
                alt="Profile" 
                className="profile-avatar"
              />
            </div>
            <span className="action-label">Profile</span>
          </button>
        </div>
      </div>

      {/* Inbox Dropdown */}
      {showInbox && (
        <div className="notification-panel">
          <div className="notification-header">Inbox Messages ({inboxNotifs.filter((n: any) => !n.read).length})</div>
          <div className="notification-list">
            {inboxNotifs.length === 0 ? (
              <div style={{ padding: '32px 20px', textAlign: 'center', color: '#6b7280' }}>No inbox messages</div>
            ) : (
              inboxNotifs.map((notif: any) => (
                <div key={notif.id} className="notification-item" onClick={async (e) => { 
                  e.preventDefault();
                  if (!notif.read) {
                    await fetch('/api/admin/notifications', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({
                        action: 'markRead',
                        userEmail: email,
                        notification: { id: notif.id }
                      })
                    });
                  }
                  await loadNotifications(email);
                }} style={{ background: notif.read ? 'white' : '#f3f4f6' }}>
                  <div className="notification-title">{notif.title}</div>
                  <div className="notification-text">{notif.text}</div>
                  <div className="notification-time">{new Date(notif.time).toLocaleString()}</div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Products Dropdown */}
      {showProducts && (
        <div className="notification-panel">
          <div className="notification-header">Products & Services ({productNotifs.filter((n: any) => !n.read).length})</div>
          <div className="notification-list">
            {productNotifs.length === 0 ? (
              <div style={{ padding: '32px 20px', textAlign: 'center', color: '#6b7280' }}>No product notifications</div>
            ) : (
              productNotifs.map((notif: any) => (
                <div key={notif.id} className="notification-item" onClick={async (e) => { 
                  e.preventDefault();
                  if (!notif.read) {
                    await fetch('/api/admin/notifications', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({
                        action: 'markRead',
                        userEmail: email,
                        notification: { id: notif.id }
                      })
                    });
                  }
                  await loadNotifications(email);
                }} style={{ background: notif.read ? 'white' : '#f3f4f6' }}>
                  <div className="notification-title">{notif.title}</div>
                  <div className="notification-text">{notif.text}</div>
                  <div className="notification-time">{new Date(notif.time).toLocaleString()}</div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Notifications Dropdown */}
      {showNotifications && (
        <div className="notification-panel">
          <div className="notification-header">Alerts ({alertNotifs.filter((n: any) => !n.read).length})</div>
          <div className="notification-list">
            {alertNotifs.length === 0 ? (
              <div style={{ padding: '32px 20px', textAlign: 'center', color: '#6b7280' }}>No alerts</div>
            ) : (
              alertNotifs.map((notif: any) => (
                <div key={notif.id} className="notification-item" onClick={async (e) => { 
                  e.preventDefault();
                  if (!notif.read) {
                    await fetch('/api/admin/notifications', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({
                        action: 'markRead',
                        userEmail: email,
                        notification: { id: notif.id }
                      })
                    });
                  }
                  await loadNotifications(email);
                }} style={{ background: notif.read ? 'white' : '#f3f4f6' }}>
                  <div className="notification-title">{notif.title}</div>
                  <div className="notification-text">{notif.text}</div>
                  <div className="notification-time">{new Date(notif.time).toLocaleString()}</div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Profile Menu Dropdown */}
      {showProfileMenu && (
        <div className="notification-panel">
          <div className="notification-header">Profile Menu</div>
          <div className="notification-list">
            <div className="notification-item" onClick={() => { router.push('/profile'); setShowProfileMenu(false); }}>
              <div className="notification-title">View Profile</div>
              <div className="notification-text">Manage your personal information</div>
            </div>
            <div className="notification-item" onClick={() => { document.getElementById('avatar-upload')?.click(); setShowProfileMenu(false); }}>
              <div className="notification-title">Change Avatar</div>
              <div className="notification-text">Upload a new profile picture</div>
            </div>
            <div className="notification-item" onClick={() => { setShowProfileMenu(false); setActiveTab('more'); }}>
              <div className="notification-title">Settings</div>
              <div className="notification-text">Account preferences and security</div>
            </div>
            <div className="notification-item" onClick={() => { logout(); setShowProfileMenu(false); }} style={{ borderTop: '1px solid #fee2e2' }}>
              <div className="notification-title" style={{ color: '#e31837' }}>Logout</div>
              <div className="notification-text">Sign out of your account</div>
            </div>
          </div>
        </div>
      )}

      <div className="search-row" style={{ position: 'relative' }}>
        <div className="search-pill">
          <Search size={18} color="#555" />
          <input 
            type="text" 
            placeholder="Search transactions, accounts, features..." 
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            onFocus={() => searchQuery.length >= 2 && setShowSearchResults(true)}
          />
        </div>
        <button className="aria-btn" onClick={() => setshowAria(!showAria)}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M4 8C4 8 6 6 12 6C18 6 20 8 20 8" stroke="white" strokeWidth="2" strokeLinecap="round"/>
            <path d="M4 12C4 12 6 10 12 10C18 10 20 12 20 12" stroke="white" strokeWidth="2" strokeLinecap="round"/>
            <path d="M4 16C4 16 6 14 12 14C18 14 20 16 20 16" stroke="white" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </button>

        {/* Search Results */}
        {showSearchResults && searchResults.length > 0 && (
          <div className="search-results-panel">
            {searchResults.map((result, idx) => (
              <div key={idx} className="search-result-item" onClick={result.action}>
                <div className="search-result-icon" style={{ 
                  background: result.type === 'transaction' ? '#fef2f2' : result.type === 'account' ? '#eff6ff' : '#f0fdf4',
                  color: result.type === 'transaction' ? '#e31837' : result.type === 'account' ? '#0055C4' : '#10b981'
                }}>
                  {result.type === 'transaction' && <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M7 16V4M17 8v12M3 12h18"/></svg>}
                  {result.type === 'account' && <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>}
                  {result.type === 'feature' && <Search size={18} />}
                </div>
                <div className="search-result-content">
                  <div className="search-result-title">{result.title}</div>
                  <div className="search-result-subtitle">{result.subtitle}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="tabs">
        <button className={`tab ${activeTab === 'accounts' ? 'active' : 'inactive'}`} onClick={() => setActiveTab('accounts')}>ACCOUNTS</button>
        <button className={`tab ${activeTab === 'dashboard' ? 'active' : 'inactive'}`} onClick={() => setActiveTab('dashboard')}>DASHBOARD</button>
      </div>
    </div>
    </>
  );
}
