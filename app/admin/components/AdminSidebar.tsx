import { Users, MessageSquare, Settings, UserPlus, Globe, UserCog, Bell, Building2 } from 'lucide-react';

export default function AdminSidebar({ 
  activeTab, 
  setActiveTab, 
  totalUnreadChats,
  userRole
}: { 
  activeTab: string; 
  setActiveTab: (tab: string) => void; 
  totalUnreadChats: number;
  userRole: string;
}) {
  return (
    <>
      <style jsx>{`
        .sidebar-header {
          padding: 20px;
          border-bottom: 1px solid #e5e7eb;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .sidebar-nav {
          flex: 1;
          padding: 20px 0;
          overflow-y: auto;
        }

        .sidebar-nav-item {
          padding: 16px 24px;
          display: flex;
          align-items: center;
          gap: 12px;
          cursor: pointer;
          transition: background 0.2s;
          border: none;
          background: none;
          width: 100%;
          text-align: left;
          font-size: 15px;
          color: #111827;
          position: relative;
          outline: none;
        }

        .sidebar-nav-item:hover {
          background: #f9fafb;
        }

        .sidebar-nav-item.active {
          background: #fef2f2;
          color: #e31837;
          border-left: 3px solid #e31837;
          padding-left: 21px;
        }

        .badge {
          position: absolute;
          top: 12px;
          right: 20px;
          background: #e31837;
          color: white;
          border-radius: 50%;
          min-width: 18px;
          height: 18px;
          font-size: 11px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
          padding: 0 4px;
        }
      `}</style>

      <div className="sidebar-header">
        <img src="/assets/sfb-logo.png" alt="Swift Financial" style={{ height: '24px' }} />
        <div style={{ fontSize: '11px', color: '#6b7280', fontWeight: 600 }}>ADMIN</div>
      </div>
      <nav className="sidebar-nav">
        <button className={`sidebar-nav-item ${activeTab === 'accounts' ? 'active' : ''}`} onClick={() => setActiveTab('accounts')}>
          <Users size={20} />
          <span>Manage Accounts</span>
        </button>
        <button className={`sidebar-nav-item ${activeTab === 'create' ? 'active' : ''}`} onClick={() => setActiveTab('create')}>
          <UserPlus size={20} />
          <span>Create Account</span>
        </button>
        <button className={`sidebar-nav-item ${activeTab === 'livechat' ? 'active' : ''}`} onClick={() => setActiveTab('livechat')}>
          <MessageSquare size={20} />
          <span>Live Chat</span>
          {totalUnreadChats > 0 && <div className="badge">{totalUnreadChats}</div>}
        </button>
        <button className={`sidebar-nav-item ${activeTab === 'notifications' ? 'active' : ''}`} onClick={() => setActiveTab('notifications')}>
          <Bell size={20} />
          <span>Notification Monitor</span>
        </button>
        <button className={`sidebar-nav-item ${activeTab === 'custom-banks' ? 'active' : ''}`} onClick={() => setActiveTab('custom-banks')}>
          <Building2 size={20} />
          <span>Custom Banks</span>
        </button>
        {userRole === 'superadmin' && (
          <>
            <button className={`sidebar-nav-item ${activeTab === 'assign-users' ? 'active' : ''}`} onClick={() => setActiveTab('assign-users')}>
              <UserCog size={20} />
              <span>Assign Users</span>
            </button>
            <button className={`sidebar-nav-item ${activeTab === 'homepage-chat' ? 'active' : ''}`} onClick={() => setActiveTab('homepage-chat')}>
              <Globe size={20} />
              <span>Homepage Chat</span>
            </button>
          </>
        )}
        <button className={`sidebar-nav-item ${activeTab === 'settings' ? 'active' : ''}`} onClick={() => setActiveTab('settings')}>
          <Settings size={20} />
          <span>Settings</span>
        </button>
      </nav>
    </>
  );
}
