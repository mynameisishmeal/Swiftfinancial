'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { DollarSign, ArrowRightLeft, Camera, PieChart, Menu, MessageCircle, Gift, FileText, HelpCircle } from 'lucide-react';
import { PreferencesTab, NotificationsTab, SecurityTab, FAQTab, LiveChatTab } from './components/SettingsTabs';
import RewardsTab from './components/RewardsTab';
import ProductsTab from './components/ProductsTab';
import OffersTab from './components/OffersTab';
import LifePlanTab from './components/LifePlanTab';
import AccountsTab from './components/AccountsTab';
import DashboardTab from './components/DashboardTab';
import TransferTab from './components/TransferTab';
import { DepositTab, MoreTab } from './components/DepositMoreTabs';
import TopNavigation from './components/TopNavigation';
import EricaModal from './components/EricaModal';
import { MenuOverlay, BottomNav } from './components/Navigation';
import ReceiptModal from './components/ReceiptModal';
import { payeeList, bankList } from './constants/lists';

export default function Dashboard() {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [accountId, setAccountId] = useState('');
  const [avatar, setAvatar] = useState('');
  const [balance, setBalance] = useState(0);
  const [savingsBalance, setSavingsBalance] = useState(0);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [taxCleared, setTaxCleared] = useState(true);
  const [bankingExpanded, setBankingExpanded] = useState(true);
  const [activeTab, setActiveTab] = useState('accounts');
  const [activeNav, setActiveNav] = useState('accounts');
  const [showMenu, setShowMenu] = useState(false);
  const [expandedAccount, setExpandedAccount] = useState<string | null>('checking');
  const [paymentType, setPaymentType] = useState('transfer');
  const [transferAmount, setTransferAmount] = useState('');
  const [billAmount, setBillAmount] = useState('');
  const [zelleRecipient, setZelleRecipient] = useState('');
  const [zelleAmount, setZelleAmount] = useState('');
  const [wireBank, setWireBank] = useState('');
  const [wireRouting, setWireRouting] = useState('');
  const [wireAccount, setWireAccount] = useState('');
  const [wireAmount, setWireAmount] = useState('');
  const [paymentMemo, setPaymentMemo] = useState('');
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [payeeSearch, setPayeeSearch] = useState('');
  const [showPayeeSuggestions, setShowPayeeSuggestions] = useState(false);
  const [bankSearch, setBankSearch] = useState('');
  const [showBankSuggestions, setShowBankSuggestions] = useState(false);
  const [toasts, setToasts] = useState<Array<{id: number, message: string, type: 'success' | 'error'}>>([]);
  const [checkFront, setCheckFront] = useState<string | null>(null);
  const [checkBack, setCheckBack] = useState<string | null>(null);
  const [depositAmount, setDepositAmount] = useState('');
  const [showInbox, setShowInbox] = useState(false);
  const [showProducts, setShowProducts] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [cardFlipped, setCardFlipped] = useState(false);
  const [iban, setIban] = useState('');
  const [creditBalance, setCreditBalance] = useState(0);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isDesktop, setIsDesktop] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [showErica, setShowErica] = useState(false);
  const [ericaMessage, setEricaMessage] = useState('');
  const [ericaChat, setEricaChat] = useState<Array<{role: 'user' | 'assistant', message: string}>>([]);
  const [liveChatMessage, setLiveChatMessage] = useState('');
  const [liveChatMessages, setLiveChatMessages] = useState<Array<{sender: 'user' | 'admin', message: string, timestamp: Date}>>([]);
  const [showReceipt, setShowReceipt] = useState(false);
  const [receiptData, setReceiptData] = useState<any>(null);
  const router = useRouter();

  const filteredPayees = payeeSearch.length > 0
    ? payeeList.filter(p => p.name.toLowerCase().includes(payeeSearch.toLowerCase()))
    : [];

  const filteredBanks = bankSearch.length > 0
    ? bankList.filter(b => b.name.toLowerCase().includes(bankSearch.toLowerCase()))
    : [];

  useEffect(() => {
    const userEmail = localStorage.getItem('userEmail');
    const role = localStorage.getItem('userRole');
    if (!userEmail || role !== 'user') {
      router.push('/');
      return;
    }
    setEmail(userEmail);
    loadAccount(userEmail);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      const desktop = window.innerWidth >= 769;
      setIsDesktop(desktop);
      if (desktop) {
        setSidebarOpen(true);
        setShowMenu(false);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.action-btn') && !target.closest('.notification-panel') && !target.closest('.search-pill')) {
        setShowInbox(false);
        setShowProducts(false);
        setShowNotifications(false);
        setShowProfileMenu(false);
        setShowSearchResults(false);
      }
      if (!target.closest('.payee-search-container')) {
        setShowPayeeSuggestions(false);
        setShowBankSuggestions(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  useEffect(() => {
    if (activeTab === 'livechat' && email) {
      const loadMessages = async () => {
        const res = await fetch(`/api/livechat?userEmail=${email}`);
        const data = await res.json();
        if (data.messages) {
          setLiveChatMessages(data.messages);
        }
      };
      loadMessages();
      const interval = setInterval(loadMessages, 3000);
      return () => clearInterval(interval);
    }
  }, [activeTab, email]);

  const loadAccount = async (userEmail: string) => {
    const res = await fetch(`/api/accounts?email=${userEmail}`);
    const data = await res.json();
    if (data.balance !== undefined) {
      setBalance(data.balance);
      setSavingsBalance(data.balance * 0.15);
      setCreditBalance(data.balance * 0.3);
      setAccountId(data.accountId);
      setIban(data.iban);
      setAvatar(data.avatar);
      setTaxCleared(data.taxCleared !== false);
      const capitalizedName = data.name.split(' ').map((word: string) => 
        word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
      ).join(' ');
      setName(capitalizedName);
      
      const txRes = await fetch(`/api/accounts?email=${userEmail}&transactions=true`);
      const txData = await txRes.json();
      if (txData.transactions) setTransactions(txData.transactions);
    }
  };

  const showToast = (message: string, type: 'success' | 'error') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3000);
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
    
    const receipt = {
      type: 'Transfer Between Accounts',
      amount: parseFloat(transferAmount),
      from: `Checking Account ...${accountId.slice(-4)}`,
      to: 'Savings Account',
      description: paymentMemo || 'Internal Transfer',
      date: new Date(),
      confirmationNumber: `TRF${Date.now().toString().slice(-8)}`,
      status: 'Completed'
    };
    
    showToast(data.message || 'Transfer completed successfully', 'success');
    if (data.balance !== undefined) await loadAccount(email);
    setTransferAmount('');
    setPaymentMemo('');
    setPaymentLoading(false);
    setReceiptData(receipt);
    setShowReceipt(true);
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
    
    const receipt = {
      type: 'Bill Payment',
      amount: parseFloat(billAmount),
      from: `Checking Account ...${accountId.slice(-4)}`,
      to: payeeSearch,
      description: paymentMemo || `Payment to ${payeeSearch}`,
      date: new Date(),
      confirmationNumber: `BILL${Date.now().toString().slice(-8)}`,
      status: 'Completed'
    };
    
    showToast(`Bill payment of $${billAmount} to ${payeeSearch} completed`, 'success');
    if (data.balance !== undefined) await loadAccount(email);
    setBillAmount('');
    setPayeeSearch('');
    setPaymentMemo('');
    setPaymentLoading(false);
    setReceiptData(receipt);
    setShowReceipt(true);
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
    
    const receipt = {
      type: 'Zelle Payment',
      amount: parseFloat(zelleAmount),
      from: `Checking Account ...${accountId.slice(-4)}`,
      to: zelleRecipient,
      description: paymentMemo || `Zelle to ${zelleRecipient}`,
      date: new Date(),
      confirmationNumber: `ZELLE${Date.now().toString().slice(-8)}`,
      status: 'Completed'
    };
    
    showToast(`Zelle payment of $${zelleAmount} sent to ${zelleRecipient}`, 'success');
    if (data.balance !== undefined) await loadAccount(email);
    setZelleAmount('');
    setZelleRecipient('');
    setPaymentMemo('');
    setPaymentLoading(false);
    setReceiptData(receipt);
    setShowReceipt(true);
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
    
    const receipt = {
      type: 'Wire Transfer',
      amount: parseFloat(wireAmount),
      from: `Checking Account ...${accountId.slice(-4)}`,
      to: `${wireBank} - Account ${wireAccount}`,
      routing: wireRouting,
      description: paymentMemo || `Wire transfer to ${wireBank}`,
      date: new Date(),
      confirmationNumber: `WIRE${Date.now().toString().slice(-8)}`,
      status: 'Completed'
    };
    
    showToast(`Wire transfer of $${wireAmount} to ${wireBank} completed`, 'success');
    if (data.balance !== undefined) await loadAccount(email);
    setWireBank('');
    setWireRouting('');
    setWireAccount('');
    setWireAmount('');
    setPaymentMemo('');
    setPaymentLoading(false);
    setReceiptData(receipt);
    setShowReceipt(true);
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
    
    const receipt = {
      type: 'Mobile Check Deposit',
      amount: parseFloat(depositAmount),
      from: 'Check Deposit',
      to: `Checking Account ...${accountId.slice(-4)}`,
      description: 'Mobile check deposit',
      date: new Date(),
      confirmationNumber: `DEP${Date.now().toString().slice(-8)}`,
      status: 'Processing (Funds available in 1-2 business days)'
    };
    
    showToast(`Check deposit of $${depositAmount} submitted for processing`, 'success');
    if (data.balance !== undefined) await loadAccount(email);
    setCheckFront(null);
    setCheckBack(null);
    setDepositAmount('');
    setPaymentLoading(false);
    setReceiptData(receipt);
    setShowReceipt(true);
  };

  const downloadStatement = () => {
    const statement = `
Swift Financial Account Statement
==================================

Account Holder: ${name}
Account Number: ${accountId}
IBAN: ${iban}
Email: ${email}
Statement Date: ${new Date().toLocaleDateString()}

Account Balances:
-------------------
Checking Balance: $${balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
Savings Balance: $${savingsBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
Credit Card Balance: $${creditBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
Total Balance: $${(balance + savingsBalance + creditBalance).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}

Account Details:
-------------------
Rewards Points: 15,000 points (≈ $150.00 value)
FICO Score: 750
Tax Status: ${taxCleared ? 'Cleared' : 'Pending'}
Card Expiry: 12/28

Transaction History (CSV Format):
-------------------
Date,Description,Type,Amount,Balance
${transactions.slice().reverse().map(t => 
  `${new Date(t.date).toLocaleDateString()},"${(t.description || t.type.replace('_', ' ')).toUpperCase()}",${t.type},${(t.amount || 0).toFixed(2)},${(t.balance || 0).toFixed(2)}`
).join('\n')}

-------------------
End of Statement

Swift Financial, N.A. Member FDIC.
© ${new Date().getFullYear()} Swift Financial Corporation.
    `;

    const blob = new Blob([statement], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `SFI_Statement_${accountId}_${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
    showToast('Statement downloaded successfully', 'success');
  };

  const downloadTransactions = downloadStatement; // Merged into statement

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const newAvatar = reader.result as string;
        setAvatar(newAvatar);
        
        const res = await fetch('/api/accounts/avatar', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, avatar: newAvatar }),
        });
        
        if (res.ok) {
          showToast('Profile picture updated successfully', 'success');
        } else {
          showToast('Failed to update profile picture', 'error');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.length < 2) {
      setSearchResults([]);
      setShowSearchResults(false);
      return;
    }

    const results: any[] = [];
    const lowerQuery = query.toLowerCase();

    // Search transactions
    transactions.forEach(tx => {
      if (tx.description?.toLowerCase().includes(lowerQuery) || 
          tx.type?.toLowerCase().includes(lowerQuery)) {
        results.push({
          type: 'transaction',
          title: tx.description || tx.type,
          subtitle: `${new Date(tx.date).toLocaleDateString()} - $${Math.abs(tx.amount).toFixed(2)}`,
          action: () => { setActiveTab('transfer'); setActiveNav('transfer'); setShowSearchResults(false); }
        });
      }
    });

    // Search accounts
    if ('checking'.includes(lowerQuery) || accountId.includes(query)) {
      results.push({
        type: 'account',
        title: `Checking Account ...${accountId.slice(-4)}`,
        subtitle: `Balance: $${balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
        action: () => { setActiveTab('accounts'); setActiveNav('accounts'); setExpandedAccount('checking'); setShowSearchResults(false); }
      });
    }
    if ('savings'.includes(lowerQuery)) {
      results.push({
        type: 'account',
        title: 'Advantage Savings - 2501',
        subtitle: `Balance: $${savingsBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
        action: () => { setActiveTab('accounts'); setActiveNav('accounts'); setExpandedAccount('savings'); setShowSearchResults(false); }
      });
    }
    if ('credit'.includes(lowerQuery) || 'card'.includes(lowerQuery)) {
      results.push({
        type: 'account',
        title: `Business Cash Rewards - ${accountId.slice(-4)}`,
        subtitle: `Balance: $${creditBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
        action: () => { setActiveTab('accounts'); setActiveNav('accounts'); setExpandedAccount('credit'); setShowSearchResults(false); }
      });
    }

    // Search features
    const features = [
      { keywords: ['transfer', 'send', 'pay'], title: 'Transfer Money', subtitle: 'Send money between accounts', action: () => { setActiveTab('transfer'); setActiveNav('transfer'); setPaymentType('transfer'); setShowSearchResults(false); } },
      { keywords: ['bill', 'payment'], title: 'Pay Bills', subtitle: 'Pay your bills online', action: () => { setActiveTab('transfer'); setActiveNav('transfer'); setPaymentType('bill'); setShowSearchResults(false); } },
      { keywords: ['zelle', 'send money'], title: 'Send with Zelle', subtitle: 'Send money instantly', action: () => { setActiveTab('transfer'); setActiveNav('transfer'); setPaymentType('zelle'); setShowSearchResults(false); } },
      { keywords: ['wire', 'international'], title: 'Wire Transfer', subtitle: 'Send wire transfers', action: () => { setActiveTab('transfer'); setActiveNav('transfer'); setPaymentType('wire'); setShowSearchResults(false); } },
      { keywords: ['deposit', 'check', 'mobile'], title: 'Mobile Deposit', subtitle: 'Deposit checks with your phone', action: () => { setActiveTab('deposit'); setActiveNav('deposit'); setShowSearchResults(false); } },
      { keywords: ['statement', 'download'], title: 'Download Statement', subtitle: 'Get your account statement', action: () => { downloadStatement(); setShowSearchResults(false); } },
      { keywords: ['profile', 'settings', 'account'], title: 'Profile Settings', subtitle: 'Manage your profile', action: () => { router.push('/profile'); setShowSearchResults(false); } },
      { keywords: ['help', 'support', 'contact'], title: 'Help & Support', subtitle: 'Get help from our team', action: () => { router.push('/help'); setShowSearchResults(false); } },
    ];

    features.forEach(feature => {
      if (feature.keywords.some(kw => kw.includes(lowerQuery))) {
        results.push({
          type: 'feature',
          title: feature.title,
          subtitle: feature.subtitle,
          action: feature.action
        });
      }
    });

    setSearchResults(results.slice(0, 8));
    setShowSearchResults(results.length > 0);
  };

  const handleEricaSubmit = async () => {
    if (!ericaMessage.trim()) return;
    
    const userMsg = ericaMessage.trim();
    setEricaChat(prev => [...prev, { role: 'user', message: userMsg }]);
    setEricaMessage('');
    
    try {
      const res = await fetch('/api/erica', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMsg,
          conversationHistory: ericaChat,
          userData: {
            balance,
            savingsBalance,
            creditBalance,
            taxCleared,
            name,
            email
          }
        })
      });
      
      const data = await res.json();
      
      if (data.success) {
        setEricaChat(prev => [...prev, { role: 'assistant', message: data.response }]);
        
        // Execute action if provided
        if (data.action?.type === 'navigate') {
          setTimeout(() => {
            setActiveTab(data.action.target);
            setActiveNav(data.action.target);
          }, 1000);
        }
      } else {
        setEricaChat(prev => [...prev, { role: 'assistant', message: 'Sorry, I encountered an error. Please try again.' }]);
      }
    } catch (error) {
      setEricaChat(prev => [...prev, { role: 'assistant', message: 'Sorry, I\'m having trouble connecting. Please try again.' }]);
    }
  };

  const handleLiveChatSubmit = async () => {
    if (!liveChatMessage.trim()) return;
    
    const userMsg = liveChatMessage.trim();
    const newMessage = { sender: 'user' as const, message: userMsg, timestamp: new Date() };
    setLiveChatMessages(prev => [...prev, newMessage]);
    setLiveChatMessage('');
    
    // Send to admin via API
    await fetch('/api/livechat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        userEmail: email, 
        userName: name,
        message: userMsg,
        timestamp: new Date()
      }),
    });
  };

  const logout = () => {
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userRole');
    router.push('/');
  };

  return (
    <>
      <style jsx>{`
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



      <div className="app-container">
        {/* Toast Notifications */}
        <div className="toast-container">
          {toasts.map(toast => (
            <div key={toast.id} className={`toast ${toast.type}`}>
              <div style={{ fontSize: '20px' }}>{toast.type === 'success' ? '✓' : '✕'}</div>
              <div className="toast-message">{toast.message}</div>
            </div>
          ))}
        </div>

        {/* Desktop Sidebar */}
        {isDesktop && (
        <div className={`sidebar ${sidebarOpen ? '' : 'closed'}`}>
          <div className="sidebar-header">
            <img src="/assets/BofA_rgb.png" alt="Swift Financial" style={{ height: '24px' }} />
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
            <button className={`sidebar-nav-item ${activeNav === 'rewards' ? 'active' : ''}`} onClick={() => { setActiveNav('rewards'); setActiveTab('rewards'); }}>
              <Gift size={20} />
              <span>Rewards</span>
            </button>
            <button className={`sidebar-nav-item ${activeNav === 'offers' ? 'active' : ''}`} onClick={() => { setActiveNav('offers'); setActiveTab('offers'); }}>
              <FileText size={20} />
              <span>Offers</span>
            </button>
            <button className={`sidebar-nav-item ${activeNav === 'livechat' ? 'active' : ''}`} onClick={() => { setActiveNav('livechat'); setActiveTab('livechat'); }}>
              <MessageCircle size={20} />
              <span>Live Chat</span>
            </button>
            <button className={`sidebar-nav-item ${activeNav === 'faq' ? 'active' : ''}`} onClick={() => { setActiveNav('faq'); setActiveTab('faq'); }}>
              <HelpCircle size={20} />
              <span>Help & FAQ</span>
            </button>
            <button className={`sidebar-nav-item ${activeNav === 'more' ? 'active' : ''}`} onClick={() => { setActiveNav('more'); setActiveTab('more'); }}>
              <Menu size={20} />
              <span>More</span>
            </button>
          </nav>
        </div>
        )}

        {/* Main Content Wrapper */}
        <div className={`main-content-wrapper ${sidebarOpen ? '' : 'sidebar-closed'}`}>

        {/* Top Navigation */}
        <TopNavigation 
          isDesktop={isDesktop}
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          setShowMenu={setShowMenu}
          showMenu={showMenu}
          showInbox={showInbox}
          setShowInbox={setShowInbox}
          showProducts={showProducts}
          setShowProducts={setShowProducts}
          showNotifications={showNotifications}
          setShowNotifications={setShowNotifications}
          showProfileMenu={showProfileMenu}
          setShowProfileMenu={setShowProfileMenu}
          avatar={avatar}
          name={name}
          searchQuery={searchQuery}
          handleSearch={handleSearch}
          showSearchResults={showSearchResults}
          setShowSearchResults={setShowSearchResults}
          searchResults={searchResults}
          showErica={showErica}
          setShowErica={setShowErica}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          showToast={showToast}
          router={router}
          handleAvatarChange={handleAvatarChange}
          logout={logout}
        />

        {/* Erica AI Assistant Modal */}
        <EricaModal 
          showErica={showErica}
          setShowErica={setShowErica}
          ericaMessage={ericaMessage}
          setEricaMessage={setEricaMessage}
          ericaChat={ericaChat}
          handleEricaSubmit={handleEricaSubmit}
        />

        {/* Menu Overlay */}
        <MenuOverlay 
          showMenu={showMenu}
          setShowMenu={setShowMenu}
          router={router}
          logout={logout}
          setActiveTab={setActiveTab}
          setActiveNav={setActiveNav}
        />

        {/* Content */}
        <div className="content">
          {/* Hidden avatar upload input */}
          <input
            id="avatar-upload"
            type="file"
            accept="image/*"
            onChange={handleAvatarChange}
            style={{ display: 'none' }}
          />

          {activeTab === 'accounts' && <AccountsTab name={name} balance={balance} savingsBalance={savingsBalance} creditBalance={creditBalance} accountId={accountId} iban={iban} taxCleared={taxCleared} cardFlipped={cardFlipped} bankingExpanded={bankingExpanded} expandedAccount={expandedAccount} setActiveTab={setActiveTab} setActiveNav={setActiveNav} setBankingExpanded={setBankingExpanded} setExpandedAccount={setExpandedAccount} setCardFlipped={setCardFlipped} downloadStatement={downloadStatement} showToast={showToast} />}

          {activeTab === 'dashboard' && <DashboardTab balance={balance} savingsBalance={savingsBalance} creditBalance={creditBalance} accountId={accountId} name={name} email={email} taxCleared={taxCleared} iban={iban} setActiveTab={setActiveTab} setActiveNav={setActiveNav} setPaymentType={setPaymentType} />}

          {activeTab === 'transfer' && <TransferTab paymentType={paymentType} setPaymentType={setPaymentType} transferAmount={transferAmount} setTransferAmount={setTransferAmount} billAmount={billAmount} setBillAmount={setBillAmount} zelleRecipient={zelleRecipient} setZelleRecipient={setZelleRecipient} zelleAmount={zelleAmount} setZelleAmount={setZelleAmount} wireBank={wireBank} setWireBank={setWireBank} wireRouting={wireRouting} setWireRouting={setWireRouting} wireAccount={wireAccount} setWireAccount={setWireAccount} wireAmount={wireAmount} setWireAmount={setWireAmount} paymentMemo={paymentMemo} setPaymentMemo={setPaymentMemo} paymentLoading={paymentLoading} payeeSearch={payeeSearch} setPayeeSearch={setPayeeSearch} showPayeeSuggestions={showPayeeSuggestions} setShowPayeeSuggestions={setShowPayeeSuggestions} filteredPayees={filteredPayees} handleTransfer={handleTransfer} handleBillPay={handleBillPay} handleZelle={handleZelle} handleWire={handleWire} transactions={transactions} bankSearch={bankSearch} setBankSearch={setBankSearch} showBankSuggestions={showBankSuggestions} setShowBankSuggestions={setShowBankSuggestions} filteredBanks={filteredBanks} />}

          {activeTab === 'deposit' && <DepositTab checkFront={checkFront} checkBack={checkBack} depositAmount={depositAmount} setDepositAmount={setDepositAmount} handleCheckUpload={handleCheckUpload} handleMobileDeposit={handleMobileDeposit} paymentLoading={paymentLoading} />}

          {activeTab === 'lifeplan' && <LifePlanTab showToast={showToast} />}

          {activeTab === 'rewards' && <RewardsTab showToast={showToast} />}

          {activeTab === 'offers' && <OffersTab showToast={showToast} />}

          {activeTab === 'products' && <ProductsTab showToast={showToast} />}

          {activeTab === 'more' && <MoreTab router={router} setActiveTab={setActiveTab} setActiveNav={setActiveNav} handleAvatarChange={handleAvatarChange} />}

          {activeTab === 'preferences' && <PreferencesTab showToast={showToast} />}

          {activeTab === 'notifications' && <NotificationsTab showToast={showToast} />}

          {activeTab === 'security' && <SecurityTab showToast={showToast} />}

          {activeTab === 'faq' && <FAQTab />}

          {activeTab === 'livechat' && <LiveChatTab liveChatMessage={liveChatMessage} setLiveChatMessage={setLiveChatMessage} liveChatMessages={liveChatMessages} handleLiveChatSubmit={handleLiveChatSubmit} />}
        </div>

        {/* Bottom Navigation */}
        <BottomNav 
          activeNav={activeNav}
          setActiveNav={setActiveNav}
          setActiveTab={setActiveTab}
        />

        {/* Receipt Modal */}
        <ReceiptModal showReceipt={showReceipt} setShowReceipt={setShowReceipt} receiptData={receiptData} showToast={showToast} />
        </div>
      </div>
    </>
  );
}
