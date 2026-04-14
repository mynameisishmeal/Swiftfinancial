export default function GlobalStyles() {
  return (
    <style jsx global>{`
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }

      .app-container {
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        background: #F4F4F4;
        min-height: 100vh;
        padding-bottom: 80px;
      }

      .top-nav {
        background: white;
        padding: 16px 20px;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        position: relative;
      }

      .nav-row {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 16px;
      }

      .menu-btn {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 4px;
        background: none;
        border: none;
        cursor: pointer;
        color: #333;
      }

      .menu-label {
        font-size: 11px;
        color: #333;
      }

      .quick-actions {
        display: flex;
        gap: 24px;
      }

      .action-btn {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 4px;
        background: none;
        border: none;
        cursor: pointer;
        color: #333;
      }

      .action-label {
        font-size: 11px;
        color: #333;
      }

      .search-row {
        display: flex;
        gap: 12px;
        align-items: center;
        margin-bottom: 16px;
      }

      .search-pill {
        flex: 1;
        background: #EAEAEA;
        border-radius: 24px;
        padding: 12px 16px;
        display: flex;
        align-items: center;
        gap: 8px;
      }

      .search-pill input {
        flex: 1;
        background: none;
        border: none;
        outline: none;
        color: #555;
        font-size: 14px;
      }

      .erica-btn {
        width: 48px;
        height: 48px;
        border-radius: 50%;
        background: #E31837;
        border: none;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        color: white;
      }

      .tabs {
        display: flex;
        border-bottom: 1px solid #E5E7EB;
      }

      .tab {
        flex: 1;
        padding: 12px;
        text-align: center;
        font-size: 13px;
        font-weight: 600;
        letter-spacing: 0.5px;
        cursor: pointer;
        border: none;
        background: none;
        position: relative;
      }

      .tab.active {
        color: #E31837;
      }

      .tab.active::after {
        content: '';
        position: absolute;
        bottom: -1px;
        left: 0;
        right: 0;
        height: 3px;
        background: #E31837;
      }

      .tab.inactive {
        color: #6B7280;
      }

      .content {
        padding: 16px;
      }

      .card {
        background: white;
        border-radius: 12px;
        margin-bottom: 16px;
        box-shadow: 0 4px 6px rgba(0,0,0,0.05);
        overflow: hidden;
      }

      .toast-container {
        position: fixed;
        top: 80px;
        right: 20px;
        z-index: 1000;
        display: flex;
        flex-direction: column;
        gap: 12px;
      }

      .toast {
        background: white;
        padding: 16px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        display: flex;
        align-items: center;
        gap: 12px;
        min-width: 300px;
        animation: slideIn 0.3s ease-out;
      }

      @keyframes slideIn {
        from {
          transform: translateX(400px);
          opacity: 0;
        }
        to {
          transform: translateX(0);
          opacity: 1;
        }
      }

      .toast.success {
        border-left: 4px solid #10b981;
      }

      .toast.error {
        border-left: 4px solid #ef4444;
      }

      .toast-message {
        flex: 1;
        font-size: 14px;
        color: #111827;
        font-weight: 500;
      }

      .notification-panel {
        position: absolute;
        top: 60px;
        right: 80px;
        background: white;
        border-radius: 12px;
        box-shadow: 0 8px 24px rgba(0,0,0,0.15);
        width: 320px;
        max-height: 500px;
        overflow: hidden;
        z-index: 200;
        margin-top: 8px;
        display: flex;
        flex-direction: column;
        border: 1px solid #e5e7eb;
      }

      .notification-header {
        padding: 16px 20px;
        border-bottom: 1px solid #e5e7eb;
        font-weight: 600;
        color: #111827;
        font-size: 14px;
        background: white;
        flex-shrink: 0;
      }

      .notification-list {
        overflow-y: auto;
        flex: 1;
        max-height: 440px;
      }

      .notification-list::-webkit-scrollbar {
        width: 6px;
      }

      .notification-list::-webkit-scrollbar-track {
        background: #f1f1f1;
      }

      .notification-list::-webkit-scrollbar-thumb {
        background: #888;
        border-radius: 3px;
      }

      .notification-list::-webkit-scrollbar-thumb:hover {
        background: #555;
      }

      .notification-item {
        padding: 16px 20px;
        border-bottom: 1px solid #f3f4f6;
        cursor: pointer;
        transition: background 0.2s;
      }

      .notification-item:hover {
        background: #f9fafb;
      }

      .notification-item:last-child {
        border-bottom: none;
      }

      .notification-title {
        font-size: 14px;
        font-weight: 600;
        color: #111827;
        margin-bottom: 4px;
      }

      .notification-text {
        font-size: 13px;
        color: #6b7280;
        margin-bottom: 4px;
      }

      .notification-time {
        font-size: 12px;
        color: #9ca3af;
      }

      .badge {
        position: absolute;
        top: -4px;
        right: -4px;
        background: #e31837;
        color: white;
        border-radius: 50%;
        width: 16px;
        height: 16px;
        font-size: 10px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 600;
      }

      .search-results-panel {
        position: absolute;
        top: 100%;
        left: 0;
        right: 60px;
        background: white;
        border-radius: 12px;
        box-shadow: 0 8px 24px rgba(0,0,0,0.15);
        max-height: 400px;
        overflow-y: auto;
        z-index: 200;
        margin-top: 8px;
        border: 1px solid #e5e7eb;
      }

      .search-result-item {
        padding: 16px 20px;
        border-bottom: 1px solid #f3f4f6;
        cursor: pointer;
        transition: background 0.2s;
        display: flex;
        align-items: center;
        gap: 12px;
      }

      .search-result-item:hover {
        background: #f9fafb;
      }

      .search-result-item:last-child {
        border-bottom: none;
      }

      .search-result-icon {
        width: 36px;
        height: 36px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
      }

      .search-result-content {
        flex: 1;
      }

      .search-result-title {
        font-size: 14px;
        font-weight: 600;
        color: #111827;
        margin-bottom: 4px;
      }

      .search-result-subtitle {
        font-size: 13px;
        color: #6b7280;
      }

      .bottom-nav {
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        background: white;
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        box-shadow: 0 -2px 8px rgba(0,0,0,0.1);
        padding: 8px 0;
      }

      .nav-item {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 4px;
        padding: 8px;
        background: none;
        border: none;
        cursor: pointer;
      }

      .nav-item.active {
        color: #0055C4;
      }

      .nav-item.inactive {
        color: #555;
      }

      .nav-label {
        font-size: 10px;
        font-weight: 600;
      }

      .icon-circle {
        width: 32px;
        height: 32px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .icon-circle.active {
        background: #0055C4;
        color: white;
      }

      .icon-circle.inactive {
        border: 2px solid #555;
        color: #555;
      }

      .desktop-layout {
        display: flex;
        min-height: 100vh;
      }

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

        .app-container {
          padding-bottom: 0;
        }

        .main-content-wrapper {
          margin-left: 260px;
          transition: margin-left 0.3s ease;
        }

        .main-content-wrapper.sidebar-closed {
          margin-left: 0;
        }

        .bottom-nav {
          display: none;
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

      .profile-avatar {
        width: 32px;
        height: 32px;
        border-radius: 50%;
        border: 2px solid white;
        cursor: pointer;
        object-fit: cover;
      }
    `}</style>
  );
}
