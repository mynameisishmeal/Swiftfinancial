import { DollarSign, ArrowRightLeft, Camera, PieChart } from 'lucide-react';

interface MenuOverlayProps {
  showMenu: boolean;
  setShowMenu: (show: boolean) => void;
  router: any;
  logout: () => void;
  setActiveTab: (tab: string) => void;
  setActiveNav: (nav: string) => void;
}

export function MenuOverlay(props: MenuOverlayProps) {
  const { showMenu, setShowMenu, router, logout, setActiveTab, setActiveNav } = props;

  if (!showMenu) return null;

  return (
    <>
      <style jsx>{`
        /* No additional styles needed - using inline styles */
      `}</style>
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0,0,0,0.5)',
      zIndex: 999
    }} onClick={() => setShowMenu(false)}>
      <div style={{
        background: 'white',
        width: '280px',
        height: '100%',
        padding: '20px',
        boxShadow: '2px 0 8px rgba(0,0,0,0.2)'
      }} onClick={(e) => e.stopPropagation()}>
        <h2 style={{ marginBottom: '24px', fontSize: '20px', fontWeight: 700 }}>Menu</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <button onClick={() => { router.push('/profile'); setShowMenu(false); }} style={{ padding: '12px', textAlign: 'left', background: 'none', border: 'none', cursor: 'pointer', fontSize: '16px' }}>Profile</button>
          <button onClick={() => { router.push('/help'); setShowMenu(false); }} style={{ padding: '12px', textAlign: 'left', background: 'none', border: 'none', cursor: 'pointer', fontSize: '16px' }}>Help & Support</button>
          <button onClick={() => { setShowMenu(false); setActiveTab('more'); setActiveNav('more'); }} style={{ padding: '12px', textAlign: 'left', background: 'none', border: 'none', cursor: 'pointer', fontSize: '16px' }}>Settings</button>
          <button onClick={() => { logout(); setShowMenu(false); }} style={{ padding: '12px', textAlign: 'left', background: 'none', border: 'none', cursor: 'pointer', fontSize: '16px', color: '#E31837' }}>Log Out</button>
        </div>
      </div>
    </div>
    </>
  );
}

interface BottomNavProps {
  activeNav: string;
  setActiveNav: (nav: string) => void;
  setActiveTab: (tab: string) => void;
}

export function BottomNav(props: BottomNavProps) {
  const { activeNav, setActiveNav, setActiveTab } = props;

  return (
    <>
      <style jsx>{`
        .bottom-nav { position: fixed; bottom: 0; left: 0; right: 0; background: white; display: grid; grid-template-columns: repeat(4, 1fr); box-shadow: 0 -2px 8px rgba(0,0,0,0.1); padding: 8px 0; z-index: 50; }
        .nav-item { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 4px; padding: 8px; background: none; border: none; cursor: pointer; width: 100%; }
        .nav-item.active { color: #0055C4; }
        .nav-item.inactive { color: #555; }
        .nav-label { font-size: 10px; font-weight: 600; text-align: center; }
        .icon-circle { width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .icon-circle.active { background: #0055C4; color: white; }
        .icon-circle.inactive { border: 2px solid #555; color: #555; }
        @media (min-width: 769px) {
          .bottom-nav { display: none; }
        }
      `}</style>
    <nav className="bottom-nav">
      <button className={`nav-item ${activeNav === 'accounts' ? 'active' : 'inactive'}`} onClick={() => { setActiveNav('accounts'); setActiveTab('accounts'); }}>
        <div className={`icon-circle ${activeNav === 'accounts' ? 'active' : 'inactive'}`}>
          <DollarSign size={18} />
        </div>
        <span className="nav-label">Accounts</span>
      </button>
      <button className={`nav-item ${activeNav === 'transfer' ? 'active' : 'inactive'}`} onClick={() => { setActiveNav('transfer'); setActiveTab('transfer'); }}>
        <div className={`icon-circle ${activeNav === 'transfer' ? 'active' : 'inactive'}`}>
          <ArrowRightLeft size={18} />
        </div>
        <span className="nav-label">Pay & Transfer</span>
      </button>
      <button className={`nav-item ${activeNav === 'deposit' ? 'active' : 'inactive'}`} onClick={() => { setActiveNav('deposit'); setActiveTab('deposit'); }}>
        <div className={`icon-circle ${activeNav === 'deposit' ? 'active' : 'inactive'}`}>
          <Camera size={18} />
        </div>
        <span className="nav-label">Deposit Checks</span>
      </button>
      <button className={`nav-item ${activeNav === 'more' ? 'active' : 'inactive'}`} onClick={() => { setActiveNav('more'); setActiveTab('more'); }}>
        <div className={`icon-circle ${activeNav === 'more' ? 'active' : 'inactive'}`}>
          <PieChart size={18} />
        </div>
        <span className="nav-label">More</span>
      </button>
    </nav>
    </>
  );
}
