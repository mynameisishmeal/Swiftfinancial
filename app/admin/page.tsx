'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { initializeApp, getApps } from 'firebase/app';
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut } from 'firebase/auth';
import { useToast } from '../components/Toast';
import AdminSidebar from './components/AdminSidebar';
import AdminTopNav from './components/AdminTopNav';
import LiveChatTab from './components/LiveChatTab';
import ManageAccountsTab from './components/ManageAccountsTab';
import CreateAccountTab from './components/CreateAccountTab';
import AdminSettingsTab from './components/AdminSettingsTab';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export default function AdminDashboard() {
  const [accounts, setAccounts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAccount, setSelectedAccount] = useState<any>(null);
  const [amount, setAmount] = useState('');
  const [claimIdentifier, setClaimIdentifier] = useState('');
  const [message, setMessage] = useState('');
  const [userRole, setUserRole] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [googleVerified, setGoogleVerified] = useState(false);
  const [googleEmail, setGoogleEmail] = useState('');
  const [showMenu, setShowMenu] = useState(false);
  const [userLimit, setUserLimit] = useState(0);
  const [usersCreated, setUsersCreated] = useState(0);
  const [formError, setFormError] = useState('');
  const [activeTab, setActiveTab] = useState('accounts');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isDesktop, setIsDesktop] = useState(false);
  const [liveChats, setLiveChats] = useState<any[]>([]);
  const [selectedChat, setSelectedChat] = useState<any>(null);
  const [adminMessage, setAdminMessage] = useState('');
  const [homepageChatMessages, setHomepageChatMessages] = useState<any[]>([]);
  const [homepageReply, setHomepageReply] = useState('');
  const router = useRouter();
  const { showToast, ToastComponent } = useToast();

  useEffect(() => {
    const email = localStorage.getItem('userEmail');
    const role = localStorage.getItem('userRole');
    
    if (!email || !role || (role !== 'admin' && role !== 'superadmin')) {
      router.push('/');
      return;
    }
    
    setUserEmail(email);
    setUserRole(role);
    loadAllAccounts();
    loadLiveChats();
    loadGoogleBinding(email);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      const desktop = window.innerWidth >= 769;
      setIsDesktop(desktop);
      if (desktop) setSidebarOpen(true);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (activeTab === 'livechat') {
      const interval = setInterval(loadLiveChats, 3000);
      return () => clearInterval(interval);
    }
  }, [activeTab]);

  useEffect(() => {
    if (activeTab === 'homepage-chat' && userRole === 'superadmin') {
      const loadHomepageChat = async () => {
        const res = await fetch('/api/superadmin-chat');
        const data = await res.json();
        if (data.messages) {
          setHomepageChatMessages(data.messages);
        }
      };
      loadHomepageChat();
      const interval = setInterval(loadHomepageChat, 3000);
      return () => clearInterval(interval);
    }
  }, [activeTab, userRole]);

  const loadAllAccounts = async () => {
    setLoading(true);
    const email = localStorage.getItem('userEmail');
    const role = localStorage.getItem('userRole');
    const res = await fetch(`/api/admin/accounts?adminEmail=${email}&role=${role}`);
    const data = await res.json();
    if (data.accounts) {
      setAccounts(data.accounts);
      setUsersCreated(data.accounts.filter((acc: any) => acc.role === 'user').length);
    }
    if (role === 'admin') {
      const adminRes = await fetch(`/api/admin/self?email=${email}`);
      const adminData = await adminRes.json();
      if (adminData.userLimit) setUserLimit(adminData.userLimit);
    }
    setLoading(false);
  };

  const loadLiveChats = async () => {
    const res = await fetch(`/api/livechat?adminEmail=${userEmail}`);
    const data = await res.json();
    if (data.chats) setLiveChats(data.chats);
  };

  const loadGoogleBinding = async (email: string) => {
    const res = await fetch(`/api/admin/google-binding?email=${email}`);
    const data = await res.json();
    if (data.googleEmail) setGoogleEmail(data.googleEmail);
  };

  const adjustBalance = async (type: string) => {
    if (!selectedAccount || !amount) return;
    const res = await fetch('/api/admin/adjust', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ accountId: selectedAccount.accountId, amount: parseFloat(amount), type }),
    });
    const data = await res.json();
    showToast(data.message, 'success');
    setAmount('');
    await loadAllAccounts();
  };

  const deleteAccount = async (accountId: string) => {
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

  const toggleTaxClearance = async () => {
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

  const changeRole = async (newRole: string) => {
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

  const assignToSelf = async () => {
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

  const claimUser = async (identifier: string) => {
    const res = await fetch('/api/admin/claim', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identifier, adminEmail: userEmail }),
    });
    const data = await res.json();
    showToast(data.message, 'success');
    await loadAllAccounts();
  };

  const updateUserDetails = async (accountId: string, name: string, email: string, password: string) => {
    const res = await fetch('/api/admin/accounts', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ accountId, name, email, password }),
    });
    const data = await res.json();
    showToast(data.message, 'success');
    await loadAllAccounts();
  };

  const verifyWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const email = result.user.email;
      const res = await fetch(`/api/admin/verify-google?email=${email}&adminEmail=${userEmail}`);
      const data = await res.json();
      if (data.verified) {
        setGoogleVerified(true);
        setGoogleEmail(email!);
        showToast('Google verification successful', 'success');
      } else {
        if (confirm(`Bind ${email} to your admin account?`)) {
          const bindRes = await fetch('/api/admin/bind-google', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ adminEmail: userEmail, googleEmail: email }),
          });
          if (bindRes.ok) {
            setGoogleVerified(true);
            setGoogleEmail(email!);
            showToast('Google account bound', 'success');
          } else {
            await signOut(auth);
            showToast('Failed to bind', 'error');
          }
        } else {
          await signOut(auth);
        }
      }
    } catch (error) {
      showToast('Google sign-in failed', 'error');
    }
  };

  const signOutGoogle = async () => {
    await signOut(auth);
    setGoogleVerified(false);
    setGoogleEmail('');
  };

  const bindGoogleAccount = async () => {
    try {
      setLoading(true);
      const result = await signInWithPopup(auth, googleProvider);
      const googleEmail = result.user.email;
      const res = await fetch('/api/admin/bind-google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ adminEmail: userEmail, googleEmail }),
      });
      const data = await res.json();
      if (res.ok) {
        setGoogleEmail(googleEmail!);
        showToast('Google account bound successfully', 'success');
      } else {
        showToast(data.message, 'error');
      }
    } catch (error) {
      showToast('Failed to bind Google account', 'error');
    } finally {
      setLoading(false);
    }
  };

  const unbindGoogleAccount = async () => {
    if (!confirm('Unbind Google account?')) return;
    setLoading(true);
    try {
      await signOut(auth);
    } catch (error) {}
    const res = await fetch('/api/admin/bind-google', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ adminEmail: userEmail }),
    });
    const data = await res.json();
    if (res.ok) {
      setGoogleEmail('');
      showToast('Google account unbound', 'success');
    } else {
      showToast(data.message, 'error');
    }
    setLoading(false);
  };

  const handleAdminReply = async () => {
    if (!adminMessage.trim() || !selectedChat) return;
    await fetch('/api/livechat', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userEmail: selectedChat.userEmail, message: adminMessage.trim(), timestamp: new Date() }),
    });
    setAdminMessage('');
    await loadLiveChats();
    const updatedChat = liveChats.find(c => c.userEmail === selectedChat.userEmail);
    if (updatedChat) setSelectedChat(updatedChat);
  };

  const handleHomepageReply = async () => {
    if (!homepageReply.trim()) return;
    
    await fetch('/api/superadmin-chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        message: homepageReply.trim(), 
        sender: 'admin',
        timestamp: new Date() 
      }),
    });
    
    setHomepageReply('');
    const res = await fetch('/api/superadmin-chat');
    const data = await res.json();
    if (data.messages) {
      setHomepageChatMessages(data.messages);
    }
  };

  const logout = () => {
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userRole');
    router.push('/');
  };

  const totalBalance = accounts.reduce((sum, acc) => sum + (acc.balance || 0), 0);
  const totalUnreadChats = liveChats.reduce((sum, chat) => sum + (chat.unreadCount || 0), 0);

  return (
    <>
      <style jsx>{`
        * { margin: 0; padding: 0; box-sizing: border-box; }
        .app-container { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #F4F4F4; min-height: 100vh; }
        .sidebar { width: 260px; background: white; border-right: 1px solid #e5e7eb; position: fixed; left: 0; top: 0; bottom: 0; transition: transform 0.3s ease; z-index: 100; display: none; overflow-y: auto; }
        .mobile-menu { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); z-index: 200; display: flex; }
        .mobile-menu-content { width: 260px; background: white; height: 100%; overflow-y: auto; }
        @media (min-width: 769px) {
          .sidebar { display: flex; flex-direction: column; }
          .sidebar.closed { transform: translateX(-260px); }
          .main-content-wrapper { margin-left: 260px; transition: margin-left 0.3s ease; }
          .main-content-wrapper.sidebar-closed { margin-left: 0; }
        }
        @media (max-width: 768px) {
          .main-content-wrapper { margin-left: 0; }
        }
        .content { padding: 24px; }
        .stat-card { background: white; border-radius: 12px; padding: 24px; box-shadow: 0 4px 6px rgba(0,0,0,0.05); box-sizing: border-box; overflow: hidden; }
        .stat-label { font-size: 12px; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 8px; word-break: break-word; }
        .stat-value { font-size: 28px; font-weight: 700; color: #111827; word-break: break-all; }
      `}</style>

      <div className="app-container">
        {ToastComponent}
        {isDesktop && (
          <div className={`sidebar ${sidebarOpen ? '' : 'closed'}`}>
            <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} totalUnreadChats={totalUnreadChats} userRole={userRole} />
          </div>
        )}

        {showMenu && !isDesktop && (
          <div className="mobile-menu" onClick={() => setShowMenu(false)}>
            <div className="mobile-menu-content" onClick={(e) => e.stopPropagation()}>
              <AdminSidebar activeTab={activeTab} setActiveTab={(tab) => { setActiveTab(tab); setShowMenu(false); }} totalUnreadChats={totalUnreadChats} userRole={userRole} />
            </div>
          </div>
        )}

        <div className={`main-content-wrapper ${sidebarOpen ? '' : 'sidebar-closed'}`}>
          <AdminTopNav 
            isDesktop={isDesktop} 
            sidebarOpen={sidebarOpen} 
            setSidebarOpen={setSidebarOpen} 
            setShowMenu={setShowMenu} 
            userEmail={userEmail} 
            userRole={userRole} 
            logout={logout} 
          />

          <div className="content">

            {activeTab === 'accounts' && (
              <>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '24px', marginBottom: '32px' }}>
                  <div className="stat-card">
                    <div className="stat-label">TOTAL ACCOUNTS</div>
                    <div className="stat-value">{accounts.length}</div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-label">TOTAL BALANCE</div>
                    <div className="stat-value">${totalBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                  </div>
                  {userRole === 'admin' && (
                    <div className="stat-card">
                      <div className="stat-label">USERS LEFT TO CREATE</div>
                      <div className="stat-value">{Math.max(0, userLimit - usersCreated)}/{userLimit}</div>
                    </div>
                  )}
                  <div className="stat-card">
                    <div className="stat-label">SYSTEM STATUS</div>
                    <div style={{ fontSize: '16px', color: '#10b981', marginTop: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981' }}></div>
                      Online
                    </div>
                  </div>
                </div>
                <ManageAccountsTab 
                  accounts={accounts} 
                  selectedAccount={selectedAccount} 
                  setSelectedAccount={setSelectedAccount} 
                  amount={amount} 
                  setAmount={setAmount} 
                  adjustBalance={adjustBalance} 
                  deleteAccount={deleteAccount} 
                  toggleTaxClearance={toggleTaxClearance} 
                  changeRole={changeRole} 
                  assignToSelf={assignToSelf} 
                  userRole={userRole} 
                  loading={loading}
                  updateUserDetails={updateUserDetails}
                />
              </>
            )}

            {activeTab === 'create' && (
              <CreateAccountTab 
                userEmail={userEmail} 
                userRole={userRole} 
                setFormError={setFormError} 
                setMessage={setMessage} 
                loadAllAccounts={loadAllAccounts}
                claimIdentifier={claimIdentifier}
                setClaimIdentifier={setClaimIdentifier}
                claimUser={claimUser}
              />
            )}

            {activeTab === 'livechat' && (
              <LiveChatTab 
                liveChats={liveChats} 
                selectedChat={selectedChat} 
                setSelectedChat={setSelectedChat} 
                adminMessage={adminMessage} 
                setAdminMessage={setAdminMessage} 
                handleAdminReply={handleAdminReply} 
              />
            )}

            {activeTab === 'settings' && (
              <AdminSettingsTab 
                googleEmail={googleEmail} 
                bindGoogleAccount={bindGoogleAccount} 
                unbindGoogleAccount={unbindGoogleAccount} 
                loading={loading}
                userRole={userRole}
                showToast={(msg: string, type: 'success' | 'error') => showToast(msg, type)}
              />
            )}

            {activeTab === 'homepage-chat' && userRole === 'superadmin' && (
              <div className="stat-card">
                <h2 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '24px', color: '#111827' }}>Homepage Live Chat</h2>
                <div style={{ display: 'flex', flexDirection: 'column', height: '500px' }}>
                  <div style={{ flex: 1, overflowY: 'auto', marginBottom: '16px', border: '1px solid #e5e7eb', borderRadius: '8px', padding: '16px', background: '#f9fafb' }}>
                    {homepageChatMessages.length === 0 && (
                      <div style={{ textAlign: 'center', padding: '40px 20px', color: '#6b7280' }}>
                        <div style={{ fontSize: '48px', marginBottom: '16px' }}>💬</div>
                        <div style={{ fontSize: '16px', fontWeight: '600', color: '#111827', marginBottom: '8px' }}>No messages yet</div>
                        <div style={{ fontSize: '14px' }}>Messages from homepage visitors will appear here</div>
                      </div>
                    )}
                    {homepageChatMessages.map((msg: any, idx: number) => (
                      <div key={idx} style={{ display: 'flex', justifyContent: msg.sender === 'visitor' ? 'flex-start' : 'flex-end', marginBottom: '12px' }}>
                        <div style={{ maxWidth: '70%', padding: '12px 16px', borderRadius: '16px', background: msg.sender === 'visitor' ? 'white' : '#E31837', color: msg.sender === 'visitor' ? '#111827' : 'white', boxShadow: msg.sender === 'visitor' ? '0 2px 4px rgba(0,0,0,0.1)' : 'none' }}>
                          <div style={{ fontSize: '14px', marginBottom: '4px' }}>{msg.message}</div>
                          <div style={{ fontSize: '11px', opacity: 0.7 }}>{new Date(msg.timestamp).toLocaleString()}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <input 
                      type="text" 
                      value={homepageReply} 
                      onChange={(e) => setHomepageReply(e.target.value)} 
                      onKeyPress={(e) => e.key === 'Enter' && handleHomepageReply()} 
                      placeholder="Type your reply..." 
                      style={{ flex: 1, padding: '12px 16px', border: '2px solid #e5e7eb', borderRadius: '24px', fontSize: '14px', outline: 'none' }} 
                    />
                    <button 
                      onClick={handleHomepageReply} 
                      disabled={!homepageReply.trim()} 
                      style={{ width: '48px', height: '48px', borderRadius: '50%', background: homepageReply.trim() ? '#E31837' : '#e5e7eb', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: homepageReply.trim() ? 'pointer' : 'not-allowed', color: 'white' }}
                    >
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <path d="M18 2L9 11M18 2l-6 16-3-7-7-3 16-6z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {formError && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }} onClick={() => setFormError('')}>
            <div style={{ background: 'white', padding: '24px', borderRadius: '8px', maxWidth: '400px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }} onClick={(e) => e.stopPropagation()}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#fee2e2', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>❌</div>
                <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#111827', margin: 0 }}>Error</h3>
              </div>
              <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '20px' }}>{formError}</p>
              <button onClick={() => setFormError('')} style={{ width: '100%', padding: '12px', background: '#E31837', color: 'white', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: 600, cursor: 'pointer' }}>OK</button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
