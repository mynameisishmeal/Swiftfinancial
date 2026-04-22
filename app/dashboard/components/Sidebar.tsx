'use client';

import { Menu, DollarSign, ArrowRightLeft, Camera, PieChart, MoreHorizontal, LayoutDashboard } from 'lucide-react';

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  activeNav: string;
  setActiveNav: (nav: string) => void;
  setActiveTab: (tab: string) => void;
}

export default function Sidebar({ sidebarOpen, setSidebarOpen, activeNav, setActiveNav, setActiveTab }: SidebarProps) {
  return (
    <>
      <style jsx>{`
        .sidebar {
          width: 260px;
          background: white;
          border-right: 1px solid #e5e7eb;
          position: fixed;
          left: 0;
          top: 0;
          bottom: 0;
          transition: transform 0.3s ease;
          z-index: 100;
          display: none;
        }

        @media (min-width: 769px) {
          .sidebar {
            display: flex;
            flex-direction: column;
          }

          .sidebar.closed {
            transform: translateX(-260px);
          }
        }

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
        }

        .sidebar-nav-item:hover {
          background: #f9fafb;
        }

        .sidebar-nav-item.active {
          background: #fef2f2;
          color: #e31837;
          border-left: 3px solid #e31837;
        }
      `}</style>

      <div className={`sidebar ${sidebarOpen ? '' : 'closed'}`}>
        <div className="sidebar-header">
          <img src="/assets/sfb-logo.png" alt="Swift Financial" style={{ height: '24px' }} />
          <button onClick={() => setSidebarOpen(!sidebarOpen)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '8px' }}>
            <Menu size={20} />
          </button>
        </div>
        <nav className="sidebar-nav">
          <button className={`sidebar-nav-item ${activeNav === 'accounts' ? 'active' : ''}`} onClick={() => { setActiveNav('accounts'); setActiveTab('accounts'); }}>
            <DollarSign size={20} />
            <span>Accounts</span>
          </button>
          <button className={`sidebar-nav-item ${activeNav === 'dashboard' ? 'active' : ''}`} onClick={() => { setActiveNav('dashboard'); setActiveTab('dashboard'); }}>
            <PieChart size={20} />
            <span>Dashboard</span>
          </button>
          <button className={`sidebar-nav-item ${activeNav === 'transfer' ? 'active' : ''}`} onClick={() => { setActiveNav('transfer'); setActiveTab('transfer'); }}>
            <ArrowRightLeft size={20} />
            <span>Pay & Transfer</span>
          </button>
          <button className={`sidebar-nav-item ${activeNav === 'deposit' ? 'active' : ''}`} onClick={() => { setActiveNav('deposit'); setActiveTab('deposit'); }}>
            <Camera size={20} />
            <span>Deposit Checks</span>
          </button>
          <button className={`sidebar-nav-item ${activeNav === 'more' ? 'active' : ''}`} onClick={() => { setActiveNav('more'); setActiveTab('more'); }}>
             <PieChart size={20} />
            <span>More</span>
          </button>
        </nav>
      </div>
    </>
  );
}
