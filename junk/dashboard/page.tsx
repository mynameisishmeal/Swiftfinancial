'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Menu, Mail, ShoppingCart, Bell, Building2, ArrowRightLeft, Camera, Settings, ChevronDown, Lock, CreditCard, DollarSign, TrendingUp, PieChart, LayoutDashboard } from 'lucide-react';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [expandedAccount, setExpandedAccount] = useState<string | null>(null);
  const [activeBottomTab, setActiveBottomTab] = useState('accounts');
  const [searchQuery, setSearchQuery] = useState('');
  const [menuOpen, setMenuOpen] = useState(true);
  
  // Real data states
  const [email, setEmail] = useState('');
  const [accountId, setAccountId] = useState('');
  const [name, setName] = useState('Jenn & Co.');
  const [avatar, setAvatar] = useState('');
  const [balance, setBalance] = useState(57213);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [taxCleared, setTaxCleared] = useState(true);
  const [userRole, setUserRole] = useState('user');
  const [cardFlipped, setCardFlipped] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showInbox, setShowInbox] = useState(false);
  const [showProducts, setShowProducts] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [paymentType, setPaymentType] = useState('transfer');
  const [payeeSearch, setPayeeSearch] = useState('');
  const [showPayeeSuggestions, setShowPayeeSuggestions] = useState(false);
  const [transferAmount, setTransferAmount] = useState('');
  const [billAmount, setBillAmount] = useState('');
  const [zelleRecipient, setZelleRecipient] = useState('');
  const [zelleAmount, setZelleAmount] = useState('');
  const [zelleMessage, setZelleMessage] = useState('');
  const [wireBank, setWireBank] = useState('');
  const [wireRouting, setWireRouting] = useState('');
  const [wireAccount, setWireAccount] = useState('');
  const [wireAmount, setWireAmount] = useState('');
  const [paymentMemo, setPaymentMemo] = useState('');
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [toasts, setToasts] = useState<Array<{id: number, message: string, type: 'success' | 'error'}>>([]);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedCard, setSelectedCard] = useState<string | null>(null);
  const [checkFront, setCheckFront] = useState<string | null>(null);
  const [checkBack, setCheckBack] = useState<string | null>(null);
  const [depositAmount, setDepositAmount] = useState('');
  const [showDepositModal, setShowDepositModal] = useState(false);
  const router = useRouter();

  const payeeList = [
    { category: 'Utilities', name: 'Duke Energy' },
    { category: 'Utilities', name: 'Pacific Gas & Electric (PG&E)' },
    { category: 'Utilities', name: 'ConEdison' },
    { category: 'Utilities', name: 'Southern California Edison' },
    { category: 'Internet & Cable', name: 'Comcast Xfinity' },
    { category: 'Internet & Cable', name: 'AT&T' },
    { category: 'Internet & Cable', name: 'Verizon Fios' },
    { category: 'Internet & Cable', name: 'Spectrum' },
    { category: 'Internet & Cable', name: 'Cox Communications' },
    { category: 'Credit Cards', name: 'American Express' },
    { category: 'Credit Cards', name: 'Chase' },
    { category: 'Credit Cards', name: 'Citibank' },
    { category: 'Credit Cards', name: 'Capital One' },
    { category: 'Credit Cards', name: 'Discover' },
  ];

  const filteredPayees = payeeSearch.length > 0
    ? payeeList.filter(p => p.name.toLowerCase().includes(payeeSearch.toLowerCase()))
    : [];

  useEffect(() => {
    const userEmail = localStorage.getItem('userEmail');
    const role = localStorage.getItem('userRole');
    if (!userEmail || role !== 'user') {
      router.push('/');
      return;
    }
    setEmail(userEmail);
    setUserRole(role || 'user');
    const savedAvatar = localStorage.getItem('userAvatar');
    if (savedAvatar) setAvatar(savedAvatar);
    loadAccount(userEmail);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.nav-icon') && !target.closest('.notification-panel')) {
        setShowInbox(false);
        setShowNotifications(false);
        setShowProducts(false);
        setShowProfileMenu(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const loadAccount = async (userEmail: string) => {
    const res = await fetch(`/api/accounts?email=${userEmail}`);
    const data = await res.json();
    if (data.balance !== undefined) {
      setBalance(data.balance);
      setAccountId(data.accountId);
      // Capitalize name properly
      const capitalizedName = data.name.split(' ').map((word: string) => 
        word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
      ).join(' ');
      setName(capitalizedName);
      setAvatar(data.avatar);
      setTaxCleared(data.taxCleared !== false);
      
      const txRes = await fetch(`/api/accounts?email=${userEmail}&transactions=true`);
      const txData = await txRes.json();
      if (txData.transactions) setTransactions(txData.transactions);
    }
  };

  const logout = () => {
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userRole');
    router.push('/');
  };

  const showToast = (message: string, type: 'success' | 'error') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3000);
  };

  const handleCheckUpload = (e: React.ChangeEvent<HTMLInputElement>, side: 'front' | 'back') => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (side === 'front') setCheckFront(reader.result as string);
        else setCheckBack(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleMobileDeposit = async () => {
    if (!checkFront || !checkBack) {
      showToast('Please upload both front and back of check', 'error');
      return;
    }
    if (!depositAmount || parseFloat(depositAmount) <= 0) {
      showToast('Please enter a valid amount', 'error');
      return;
    }
    setPaymentLoading(true);
    const res = await fetch('/api/accounts', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ accountId, amount: parseFloat(depositAmount), type: 'deposit' }),
    });
    const data = await res.json();
    showToast(`Check deposit of $${depositAmount} submitted for processing`, 'success');
    if (data.balance !== undefined) await loadAccount(email);
    setCheckFront(null);
    setCheckBack(null);
    setDepositAmount('');
    setShowDepositModal(false);
    setPaymentLoading(false);
  };

  const handleTransfer = async () => {
    if (!transferAmount || parseFloat(transferAmount) <= 0) {
      showToast('Please enter a valid amount', 'error');
      return;
    }
    if (parseFloat(transferAmount) > balance) {
      showToast('Insufficient funds', 'error');
      return;
    }
    setPaymentLoading(true);
    const res = await fetch('/api/accounts', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ accountId, amount: parseFloat(transferAmount), type: 'withdraw' }),
    });
    const data = await res.json();
    showToast(data.message || 'Transfer completed successfully', 'success');
    if (data.balance !== undefined) await loadAccount(email);
    setTransferAmount('');
    setPaymentMemo('');
    setPaymentLoading(false);
  };

  const handleBillPay = async () => {
    if (!billAmount || !payeeSearch) {
      showToast('Please select a payee and enter amount', 'error');
      return;
    }
    if (parseFloat(billAmount) > balance) {
      showToast('Insufficient funds', 'error');
      return;
    }
    setPaymentLoading(true);
    const res = await fetch('/api/accounts', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ accountId, amount: parseFloat(billAmount), type: 'withdraw' }),
    });
    const data = await res.json();
    showToast(`Bill payment of $${billAmount} to ${payeeSearch} completed`, 'success');
    if (data.balance !== undefined) await loadAccount(email);
    setBillAmount('');
    setPayeeSearch('');
    setPaymentMemo('');
    setPaymentLoading(false);
  };

  const handleZelle = async () => {
    if (!zelleAmount || !zelleRecipient) {
      showToast('Please enter recipient and amount', 'error');
      return;
    }
    if (!taxCleared) {
      showToast('Zelle blocked: You have outstanding tax issues.', 'error');
      return;
    }
    if (parseFloat(zelleAmount) > balance) {
      showToast('Insufficient funds', 'error');
      return;
    }
    setPaymentLoading(true);
    const res = await fetch('/api/accounts', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ accountId, amount: parseFloat(zelleAmount), type: 'withdraw' }),
    });
    const data = await res.json();
    showToast(`Zelle payment of $${zelleAmount} sent to ${zelleRecipient}`, 'success');
    if (data.balance !== undefined) await loadAccount(email);
    setZelleAmount('');
    setZelleRecipient('');
    setZelleMessage('');
    setPaymentMemo('');
    setPaymentLoading(false);
  };

  const handleWire = async () => {
    if (!wireBank || !wireRouting || !wireAccount || !wireAmount) {
      showToast('Please fill all wire transfer fields', 'error');
      return;
    }
    if (wireRouting.length !== 9) {
      showToast('Routing number must be exactly 9 digits', 'error');
      return;
    }
    if (parseFloat(wireAmount) > balance) {
      showToast('Insufficient funds', 'error');
      return;
    }
    setPaymentLoading(true);
    const res = await fetch('/api/accounts', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ accountId, amount: parseFloat(wireAmount), type: 'withdraw' }),
    });
    const data = await res.json();
    showToast(`Wire transfer of $${wireAmount} to ${wireBank} completed`, 'success');
    if (data.balance !== undefined) await loadAccount(email);
    setWireBank('');
    setWireRouting('');
    setWireAccount('');
    setWireAmount('');
    setPaymentMemo('');
    setPaymentLoading(false);
  };

  return (
    <>
      <style jsx>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        body {
          margin: 0;
          padding: 0;
        }
        
        .mobile-banking-app {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          background: #f5f5f5;
          min-height: 100vh;
          max-width: 100%;
          margin: 0;
          position: relative;
          padding-bottom: 80px;
        }
        
        @media (max-width: 768px) {
          .mobile-banking-app {
            max-width: 480px;
            margin: 0 auto;
            padding-bottom: 80px;
          }
        }
        
        .top-nav {
          background: #012169;
          padding: 16px 20px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          box-shadow: 0 2px 8px rgba(0,0,0,0.15);
          position: sticky;
          top: 0;
          z-index: 100;
        }
        
        .nav-left {
          display: flex;
          align-items: center;
        }
        
        .menu-icon {
          color: white;
          font-size: 24px;
          cursor: pointer;
          padding: 8px;
          min-width: 44px;
          min-height: 44px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: opacity 0.2s;
          background: transparent;
          border: none;
        }
        
        @media (max-width: 768px) {
          .menu-icon {
            display: none;
          }
        }
        
        .menu-icon:hover {
          opacity: 0.8;
        }
        
        .menu-icon:active {
          transform: scale(0.95);
        }
        
        .nav-right {
          display: flex;
          gap: 20px;
          align-items: center;
        }
        
        .nav-icon {
          position: relative;
          color: white;
          font-size: 20px;
          cursor: pointer;
          padding: 8px;
          min-width: 44px;
          min-height: 44px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: opacity 0.2s;
          background: transparent;
          border: none;
        }
        
        .nav-icon:hover {
          opacity: 0.8;
        }
        
        .nav-icon:active {
          transform: scale(0.95);
        }
        
        .badge {
          position: absolute;
          top: -8px;
          right: -8px;
          background: #e31837;
          color: white;
          border-radius: 50%;
          width: 18px;
          height: 18px;
          font-size: 11px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
        }
        
        .tab-navigation {
          background: white;
          display: flex;
          border-bottom: 2px solid #e5e7eb;
          overflow-x: auto;
          scrollbar-width: none;
        }
        
        .tab-navigation::-webkit-scrollbar {
          display: none;
        }
        
        .tab {
          padding: 16px 24px;
          cursor: pointer;
          border-bottom: 3px solid transparent;
          white-space: nowrap;
          font-size: 14px;
          font-weight: 600;
          color: #6b7280;
          transition: all 0.2s;
        }
        
        .tab.active {
          color: #e31837;
          border-bottom-color: #e31837;
        }
        
        .search-bar {
          background: white;
          padding: 16px 20px;
          border-bottom: 1px solid #e5e7eb;
        }
        
        .search-input {
          width: 100%;
          padding: 12px 16px;
          border: 2px solid #e5e7eb;
          border-radius: 24px;
          font-size: 14px;
          outline: none;
          transition: all 0.2s;
          background: #fafafa;
        }
        
        .search-input:focus {
          border-color: #e31837;
          background: white;
          box-shadow: 0 0 0 3px rgba(227, 24, 55, 0.1);
        }
        
        .main-content {
          padding: 20px;
        }
        
        @media (max-width: 768px) {
          .main-content {
            padding: 0;
          }
        }
        
        @media (min-width: 769px) {
          .main-content {
            padding: 32px;
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 24px;
          }
          
          .business-header {
            grid-column: 1 / -1;
          }
          
          .section {
            margin-bottom: 0;
          }
        }
        
        .business-header {
          background: white;
          padding: 20px;
          border-radius: 12px;
          margin-bottom: 20px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.08);
        }
        
        .business-name {
          font-size: 24px;
          font-weight: 700;
          color: #012169;
          margin-bottom: 12px;
        }
        
        .rewards-info {
          font-size: 13px;
          color: #6b7280;
          line-height: 1.5;
        }
        
        .rewards-link {
          color: #0057b8;
          text-decoration: underline;
          cursor: pointer;
          font-weight: 600;
        }
        
        .section {
          background: white;
          border-radius: 12px;
          margin-bottom: 20px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.08);
          overflow: hidden;
        }
        
        .section-header {
          background: #f8f9fa;
          padding: 16px 20px;
          border-bottom: 1px solid #e5e7eb;
        }
        
        .section-title {
          font-size: 12px;
          font-weight: 700;
          color: #6b7280;
          letter-spacing: 0.5px;
          text-transform: uppercase;
        }
        
        .account-item {
          padding: 20px;
          border-bottom: 1px solid #f3f4f6;
          cursor: pointer;
          transition: background 0.2s;
        }
        
        .account-item:hover {
          background: #f9fafb;
        }
        
        .account-item:last-child {
          border-bottom: none;
        }
        
        @media (min-width: 769px) {
          .account-item {
            padding: 24px;
          }
        }
        
        .account-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        
        .account-info {
          flex: 1;
        }
        
        .account-name {
          font-size: 16px;
          font-weight: 600;
          color: #111827;
          margin-bottom: 4px;
        }
        
        .account-number {
          font-size: 13px;
          color: #6b7280;
        }
        
        .account-balance {
          text-align: right;
          display: flex;
          align-items: center;
          gap: 12px;
        }
        
        .balance-amount {
          font-size: 24px;
          font-weight: 700;
          color: #111827;
        }
        
        .balance-amount.credit {
          color: #2563eb;
        }
        
        .expand-icon {
          color: #9ca3af;
          font-size: 20px;
          transition: transform 0.25s ease-in-out;
          min-width: 44px;
          min-height: 44px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .expand-icon.expanded {
          transform: rotate(180deg);
        }
        
        .account-details {
          padding: 16px 20px;
          background: #f9fafb;
          border-top: 1px solid #e5e7eb;
          animation: slideDown 0.25s ease-in-out;
        }
        
        @keyframes slideDown {
          from {
            opacity: 0;
            max-height: 0;
          }
          to {
            opacity: 1;
            max-height: 800px;
          }
        }
        
        .detail-buttons {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
        }
        
        @media (min-width: 769px) {
          .detail-buttons {
            grid-template-columns: repeat(6, 1fr);
          }
        }
        
        .detail-btn {
          padding: 12px;
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          font-size: 12px;
          font-weight: 600;
          color: #012169;
          cursor: pointer;
          transition: all 0.2s;
          min-height: 44px;
        }
        
        .detail-btn:hover {
          background: #012169;
          color: white;
          border-color: #012169;
          transform: translateY(-1px);
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        
        .detail-btn:active {
          transform: translateY(0);
        }
        
        .bottom-nav {
          position: fixed;
          bottom: 0;
          left: 0;
          width: 100%;
          background: white;
          border-top: 1px solid #e5e7eb;
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          box-shadow: 0 -2px 8px rgba(0,0,0,0.08);
        }
        
        @media (min-width: 769px) {
          .bottom-nav {
            display: none;
          }
          
          .mobile-banking-app {
            padding-bottom: 0;
          }
          
          .tab-navigation {
            display: none;
          }
        }
        
        @media (max-width: 768px) {
          .bottom-nav {
            max-width: 480px;
            left: 50%;
            transform: translateX(-50%);
          }
        }
        
        .bottom-nav-item {
          padding: 12px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
          cursor: pointer;
          transition: all 0.2s;
          border: none;
          background: none;
          min-height: 60px;
        }
        
        .bottom-nav-item.active {
          color: #e31837;
        }
        
        .bottom-nav-item:not(.active) {
          color: #6b7280;
        }
        
        .bottom-nav-item:hover {
          background: #f9fafb;
        }
        
        .bottom-nav-item:active {
          transform: scale(0.95);
        }
        
        .bottom-nav-item svg {
          transition: all 0.2s;
        }
        
        .bottom-nav-label {
          font-size: 11px;
          font-weight: 600;
        }
        
        .credit-card-visual {
          background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
          border-radius: 12px;
          padding: 20px;
          color: white;
          margin-top: 12px;
          box-shadow: 0 8px 24px rgba(0,0,0,0.3);
          position: relative;
          overflow: hidden;
        }
        
        .card-flip-container {
          perspective: 1000px;
          cursor: pointer;
          margin-bottom: 16px;
          padding: 0 4px;
        }
        
        @media (min-width: 769px) {
          .card-flip-container {
            padding: 0 20px;
          }
        }
        
        .card-3d {
          position: relative;
          width: 100%;
          height: 230px;
          transition: transform 0.6s;
          transform-style: preserve-3d;
          margin-bottom: 20px;
        }
        
        .card-face {
          position: absolute;
          width: 100%;
          height: 230px;
          backface-visibility: hidden;
          background: #000000;
          border-radius: 12px;
          padding: 18px;
          box-shadow: 0 10px 15px -3px rgba(0,0,0,0.3);
          color: white;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }
        
        @media (min-width: 769px) {
          .card-3d {
            height: 240px;
          }
          
          .card-face {
            height: 240px;
            padding: 24px;
          }
        }
        
        .card-face.back {
          transform: rotateY(180deg);
          overflow: hidden;
        }
        
        .credit-card-visual::before {
          content: '';
          position: absolute;
          top: -50%;
          right: -50%;
          width: 200px;
          height: 200px;
          background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%);
          pointer-events: none;
        }
        
        .card-chip {
          width: 45px;
          height: 35px;
          background: linear-gradient(135deg, #d4af37 0%, #f4e5b0 50%, #d4af37 100%);
          border-radius: 6px;
          margin-bottom: 16px;
        }
        
        .card-number {
          font-size: 20px;
          letter-spacing: 3px;
          font-family: 'Courier New', monospace;
          margin-bottom: 16px;
        }
        
        .card-footer {
          display: flex;
          justify-content: space-between;
          align-items: end;
        }
        
        .card-holder {
          font-size: 12px;
        }
        
        .card-holder-name {
          font-size: 14px;
          font-weight: 600;
          margin-top: 4px;
        }
        
        .card-logo {
          font-size: 28px;
          font-weight: 700;
          font-style: italic;
        }
        
        .skeleton {
          background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
          background-size: 200% 100%;
          animation: loading 1.5s infinite;
          border-radius: 4px;
        }
        
        @keyframes loading {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
        
        .empty-state {
          text-align: center;
          padding: 48px 24px;
          color: #6b7280;
        }
        
        .empty-state-icon {
          font-size: 48px;
          margin-bottom: 16px;
          opacity: 0.5;
        }
        
        .security-badge {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 11px;
          color: #10b981;
          margin-top: 8px;
        }
        
        .dashboard-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
          grid-column: 1 / -1;
        }
        
        @media (max-width: 768px) {
          .dashboard-grid {
            gap: 8px;
          }
        }
        
        @media (min-width: 769px) {
          .dashboard-grid {
            grid-template-columns: repeat(4, 1fr);
            gap: 20px;
          }
        }
        
        .dashboard-card {
          background: white;
          border-radius: 12px;
          padding: 20px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.08);
          transition: all 0.2s;
        }
        
        .dashboard-card:hover {
          box-shadow: 0 4px 12px rgba(0,0,0,0.12);
          transform: translateY(-2px);
        }
        
        .card-title {
          font-size: 14px;
          color: #6b7280;
          margin-bottom: 12px;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        
        .notification-panel {
          position: absolute;
          top: 60px;
          right: 20px;
          background: white;
          border-radius: 12px;
          box-shadow: 0 8px 24px rgba(0,0,0,0.15);
          width: 320px;
          max-height: 400px;
          overflow-y: auto;
          z-index: 200;
        }
        
        .notification-header {
          padding: 16px 20px;
          border-bottom: 1px solid #e5e7eb;
          font-weight: 600;
          color: #111827;
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
        
        .card-value {
          font-size: 28px;
          font-weight: 700;
          color: #111827;
          margin-bottom: 8px;
        }
        
        @media (min-width: 769px) {
          .card-value {
            font-size: 32px;
          }
        }
        
        .card-subtitle {
          font-size: 12px;
          color: #6b7280;
        }
        
        .spending-bar {
          display: flex;
          gap: 4px;
          height: 12px;
          border-radius: 6px;
          overflow: hidden;
          margin-top: 16px;
        }
        
        .customize-btn {
          grid-column: 1 / -1;
          width: 100%;
          padding: 16px;
          background: #0057b8;
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-top: 8px;
        }
        
        .customize-btn:hover {
          background: #004494;
          transform: translateY(-1px);
          box-shadow: 0 4px 8px rgba(0,0,0,0.15);
        }
        
        .customize-btn:active {
          transform: translateY(0);
        }
        
        .transaction-item {
          padding: 16px 20px;
          border-bottom: 1px solid #f3f4f6;
          display: flex;
          justify-content: space-between;
          align-items: center;
          transition: background 0.2s;
        }
        
        .transaction-item:hover {
          background: #f9fafb;
        }
        
        .transaction-item:last-child {
          border-bottom: none;
        }
        
        .transaction-info {
          flex: 1;
        }
        
        .transaction-merchant {
          font-size: 14px;
          font-weight: 600;
          color: #111827;
          margin-bottom: 4px;
        }
        
        .transaction-date {
          font-size: 12px;
          color: #6b7280;
        }
        
        .transaction-amount {
          font-size: 16px;
          font-weight: 600;
        }
        
        .transaction-amount.positive {
          color: #10b981;
        }
        
        .transaction-amount.negative {
          color: #111827;
        }
        
        .payment-form {
          background: white;
          border-radius: 12px;
          padding: 24px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.08);
          margin-bottom: 20px;
        }
        
        .form-group {
          margin-bottom: 20px;
        }
        
        .form-label {
          display: block;
          font-size: 13px;
          font-weight: 600;
          color: #111827;
          margin-bottom: 8px;
        }
        
        .form-input {
          width: 100%;
          padding: 12px 16px;
          border: 2px solid #e5e7eb;
          border-radius: 8px;
          font-size: 14px;
          outline: none;
          transition: all 0.2s;
        }
        
        .form-input[type="number"]::-webkit-inner-spin-button,
        .form-input[type="number"]::-webkit-outer-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
        
        .form-input[type="number"] {
          -moz-appearance: textfield;
        }
        
        .form-input:focus {
          border-color: #e31837;
          box-shadow: 0 0 0 3px rgba(227, 24, 55, 0.1);
        }
        
        .form-select {
          width: 100%;
          padding: 12px 16px;
          border: 2px solid #e5e7eb;
          border-radius: 8px;
          font-size: 14px;
          outline: none;
          transition: all 0.2s;
          background: white;
        }
        
        .form-select:focus {
          border-color: #e31837;
          box-shadow: 0 0 0 3px rgba(227, 24, 55, 0.1);
        }
        
        .submit-btn {
          width: 100%;
          padding: 14px;
          background: #e31837;
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }
        
        .submit-btn:hover {
          background: #c41230;
          transform: translateY(-1px);
          box-shadow: 0 4px 8px rgba(227, 24, 55, 0.3);
        }
        
        .submit-btn:active {
          transform: translateY(0);
        }
        
        .submit-btn:disabled {
          background: #9ca3af;
          cursor: not-allowed;
          transform: none;
        }
        
        .payee-search-container {
          position: relative;
        }
        
        .payee-suggestions {
          position: absolute;
          top: 100%;
          left: 0;
          right: 0;
          background: white;
          border: 2px solid #e31837;
          border-top: none;
          border-radius: 0 0 8px 8px;
          max-height: 240px;
          overflow-y: auto;
          z-index: 10;
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        }
        
        .payee-suggestion-item {
          padding: 12px 16px;
          cursor: pointer;
          transition: background 0.2s;
          border-bottom: 1px solid #f3f4f6;
        }
        
        .payee-suggestion-item:hover {
          background: #f9fafb;
        }
        
        .payee-suggestion-item:last-child {
          border-bottom: none;
        }
        
        .payee-name {
          font-size: 14px;
          font-weight: 600;
          color: #111827;
          margin-bottom: 2px;
        }
        
        .payee-category {
          font-size: 12px;
          color: #6b7280;
        }
        
        .add-new-payee {
          padding: 12px 16px;
          color: #0057b8;
          font-weight: 600;
          font-size: 14px;
          border-top: 2px solid #e5e7eb;
          cursor: pointer;
          transition: background 0.2s;
        }
        
        .add-new-payee:hover {
          background: #f0f7ff;
        }
        
        .sidebar-menu {
          display: none;
        }
        
        @media (min-width: 769px) {
          .sidebar-menu {
            display: flex;
            flex-direction: column;
            width: 260px;
            background: white;
            border-right: 1px solid #e5e7eb;
            transition: width 0.3s ease-in-out;
          }
          
          .sidebar-menu.closed {
            width: 70px;
          }
          
          .mobile-banking-app {
            display: flex;
          }
          
          .app-content {
            flex: 1;
            overflow-y: auto;
          }
        }
        
        .sidebar-header {
          padding: 16px 20px;
          background: #012169;
          color: white;
          display: flex;
          justify-content: space-between;
          align-items: center;
          min-height: 73px;
        }
        
        .sidebar-menu.closed .sidebar-header span {
          display: none;
        }
        
        .sidebar-nav {
          flex: 1;
          overflow-y: auto;
          padding: 20px 0;
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
          white-space: nowrap;
        }
        
        .sidebar-menu.closed .sidebar-nav-item {
          padding: 16px;
          justify-content: center;
        }
        
        .sidebar-menu.closed .sidebar-nav-item span {
          display: none;
        }
        
        .sidebar-nav-item:hover {
          background: #f9fafb;
        }
        
        .sidebar-nav-item.active {
          background: #fef2f2;
          color: #e31837;
          border-left: 3px solid #e31837;
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
        
        .toast-icon {
          font-size: 20px;
        }
        
        .toast.success .toast-icon {
          color: #10b981;
        }
        
        .toast.error .toast-icon {
          color: #ef4444;
        }
        
        .toast-message {
          flex: 1;
          font-size: 14px;
          color: #111827;
          font-weight: 500;
        }
        
        .loading-skeleton {
          background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
          background-size: 200% 100%;
          animation: loading 1.5s infinite;
          border-radius: 8px;
        }
        
        .empty-state {
          text-align: center;
          padding: 48px 24px;
          color: #6b7280;
        }
        
        .empty-icon {
          font-size: 48px;
          margin-bottom: 16px;
          opacity: 0.5;
        }
        
        .empty-title {
          font-size: 18px;
          font-weight: 600;
          color: #111827;
          margin-bottom: 8px;
        }
        
        .empty-text {
          font-size: 14px;
          color: #6b7280;
        }
        
        .detail-modal {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0,0,0,0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          animation: fadeIn 0.2s;
        }
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        .modal-content {
          background: white;
          border-radius: 12px;
          padding: 32px;
          max-width: 500px;
          width: 90%;
          max-height: 80vh;
          overflow-y: auto;
          animation: slideUp 0.3s;
        }
        
        @keyframes slideUp {
          from {
            transform: translateY(50px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        
        .modal-header {
          font-size: 24px;
          font-weight: 700;
          color: #012169;
          margin-bottom: 24px;
        }
        
        .modal-close {
          position: absolute;
          top: 16px;
          right: 16px;
          background: none;
          border: none;
          font-size: 24px;
          cursor: pointer;
          color: #6b7280;
          padding: 8px;
        }
        
        @media (min-width: 769px) {
          .sidebar-menu {
            position: static;
            transform: translateX(0);
            width: 260px;
            height: auto;
            box-shadow: none;
            border-right: 1px solid #e5e7eb;
          }
          
          .sidebar-overlay {
            display: none;
          }
          
          .mobile-banking-app {
            display: flex;
          }
          
          .app-content {
            flex: 1;
            overflow-y: auto;
          }
        }
      `}</style>

      <div className="mobile-banking-app">
        {/* Toast Notifications */}
        <div className="toast-container">
          {toasts.map(toast => (
            <div key={toast.id} className={`toast ${toast.type}`}>
              <div className="toast-icon">{toast.type === 'success' ? '✓' : '✕'}</div>
              <div className="toast-message">{toast.message}</div>
            </div>
          ))}
        </div>

        {/* Sidebar Menu - Desktop Only */}
        <div className={`sidebar-menu ${menuOpen ? '' : 'closed'}`}>
          <div className="sidebar-header">
            <span style={{ fontSize: '18px', fontWeight: '600' }}>Navigation</span>
            <button onClick={() => setMenuOpen(!menuOpen)} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', padding: '8px', minWidth: '44px', minHeight: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Menu size={24} />
            </button>
          </div>
          <nav className="sidebar-nav">
            <button className={`sidebar-nav-item ${activeTab === 'accounts' ? 'active' : ''}`} onClick={() => setActiveTab('accounts')}>
              <Building2 size={20} />
              <span>Accounts</span>
            </button>
            <button className={`sidebar-nav-item ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => setActiveTab('dashboard')}>
              <LayoutDashboard size={20} />
              <span>Dashboard</span>
            </button>
            <button className={`sidebar-nav-item ${activeTab === 'transactions' ? 'active' : ''}`} onClick={() => setActiveTab('transactions')}>
              <ArrowRightLeft size={20} />
              <span>Transactions</span>
            </button>
            <button className={`sidebar-nav-item ${activeTab === 'payments' ? 'active' : ''}`} onClick={() => setActiveTab('payments')}>
              <DollarSign size={20} />
              <span>Payments</span>
            </button>
            <button className={`sidebar-nav-item ${activeTab === 'deposit' ? 'active' : ''}`} onClick={() => setActiveTab('deposit')}>
              <Camera size={20} />
              <span>Deposit</span>
            </button>
            <button className={`sidebar-nav-item ${activeTab === 'more' ? 'active' : ''}`} onClick={() => setActiveTab('more')}>
              <Settings size={20} />
              <span>More</span>
            </button>
          </nav>
        </div>
        
        <div className="app-content">
        {/* Top Navigation */}
        <div className="top-nav">
          <div className="nav-left">
          </div>
          <div className="nav-right">
            <button className="nav-icon" aria-label="Inbox, 9 unread messages" onClick={() => { setShowInbox(!showInbox); setShowNotifications(false); setShowProducts(false); setShowProfileMenu(false); }}>
              <Mail size={20} />
              <span className="badge">9</span>
            </button>
            <button className="nav-icon" aria-label="Products, 9 items" onClick={() => { setShowProducts(!showProducts); setShowInbox(false); setShowNotifications(false); setShowProfileMenu(false); }}>
              <ShoppingCart size={20} />
              <span className="badge">9</span>
            </button>
            <button className="nav-icon" aria-label="Notifications, 4 new alerts" onClick={() => { setShowNotifications(!showNotifications); setShowInbox(false); setShowProducts(false); setShowProfileMenu(false); }}>
              <Bell size={20} />
              <span className="badge">4</span>
            </button>
            <button className="nav-icon" aria-label="Profile menu" style={{ padding: '4px' }} onClick={() => { setShowProfileMenu(!showProfileMenu); setShowInbox(false); setShowNotifications(false); setShowProducts(false); }}>
              <img 
                src={avatar || `https://ui-avatars.com/api/?name=${name.replace(' ', '+')}&background=e31837&color=fff&size=32`}
                alt="Profile" 
                style={{ width: '32px', height: '32px', borderRadius: '50%', border: '2px solid white' }}
              />
            </button>
          </div>
        </div>

        {/* Notification Panels */}
        {showInbox && (
          <div className="notification-panel">
            <div className="notification-header">Inbox Messages (9)</div>
            <div className="notification-item">
              <div className="notification-title">Payment Confirmation</div>
              <div className="notification-text">Your payment of $250.00 has been processed</div>
              <div className="notification-time">2 hours ago</div>
            </div>
            <div className="notification-item">
              <div className="notification-title">Statement Available</div>
              <div className="notification-text">Your December statement is ready to view</div>
              <div className="notification-time">1 day ago</div>
            </div>
            <div className="notification-item">
              <div className="notification-title">Security Alert</div>
              <div className="notification-text">New device login detected from Chrome</div>
              <div className="notification-time">2 days ago</div>
            </div>
            <div className="notification-item">
              <div className="notification-title">Transfer Complete</div>
              <div className="notification-text">$1,000 transferred to savings account</div>
              <div className="notification-time">3 days ago</div>
            </div>
            <div className="notification-item">
              <div className="notification-title">Direct Deposit</div>
              <div className="notification-text">Payroll deposit of $3,500 received</div>
              <div className="notification-time">5 days ago</div>
            </div>
            <div className="notification-item">
              <div className="notification-title">Card Activated</div>
              <div className="notification-text">Your new credit card has been activated</div>
              <div className="notification-time">1 week ago</div>
            </div>
            <div className="notification-item">
              <div className="notification-title">Rewards Earned</div>
              <div className="notification-text">You earned 500 bonus points this month</div>
              <div className="notification-time">1 week ago</div>
            </div>
            <div className="notification-item">
              <div className="notification-title">Account Update</div>
              <div className="notification-text">Your contact information was updated</div>
              <div className="notification-time">2 weeks ago</div>
            </div>
            <div className="notification-item">
              <div className="notification-title">Welcome Message</div>
              <div className="notification-text">Thank you for banking with us</div>
              <div className="notification-time">1 month ago</div>
            </div>
          </div>
        )}

        {showProducts && (
          <div className="notification-panel">
            <div className="notification-header">Products & Services (9)</div>
            <div className="notification-item">
              <div className="notification-title">Credit Card Rewards</div>
              <div className="notification-text">You have 15,000 points available</div>
              <div className="notification-time">Active</div>
            </div>
            <div className="notification-item">
              <div className="notification-title">Savings Account</div>
              <div className="notification-text">Earn 2.5% APY on your balance</div>
              <div className="notification-time">Active</div>
            </div>
            <div className="notification-item">
              <div className="notification-title">Auto Loan</div>
              <div className="notification-text">Pre-qualified for rates as low as 3.9%</div>
              <div className="notification-time">New Offer</div>
            </div>
            <div className="notification-item">
              <div className="notification-title">Home Equity Line</div>
              <div className="notification-text">Access up to $100,000 in equity</div>
              <div className="notification-time">Available</div>
            </div>
            <div className="notification-item">
              <div className="notification-title">Investment Account</div>
              <div className="notification-text">Start investing with as little as $100</div>
              <div className="notification-time">New</div>
            </div>
            <div className="notification-item">
              <div className="notification-title">Business Credit Card</div>
              <div className="notification-text">Earn 3% cash back on purchases</div>
              <div className="notification-time">Active</div>
            </div>
            <div className="notification-item">
              <div className="notification-title">Overdraft Protection</div>
              <div className="notification-text">Link accounts for automatic coverage</div>
              <div className="notification-time">Available</div>
            </div>
            <div className="notification-item">
              <div className="notification-title">Mobile Deposit</div>
              <div className="notification-text">Deposit checks from anywhere</div>
              <div className="notification-time">Active</div>
            </div>
            <div className="notification-item">
              <div className="notification-title">Bill Pay Service</div>
              <div className="notification-text">Schedule and manage all your bills</div>
              <div className="notification-time">Active</div>
            </div>
          </div>
        )}

        {showProfileMenu && (
          <div className="notification-panel">
            <div className="notification-header">Profile Menu</div>
            <div className="notification-item" onClick={() => { document.getElementById('avatar-upload')?.click(); setShowProfileMenu(false); }}>
              <div className="notification-title">Update Profile Picture</div>
              <div className="notification-text">Change your avatar image</div>
            </div>
            <div className="notification-item" onClick={() => { logout(); setShowProfileMenu(false); }} style={{ borderTop: '1px solid #fee2e2' }}>
              <div className="notification-title" style={{ color: '#e31837' }}>Logout</div>
              <div className="notification-text">Sign out of your account</div>
            </div>
          </div>
        )}

        {showNotifications && (
          <div className="notification-panel">
            <div className="notification-header">Notifications (4)</div>
            <div className="notification-item">
              <div className="notification-title">Large Deposit</div>
              <div className="notification-text">$5,000 deposited to checking account</div>
              <div className="notification-time">1 hour ago</div>
            </div>
            <div className="notification-item">
              <div className="notification-title">Bill Payment Due</div>
              <div className="notification-text">Credit card payment due in 3 days</div>
              <div className="notification-time">Today</div>
            </div>
            <div className="notification-item">
              <div className="notification-title">Account Update</div>
              <div className="notification-text">Your profile information was updated</div>
              <div className="notification-time">Yesterday</div>
            </div>
            <div className="notification-item">
              <div className="notification-title">Zelle Request</div>
              <div className="notification-text">You have 3 pending Zelle requests</div>
              <div className="notification-time">2 days ago</div>
            </div>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="tab-navigation">
          {['Accounts', 'Dashboard', 'Transactions', 'Payments', 'Deposit', 'More'].map(tab => (
            <div
              key={tab}
              className={`tab ${activeTab === tab.toLowerCase() ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.toLowerCase())}
            >
              {tab}
            </div>
          ))}
        </div>

        {/* Search Bar */}
        <div className="search-bar">
          <input
            type="text"
            className="search-input"
            placeholder="How can we help?"
          />
        </div>

        {/* Main Content */}
        <div className="main-content">
          {activeTab === 'dashboard' && (
            <div className="dashboard-grid">
              {/* Checking Account Card */}
              <div className="dashboard-card" onClick={() => { setSelectedCard('checking'); setShowDetailModal(true); }} style={{ cursor: 'pointer' }}>
                <div className="card-title">
                  <DollarSign size={20} color="#10b981" />
                  Checking Account -{accountId.slice(-4) || '3432'}
                </div>
                <div className="card-value">${balance.toFixed(2)}</div>
                <div className="card-subtitle">Available Balance</div>
              </div>

              {/* Bank of America Account Card */}
              <div className="dashboard-card" onClick={() => { setSelectedCard('savings'); setShowDetailModal(true); }} style={{ cursor: 'pointer' }}>
                <div className="card-title">
                  <Building2 size={20} color="#012169" />
                  Bank of America… {accountId.slice(-4) || '9832'}
                </div>
                <div className="card-value">${(balance * 0.15).toFixed(2)}</div>
                <div className="card-subtitle">Current Balance</div>
              </div>

              {/* BankAmerCard Credit Card */}
              <div className="dashboard-card" onClick={() => { setSelectedCard('credit'); setShowDetailModal(true); }} style={{ cursor: 'pointer' }}>
                <div className="card-title">
                  <CreditCard size={20} color="#e31837" />
                  BankAmerCard...00001
                </div>
                <div className="card-value">${(balance * 0.3).toFixed(2)}</div>
                <div className="card-subtitle">Current Balance</div>
              </div>

              {/* Zelle Card */}
              <div className="dashboard-card" onClick={() => setActiveTab('payments')} style={{ cursor: 'pointer' }}>
                <div className="card-title">
                  <img src="/assets/zelleimage.png" alt="Zelle" style={{ height: '20px' }} />
                </div>
                <div style={{ fontSize: '14px', color: '#6b7280', marginBottom: '12px' }}>Send or Request Money</div>
                <div style={{ fontSize: '13px', color: '#e31837', fontWeight: '600' }}>3 Pending Requests</div>
              </div>

              {/* December Spending Card */}
              <div className="dashboard-card">
                <div className="card-title">
                  <PieChart size={20} color="#e31837" />
                  December Spending
                </div>
                <div className="card-value">$2,400.00</div>
                <div style={{ fontSize: '13px', color: '#e31837', fontWeight: '600', marginBottom: '8px' }}>3 Categories Over Budget</div>
                <div className="spending-bar">
                  <div style={{ flex: 1, background: '#e31837' }}></div>
                  <div style={{ flex: 0.7, background: '#f59e0b' }}></div>
                  <div style={{ flex: 0.5, background: '#10b981' }}></div>
                  <div style={{ flex: 0.3, background: '#3b82f6' }}></div>
                </div>
              </div>

              {/* FICO Score Card */}
              <div className="dashboard-card">
                <div className="card-title">
                  <TrendingUp size={20} color="#10b981" />
                  My FICO® Score
                </div>
                <div style={{ fontSize: '48px', fontWeight: '700', color: '#10b981', marginBottom: '8px' }}>734</div>
                <div className="card-subtitle">As of 08/01/2019</div>
              </div>

              {/* Customize Dashboard Button */}
              <button className="customize-btn" onClick={() => showToast('Dashboard customization coming soon', 'success')}>
                CUSTOMIZE MY DASHBOARD
              </button>
            </div>
          )}
          
          {activeTab === 'transactions' && (
            <div style={{ gridColumn: '1 / -1' }}>
              {transactions.length === 0 ? (
                <div className="section">
                  <div className="empty-state">
                    <div className="empty-icon">💳</div>
                    <div className="empty-title">No Transactions Yet</div>
                    <div className="empty-text">Your transaction history will appear here once you make your first transaction.</div>
                  </div>
                </div>
              ) : (
              <div className="section">
                <div className="section-header">
                  <div className="section-title">RECENT TRANSACTIONS</div>
                </div>
                <div className="transaction-item">
                  <div className="transaction-info">
                    <div className="transaction-merchant">Amazon.com</div>
                    <div className="transaction-date">Dec 15, 2024 • Checking ...{accountId.slice(-4) || '3432'}</div>
                  </div>
                  <div className="transaction-amount negative">-$127.45</div>
                </div>
                <div className="transaction-item">
                  <div className="transaction-info">
                    <div className="transaction-merchant">Starbucks</div>
                    <div className="transaction-date">Dec 14, 2024 • Credit Card ...{accountId.slice(-4) || '9832'}</div>
                  </div>
                  <div className="transaction-amount negative">-$8.75</div>
                </div>
                <div className="transaction-item">
                  <div className="transaction-info">
                    <div className="transaction-merchant">Payroll Deposit</div>
                    <div className="transaction-date">Dec 13, 2024 • Checking ...{accountId.slice(-4) || '3432'}</div>
                  </div>
                  <div className="transaction-amount positive">+$3,500.00</div>
                </div>
                <div className="transaction-item">
                  <div className="transaction-info">
                    <div className="transaction-merchant">Walmart</div>
                    <div className="transaction-date">Dec 12, 2024 • Checking ...{accountId.slice(-4) || '3432'}</div>
                  </div>
                  <div className="transaction-amount negative">-$156.32</div>
                </div>
                <div className="transaction-item">
                  <div className="transaction-info">
                    <div className="transaction-merchant">Shell Gas Station</div>
                    <div className="transaction-date">Dec 11, 2024 • Credit Card ...{accountId.slice(-4) || '9832'}</div>
                  </div>
                  <div className="transaction-amount negative">-$45.00</div>
                </div>
                <div className="transaction-item">
                  <div className="transaction-info">
                    <div className="transaction-merchant">Netflix</div>
                    <div className="transaction-date">Dec 10, 2024 • Credit Card ...{accountId.slice(-4) || '9832'}</div>
                  </div>
                  <div className="transaction-amount negative">-$15.99</div>
                </div>
                <div className="transaction-item">
                  <div className="transaction-info">
                    <div className="transaction-merchant">Transfer to Savings</div>
                    <div className="transaction-date">Dec 9, 2024 • Checking ...{accountId.slice(-4) || '3432'}</div>
                  </div>
                  <div className="transaction-amount negative">-$500.00</div>
                </div>
                <div className="transaction-item">
                  <div className="transaction-info">
                    <div className="transaction-merchant">Zelle from John Doe</div>
                    <div className="transaction-date">Dec 8, 2024 • Checking ...{accountId.slice(-4) || '3432'}</div>
                  </div>
                  <div className="transaction-amount positive">+$250.00</div>
                </div>
              </div>
              )}
            </div>
          )}
          
          {activeTab === 'payments' && (
            <div style={{ gridColumn: '1 / -1' }}>
              <div className="payment-form">
                <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#012169', marginBottom: '24px' }}>Make a Payment</h2>
                <div className="form-group">
                  <label className="form-label">From Account</label>
                  <select className="form-select">
                    <option>Checking Account ...{accountId.slice(-4) || '3432'} - ${balance.toFixed(2)}</option>
                    <option>Savings Account ...{accountId.slice(-4) || '0193'} - ${(balance * 0.15).toFixed(2)}</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Payment Type</label>
                  <select className="form-select" value={paymentType} onChange={(e) => setPaymentType(e.target.value)}>
                    <option value="transfer">Transfer Between Accounts</option>
                    <option value="bill">Pay Bill</option>
                    <option value="zelle">Send Money with Zelle</option>
                    <option value="wire">Wire Transfer</option>
                  </select>
                </div>
                {paymentType === 'transfer' && (
                  <div className="form-group">
                    <label className="form-label">To Account</label>
                    <select className="form-select">
                      <option>Savings Account ...{accountId.slice(-4) || '0193'} - ${(balance * 0.15).toFixed(2)}</option>
                      <option>Credit Card ...{accountId.slice(-4) || '9832'}</option>
                    </select>
                  </div>
                )}
                {paymentType === 'bill' && (
                  <div className="form-group">
                    <label className="form-label">Search for Payee</label>
                    <div className="payee-search-container">
                      <input 
                        type="text" 
                        className="form-input" 
                        placeholder="Search by company name..."
                        value={payeeSearch}
                        onChange={(e) => {
                          setPayeeSearch(e.target.value);
                          setShowPayeeSuggestions(true);
                        }}
                        onFocus={() => setShowPayeeSuggestions(true)}
                      />
                      {showPayeeSuggestions && payeeSearch.length > 0 && (
                        <div className="payee-suggestions">
                          {filteredPayees.length > 0 ? (
                            filteredPayees.map((payee, idx) => (
                              <div 
                                key={idx} 
                                className="payee-suggestion-item"
                                onClick={() => {
                                  setPayeeSearch(payee.name);
                                  setShowPayeeSuggestions(false);
                                }}
                              >
                                <div className="payee-name">{payee.name}</div>
                                <div className="payee-category">{payee.category}</div>
                              </div>
                            ))
                          ) : (
                            <div className="payee-suggestion-item">
                              <div className="payee-name">No results found</div>
                              <div className="payee-category">Try a different search term</div>
                            </div>
                          )}
                          <div className="add-new-payee" onClick={() => setShowPayeeSuggestions(false)}>
                            + Add New Payee
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
                {paymentType === 'zelle' && (
                  <div className="form-group">
                    <label className="form-label">Recipient Email or Phone</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      placeholder="email@example.com or (555) 123-4567"
                      value={zelleRecipient}
                      onChange={(e) => setZelleRecipient(e.target.value)}
                    />
                  </div>
                )}
                {paymentType === 'wire' && (
                  <>
                    <div className="form-group">
                      <label className="form-label">Recipient Bank Name</label>
                      <input 
                        type="text" 
                        className="form-input" 
                        placeholder="Enter bank name"
                        value={wireBank}
                        onChange={(e) => setWireBank(e.target.value)}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Routing Number</label>
                      <input 
                        type="text" 
                        className="form-input" 
                        placeholder="9 digit routing number"
                        maxLength={9}
                        value={wireRouting}
                        onChange={(e) => setWireRouting(e.target.value.replace(/[^0-9]/g, ''))}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Account Number</label>
                      <input 
                        type="text" 
                        className="form-input" 
                        placeholder="Recipient account number"
                        maxLength={17}
                        value={wireAccount}
                        onChange={(e) => setWireAccount(e.target.value.replace(/[^0-9]/g, ''))}
                      />
                    </div>
                  </>
                )}
                <div className="form-group">
                  <label className="form-label">Amount</label>
                  <input 
                    type="number" 
                    className="form-input" 
                    placeholder="0.00"
                    value={paymentType === 'transfer' ? transferAmount : paymentType === 'bill' ? billAmount : paymentType === 'zelle' ? zelleAmount : wireAmount}
                    onChange={(e) => {
                      if (paymentType === 'transfer') setTransferAmount(e.target.value);
                      else if (paymentType === 'bill') setBillAmount(e.target.value);
                      else if (paymentType === 'zelle') setZelleAmount(e.target.value);
                      else setWireAmount(e.target.value);
                    }}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Memo (Optional)</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    placeholder="Add a note"
                    value={paymentType === 'zelle' ? zelleMessage : paymentMemo}
                    onChange={(e) => {
                      if (paymentType === 'zelle') setZelleMessage(e.target.value);
                      else setPaymentMemo(e.target.value);
                    }}
                  />
                </div>
                <button 
                  className="submit-btn" 
                  onClick={() => {
                    if (paymentType === 'transfer') handleTransfer();
                    else if (paymentType === 'bill') handleBillPay();
                    else if (paymentType === 'zelle') handleZelle();
                    else handleWire();
                  }}
                  disabled={paymentLoading}
                >
                  {paymentLoading ? 'Processing...' : 'Continue'}
                </button>
              </div>
              
              <div className="section">
                <div className="section-header">
                  <div className="section-title">SCHEDULED PAYMENTS</div>
                </div>
                {[].length === 0 ? (
                  <div className="empty-state">
                    <div className="empty-icon">📅</div>
                    <div className="empty-title">No Scheduled Payments</div>
                    <div className="empty-text">You don't have any scheduled payments at this time.</div>
                  </div>
                ) : (
                  <>
                <div className="transaction-item">
                  <div className="transaction-info">
                    <div className="transaction-merchant">Duke Energy</div>
                    <div className="transaction-date">Due: Dec 20, 2024</div>
                  </div>
                  <div className="transaction-amount negative">$125.00</div>
                </div>
                <div className="transaction-item">
                  <div className="transaction-info">
                    <div className="transaction-merchant">Chase Credit Card</div>
                    <div className="transaction-date">Due: Dec 25, 2024</div>
                  </div>
                  <div className="transaction-amount negative">$450.00</div>
                </div>
                <div className="transaction-item">
                  <div className="transaction-info">
                    <div className="transaction-merchant">Comcast Xfinity</div>
                    <div className="transaction-date">Due: Jan 1, 2025</div>
                  </div>
                  <div className="transaction-amount negative">$89.99</div>
                </div>
                  </>
                )}
              </div>
            </div>
          )}
          
          {activeTab === 'accounts' && (
            <>
          {/* Business Header */}
          <div className="business-header">
            <div className="business-name">{name}</div>
            <div className="rewards-info">
              You've been enjoying Preferred Rewards for Business since Mar 2018.{' '}
              <button className="rewards-link" onClick={() => showToast('Rewards summary: 15,000 points available', 'success')} style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}>My Summary</button>
            </div>
            <div className="security-badge">
              <Lock size={14} /> Your data is protected with bank-level encryption
            </div>
          </div>

          {message && (
            <div style={{ background: message.includes('blocked') ? '#fef2f2' : '#f0fdf4', border: `1px solid ${message.includes('blocked') ? '#fecaca' : '#bbf7d0'}`, color: message.includes('blocked') ? '#991b1b' : '#166534', padding: '16px', borderRadius: '12px', marginBottom: '20px', fontSize: '14px' }}>
              {message}
            </div>
          )}

          {!taxCleared && (
            <div style={{ background: '#fffbeb', border: '1px solid #fde68a', color: '#92400e', padding: '16px', borderRadius: '12px', marginBottom: '20px', fontSize: '14px' }}>
              <strong>⚠️ Tax Clearance Required</strong><br />
              Your account has outstanding tax issues. Transfers and withdrawals are temporarily blocked.
            </div>
          )}

          {/* Banking Section */}
          <div className="section">
            <div className="section-header">
              <div className="section-title">BANK OF AMERICA</div>
            </div>
            
            <div className="account-item" onClick={() => setExpandedAccount(expandedAccount === 'checking' ? null : 'checking')}>
              <div className="account-row">
                <div className="account-info">
                  <div className="account-name">Business Adv Checking</div>
                  <div className="account-number">...{accountId.slice(-4) || '3432'}</div>
                </div>
                <div className="account-balance">
                  <div className="balance-amount">${balance.toFixed(2)}</div>
                  <div className={`expand-icon ${expandedAccount === 'checking' ? 'expanded' : ''}`}>
                    <ChevronDown size={20} />
                  </div>
                </div>
              </div>
              {expandedAccount === 'checking' && (
                <div className="account-details">
                  <div className="detail-buttons">
                    <button className="detail-btn" onClick={(e) => { e.stopPropagation(); setActiveTab('payments'); }}>Transfer</button>
                    <button className="detail-btn" onClick={(e) => { e.stopPropagation(); setActiveTab('payments'); setPaymentType('bill'); }}>Pay Bills</button>
                    <button className="detail-btn" onClick={(e) => { e.stopPropagation(); showToast('Statement download coming soon', 'success'); }}>Statements</button>
                    <button className="detail-btn" onClick={(e) => { e.stopPropagation(); setSelectedCard('checking'); setShowDetailModal(true); }}>Details</button>
                    <button className="detail-btn" onClick={(e) => { e.stopPropagation(); setActiveTab('more'); }}>Settings</button>
                    <button className="detail-btn" onClick={(e) => { e.stopPropagation(); setActiveTab('transactions'); }}>History</button>
                  </div>
                </div>
              )}
            </div>

            <div className="account-item" onClick={() => setExpandedAccount(expandedAccount === 'savings' ? null : 'savings')}>
              <div className="account-row">
                <div className="account-info">
                  <div className="account-name">Business Adv Savings</div>
                  <div className="account-number">...{accountId.slice(-4) || '0193'}</div>
                </div>
                <div className="account-balance">
                  <div className="balance-amount">${(balance * 0.15).toFixed(2)}</div>
                  <div className={`expand-icon ${expandedAccount === 'savings' ? 'expanded' : ''}`}>
                    <ChevronDown size={20} />
                  </div>
                </div>
              </div>
              {expandedAccount === 'savings' && (
                <div className="account-details">
                  <div className="detail-buttons">
                    <button className="detail-btn" onClick={(e) => { e.stopPropagation(); setActiveTab('payments'); }}>Transfer</button>
                    <button className="detail-btn" onClick={(e) => { e.stopPropagation(); showToast('Deposit feature coming soon', 'success'); }}>Deposit</button>
                    <button className="detail-btn" onClick={(e) => { e.stopPropagation(); showToast('Statement download coming soon', 'success'); }}>Statements</button>
                    <button className="detail-btn" onClick={(e) => { e.stopPropagation(); setSelectedCard('savings'); setShowDetailModal(true); }}>Details</button>
                    <button className="detail-btn" onClick={(e) => { e.stopPropagation(); setActiveTab('more'); }}>Settings</button>
                    <button className="detail-btn" onClick={(e) => { e.stopPropagation(); showToast('APY: 2.5% Annual Percentage Yield', 'success'); }}>APY Info</button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Credit Cards Section */}
          <div className="section">
            <div className="section-header">
              <div className="section-title">BANK OF AMERICA</div>
            </div>
            
            <div className="account-item" onClick={() => setExpandedAccount(expandedAccount === 'credit' ? null : 'credit')}>
              <div className="account-row">
                <div className="account-info">
                  <div className="account-name">Business Advantage Cash Rewards</div>
                  <div className="account-number">...{accountId.slice(-4) || '9832'}</div>
                </div>
                <div className="account-balance">
                  <div className="balance-amount credit">${(balance * 0.3).toFixed(2)}</div>
                  <div className={`expand-icon ${expandedAccount === 'credit' ? 'expanded' : ''}`}>
                    <ChevronDown size={20} />
                  </div>
                </div>
              </div>
              {expandedAccount === 'credit' && (
                <div className="account-details">
                  <div 
                    className="card-flip-container"
                    onClick={(e) => {
                      e.stopPropagation();
                      setCardFlipped(!cardFlipped);
                    }}
                  >
                    <div className="card-3d" style={{
                      transform: cardFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)'
                    }}>
                      {/* Front of card */}
                      <div className="card-face">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                          <div>
                            <img src="/assets/BofA_rgb.png" alt="Bank of America" style={{ height: '24px', display: 'block' }} />
                          </div>
                          <div style={{ fontSize: '36px', fontWeight: '700', fontStyle: 'italic', color: 'white', textShadow: '2px 2px 4px rgba(0,0,0,0.3)' }}>VISA</div>
                        </div>
                        <div>
                          <img src="/assets/creditcardchip.jpg" alt="chip" style={{ width: '50px', height: '40px', borderRadius: '6px', marginBottom: '16px', objectFit: 'cover' }} />
                          <div style={{ fontSize: '22px', letterSpacing: '3px', marginBottom: '20px', fontFamily: 'Courier New, monospace', fontWeight: '500' }}>
                            4532  {(accountId.slice(-4) || '0000').padStart(4, '0')}  {(accountId.slice(-8, -4) || '0000').padStart(4, '0')}  {(accountId.slice(-12, -8) || '0000').padStart(4, '0')}
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end' }}>
                            <div>
                              <div style={{ fontSize: '9px', opacity: 0.9, marginBottom: '4px', letterSpacing: '1px' }}>CARD HOLDER</div>
                              <div style={{ fontSize: '15px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '1px' }}>{name}</div>
                            </div>
                            <div>
                              <div style={{ fontSize: '9px', opacity: 0.9, marginBottom: '4px', letterSpacing: '1px' }}>VALID THRU</div>
                              <div style={{ fontSize: '15px', fontWeight: '600' }}>12/28</div>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Back of card */}
                      <div className="card-face back">
                        <div style={{ width: '100%', height: '45px', background: '#000', marginTop: '24px' }}></div>
                        <div style={{ padding: '12px 0' }}>
                          <div style={{ background: '#e5e7eb', height: '40px', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', paddingRight: '12px', marginBottom: '12px' }}>
                            <div style={{ background: 'white', padding: '4px 12px', borderRadius: '4px', fontSize: '16px', fontWeight: '700', color: '#1f2937', letterSpacing: '2px', fontStyle: 'italic' }}>***</div>
                          </div>
                          <div style={{ fontSize: '9px', color: 'white', opacity: 0.9, marginBottom: '10px', lineHeight: '1.3' }}>
                            This card is property of Bank of America. If found, please return to any branch or call 1-800-432-1000.
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ fontSize: '9px', color: 'white', opacity: 0.8 }}>Customer Service: 1-800-432-1000</div>
                            <div style={{ background: 'white', padding: '3px 6px', borderRadius: '3px' }}>
                              <img src="/assets/BofA_rgb.png" alt="Bank of America" style={{ height: '10px', display: 'block' }} />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="detail-buttons">
                    <button className="detail-btn" onClick={(e) => { e.stopPropagation(); setActiveTab('payments'); }}>Pay Card</button>
                    <button className="detail-btn" onClick={(e) => { e.stopPropagation(); showToast('You have 15,000 rewards points available', 'success'); }}>Rewards</button>
                    <button className="detail-btn" onClick={(e) => { e.stopPropagation(); showToast('Statement download coming soon', 'success'); }}>Statements</button>
                    <button className="detail-btn" onClick={(e) => { e.stopPropagation(); setSelectedCard('credit'); setShowDetailModal(true); }}>Details</button>
                    <button className="detail-btn" onClick={(e) => { e.stopPropagation(); setActiveTab('more'); }}>Settings</button>
                    <button className="detail-btn" onClick={(e) => { e.stopPropagation(); setActiveTab('transactions'); }}>Activity</button>
                  </div>
                </div>
              )}
            </div>
          </div>
            </>
          )}
          
          {activeTab === 'more' && (
            <div style={{ gridColumn: '1 / -1' }}>
              {/* Settings Section */}
              <div className="section">
                <div className="section-header">
                  <div className="section-title">SETTINGS</div>
                </div>
                <div className="account-item" onClick={() => showToast('Feature coming soon', 'success')}>
                  <div className="account-row">
                    <div className="account-info">
                      <div className="account-name">Account Preferences</div>
                      <div className="account-number">Manage your account settings</div>
                    </div>
                    <ChevronDown size={20} style={{ transform: 'rotate(-90deg)' }} />
                  </div>
                </div>
                <div className="account-item" onClick={() => showToast('Feature coming soon', 'success')}>
                  <div className="account-row">
                    <div className="account-info">
                      <div className="account-name">Notification Settings</div>
                      <div className="account-number">Email, SMS, and push notifications</div>
                    </div>
                    <ChevronDown size={20} style={{ transform: 'rotate(-90deg)' }} />
                  </div>
                </div>
                <div className="account-item" onClick={() => showToast('Feature coming soon', 'success')}>
                  <div className="account-row">
                    <div className="account-info">
                      <div className="account-name">Security Settings</div>
                      <div className="account-number">2FA, password, and security</div>
                    </div>
                    <ChevronDown size={20} style={{ transform: 'rotate(-90deg)' }} />
                  </div>
                </div>
              </div>
              
              {/* Profile Section */}
              <div className="section">
                <div className="section-header">
                  <div className="section-title">PROFILE</div>
                </div>
                <div className="account-item" onClick={() => showToast('Feature coming soon', 'success')}>
                  <div className="account-row">
                    <div className="account-info">
                      <div className="account-name">Personal Information</div>
                      <div className="account-number">Name, email, phone number</div>
                    </div>
                    <ChevronDown size={20} style={{ transform: 'rotate(-90deg)' }} />
                  </div>
                </div>
                <div className="account-item" onClick={() => showToast('Feature coming soon', 'success')}>
                  <div className="account-row">
                    <div className="account-info">
                      <div className="account-name">Change Avatar</div>
                      <div className="account-number">Upload profile picture</div>
                    </div>
                    <ChevronDown size={20} style={{ transform: 'rotate(-90deg)' }} />
                  </div>
                </div>
              </div>
              
              {/* Help & Support Section */}
              <div className="section">
                <div className="section-header">
                  <div className="section-title">HELP & SUPPORT</div>
                </div>
                <div className="account-item" onClick={() => showToast('Feature coming soon', 'success')}>
                  <div className="account-row">
                    <div className="account-info">
                      <div className="account-name">FAQ</div>
                      <div className="account-number">Frequently asked questions</div>
                    </div>
                    <ChevronDown size={20} style={{ transform: 'rotate(-90deg)' }} />
                  </div>
                </div>
                <div className="account-item" onClick={() => showToast('Feature coming soon', 'success')}>
                  <div className="account-row">
                    <div className="account-info">
                      <div className="account-name">Contact Support</div>
                      <div className="account-number">Get help from our team</div>
                    </div>
                    <ChevronDown size={20} style={{ transform: 'rotate(-90deg)' }} />
                  </div>
                </div>
                <div className="account-item" onClick={() => showToast('Feature coming soon', 'success')}>
                  <div className="account-row">
                    <div className="account-info">
                      <div className="account-name">Live Chat</div>
                      <div className="account-number">Chat with a representative</div>
                    </div>
                    <ChevronDown size={20} style={{ transform: 'rotate(-90deg)' }} />
                  </div>
                </div>
              </div>
              
              {/* About Section */}
              <div className="section">
                <div className="section-header">
                  <div className="section-title">ABOUT</div>
                </div>
                <div className="account-item">
                  <div className="account-row">
                    <div className="account-info">
                      <div className="account-name">Version</div>
                      <div className="account-number">1.0.0</div>
                    </div>
                  </div>
                </div>
                <div className="account-item" onClick={logout} style={{ cursor: 'pointer' }}>
                  <div className="account-row">
                    <div className="account-info">
                      <div className="account-name" style={{ color: '#e31837' }}>Logout</div>
                      <div className="account-number">Sign out of your account</div>
                    </div>
                    <ChevronDown size={20} style={{ transform: 'rotate(-90deg)', color: '#e31837' }} />
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'deposit' && (
            <div style={{ gridColumn: '1 / -1' }}>
              <div className="payment-form">
                <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#012169', marginBottom: '24px' }}>Mobile Check Deposit</h2>
                
                <div className="form-group">
                  <label className="form-label">Front of Check</label>
                  <input 
                    type="file" 
                    accept="image/*" 
                    capture="environment"
                    onChange={(e) => handleCheckUpload(e, 'front')}
                    style={{ display: 'none' }}
                    id="check-front-main"
                  />
                  <label 
                    htmlFor="check-front-main"
                    style={{ display: 'block', padding: '60px 20px', border: '2px dashed #e5e7eb', borderRadius: '8px', textAlign: 'center', cursor: 'pointer', background: checkFront ? '#f0fdf4' : '#fafafa', fontSize: '16px', color: checkFront ? '#10b981' : '#6b7280', fontWeight: '600' }}
                  >
                    {checkFront ? '✓ Front of Check Uploaded' : '📷 Tap to Capture Front of Check'}
                  </label>
                </div>
                
                <div className="form-group">
                  <label className="form-label">Back of Check</label>
                  <input 
                    type="file" 
                    accept="image/*" 
                    capture="environment"
                    onChange={(e) => handleCheckUpload(e, 'back')}
                    style={{ display: 'none' }}
                    id="check-back-main"
                  />
                  <label 
                    htmlFor="check-back-main"
                    style={{ display: 'block', padding: '60px 20px', border: '2px dashed #e5e7eb', borderRadius: '8px', textAlign: 'center', cursor: 'pointer', background: checkBack ? '#f0fdf4' : '#fafafa', fontSize: '16px', color: checkBack ? '#10b981' : '#6b7280', fontWeight: '600' }}
                  >
                    {checkBack ? '✓ Back of Check Uploaded' : '📷 Tap to Capture Back of Check'}
                  </label>
                </div>
                
                <div className="form-group">
                  <label className="form-label">Check Amount</label>
                  <input 
                    type="number" 
                    className="form-input"
                    value={depositAmount}
                    onChange={(e) => setDepositAmount(e.target.value)}
                    placeholder="0.00"
                  />
                </div>
                
                <button 
                  className="submit-btn"
                  onClick={handleMobileDeposit}
                  disabled={paymentLoading}
                >
                  {paymentLoading ? 'Processing Deposit...' : 'Submit Deposit'}
                </button>
              </div>
              
              <div className="section">
                <div className="section-header">
                  <div className="section-title">DEPOSIT TIPS</div>
                </div>
                <div style={{ padding: '20px' }}>
                  <div style={{ fontSize: '14px', color: '#6b7280', lineHeight: '1.6' }}>
                    <p style={{ marginBottom: '12px' }}>• Endorse the back of your check</p>
                    <p style={{ marginBottom: '12px' }}>• Place check on a dark surface</p>
                    <p style={{ marginBottom: '12px' }}>• Ensure all corners are visible</p>
                    <p style={{ marginBottom: '12px' }}>• Use good lighting</p>
                    <p>• Keep check for 30 days after deposit</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Bottom Navigation */}
        <nav className="bottom-nav" aria-label="Main navigation">
          <button 
            className={`bottom-nav-item ${activeTab === 'accounts' ? 'active' : ''}`}
            onClick={() => setActiveTab('accounts')}
            aria-current={activeTab === 'accounts' ? 'page' : undefined}
          >
            <Building2 size={24} />
            <div className="bottom-nav-label">Accounts</div>
          </button>
          <button 
            className={`bottom-nav-item ${activeTab === 'payments' ? 'active' : ''}`}
            onClick={() => setActiveTab('payments')}
            aria-current={activeTab === 'payments' ? 'page' : undefined}
          >
            <ArrowRightLeft size={24} />
            <div className="bottom-nav-label">Pay</div>
          </button>
          <button 
            className={`bottom-nav-item ${activeTab === 'deposit' ? 'active' : ''}`}
            onClick={() => setActiveTab('deposit')}
            aria-current={activeTab === 'deposit' ? 'page' : undefined}
          >
            <Camera size={24} />
            <div className="bottom-nav-label">Deposit</div>
          </button>
          <button 
            className={`bottom-nav-item ${activeTab === 'more' ? 'active' : ''}`}
            onClick={() => setActiveTab('more')}
            aria-current={activeTab === 'more' ? 'page' : undefined}
          >
            <Settings size={24} />
            <div className="bottom-nav-label">More</div>
          </button>
        </nav>
        </div>
      </div>
      
      {/* Detail Modal */}
      {showDetailModal && (
        <div className="detail-modal" onClick={() => setShowDetailModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ position: 'relative' }}>
            <button className="modal-close" onClick={() => setShowDetailModal(false)}>×</button>
            <div className="modal-header">
              {selectedCard === 'checking' && 'Checking Account Details'}
              {selectedCard === 'savings' && 'Savings Account Details'}
              {selectedCard === 'credit' && 'Credit Card Details'}
            </div>
            <div style={{ marginBottom: '20px' }}>
              <div style={{ fontSize: '14px', color: '#6b7280', marginBottom: '8px' }}>Account Number</div>
              <div style={{ fontSize: '18px', fontWeight: '600', color: '#111827' }}>...{accountId.slice(-4) || '0000'}</div>
            </div>
            <div style={{ marginBottom: '20px' }}>
              <div style={{ fontSize: '14px', color: '#6b7280', marginBottom: '8px' }}>Available Balance</div>
              <div style={{ fontSize: '32px', fontWeight: '700', color: '#111827' }}>
                ${selectedCard === 'checking' ? balance.toFixed(2) : selectedCard === 'savings' ? (balance * 0.15).toFixed(2) : (balance * 0.3).toFixed(2)}
              </div>
            </div>
            <div style={{ marginBottom: '20px' }}>
              <div style={{ fontSize: '14px', color: '#6b7280', marginBottom: '8px' }}>Account Type</div>
              <div style={{ fontSize: '16px', fontWeight: '600', color: '#111827' }}>
                {selectedCard === 'checking' && 'Business Advantage Checking'}
                {selectedCard === 'savings' && 'Business Advantage Savings'}
                {selectedCard === 'credit' && 'Business Cash Rewards Credit Card'}
              </div>
            </div>
            <button 
              onClick={() => setShowDetailModal(false)}
              style={{ width: '100%', padding: '14px', background: '#012169', color: 'white', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}
            >
              Close
            </button>
          </div>
        </div>
      )}
      
      {/* Mobile Deposit Modal */}
      {showDepositModal && (
        <div className="detail-modal" onClick={() => setShowDepositModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ position: 'relative' }}>
            <button className="modal-close" onClick={() => setShowDepositModal(false)}>×</button>
            <div className="modal-header">Mobile Check Deposit</div>
            
            <div style={{ marginBottom: '20px' }}>
              <div style={{ fontSize: '14px', fontWeight: '600', color: '#111827', marginBottom: '8px' }}>Front of Check</div>
              <input 
                type="file" 
                accept="image/*" 
                capture="environment"
                onChange={(e) => handleCheckUpload(e, 'front')}
                style={{ display: 'none' }}
                id="check-front"
              />
              <label 
                htmlFor="check-front"
                style={{ display: 'block', padding: '40px', border: '2px dashed #e5e7eb', borderRadius: '8px', textAlign: 'center', cursor: 'pointer', background: checkFront ? '#f0fdf4' : '#fafafa' }}
              >
                {checkFront ? '✓ Front Uploaded' : '📷 Tap to capture front'}
              </label>
            </div>
            
            <div style={{ marginBottom: '20px' }}>
              <div style={{ fontSize: '14px', fontWeight: '600', color: '#111827', marginBottom: '8px' }}>Back of Check</div>
              <input 
                type="file" 
                accept="image/*" 
                capture="environment"
                onChange={(e) => handleCheckUpload(e, 'back')}
                style={{ display: 'none' }}
                id="check-back"
              />
              <label 
                htmlFor="check-back"
                style={{ display: 'block', padding: '40px', border: '2px dashed #e5e7eb', borderRadius: '8px', textAlign: 'center', cursor: 'pointer', background: checkBack ? '#f0fdf4' : '#fafafa' }}
              >
                {checkBack ? '✓ Back Uploaded' : '📷 Tap to capture back'}
              </label>
            </div>
            
            <div style={{ marginBottom: '20px' }}>
              <div style={{ fontSize: '14px', fontWeight: '600', color: '#111827', marginBottom: '8px' }}>Check Amount</div>
              <input 
                type="number" 
                value={depositAmount}
                onChange={(e) => setDepositAmount(e.target.value)}
                placeholder="0.00"
                style={{ width: '100%', padding: '12px 16px', border: '2px solid #e5e7eb', borderRadius: '8px', fontSize: '16px', outline: 'none' }}
              />
            </div>
            
            <button 
              onClick={handleMobileDeposit}
              disabled={paymentLoading}
              style={{ width: '100%', padding: '14px', background: paymentLoading ? '#9ca3af' : '#e31837', color: 'white', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '600', cursor: paymentLoading ? 'not-allowed' : 'pointer', marginBottom: '12px' }}
            >
              {paymentLoading ? 'Processing...' : 'Submit Deposit'}
            </button>
            
            <button 
              onClick={() => setShowDepositModal(false)}
              style={{ width: '100%', padding: '14px', background: 'white', color: '#6b7280', border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
      
      {/* Hidden Avatar Upload Input */}
      <input 
        type="file" 
        accept="image/*" 
        id="avatar-upload"
        style={{ display: 'none' }}
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
              const avatarData = reader.result as string;
              setAvatar(avatarData);
              localStorage.setItem('userAvatar', avatarData);
              showToast('Profile picture updated', 'success');
            };
            reader.readAsDataURL(file);
          }
        }}
      />
    </>
  );
}
