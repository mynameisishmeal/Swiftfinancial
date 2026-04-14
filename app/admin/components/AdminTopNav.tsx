import { Menu, Search, LogOut } from 'lucide-react';

export default function AdminTopNav({ 
  isDesktop, 
  sidebarOpen, 
  setSidebarOpen, 
  setShowMenu, 
  userEmail, 
  userRole, 
  logout 
}: any) {
  return (
    <>
      <style jsx>{`
        .top-nav {
          background: white;
          padding: 16px 20px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          position: sticky;
          top: 0;
          z-index: 50;
        }

        .nav-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 16px;
        }

        .menu-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          background: none;
          border: none;
          cursor: pointer;
          color: #333;
          font-size: 14px;
          font-weight: 600;
        }

        .user-info {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-left: auto;
        }

        .btn {
          padding: 8px 16px;
          border-radius: 8px;
          border: none;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          background: #f3f4f6;
          color: #111827;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .btn:hover {
          background: #e5e7eb;
        }
      `}</style>

      <div className="top-nav">
        <div className="nav-row">
          {isDesktop ? (
            <button className="menu-btn" onClick={() => setSidebarOpen(!sidebarOpen)}>
              <Menu size={20} />
              {sidebarOpen ? 'Hide' : 'Show'} Menu
            </button>
          ) : (
            <button className="menu-btn" onClick={() => setShowMenu(true)}>
              <Menu size={20} />
              Menu
            </button>
          )}

          <div className="user-info">
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '14px', fontWeight: 600, color: '#111827' }}>{userEmail}</div>
              <div style={{ fontSize: '12px', color: '#6b7280', textTransform: 'uppercase' }}>{userRole}</div>
            </div>
            <button onClick={logout} className="btn">
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
