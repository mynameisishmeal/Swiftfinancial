import { useState } from 'react';

export function useTransfers(
  accountId: string,
  balance: number,
  email: string,
  loadAccount: (email: string) => Promise<void>,
  showToast: (message: string, type: 'success' | 'error') => void,
  setReceiptData: (data: any) => void,
  setShowReceipt: (show: boolean) => void
) {
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
  const [bankSearch, setBankSearch] = useState('');

  const executeTransfer = async () => {
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

  const executeBillPay = async () => {
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

  const executeZelle = async () => {
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

  const executeWire = async () => {
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

  return {
    transferAmount, setTransferAmount,
    billAmount, setBillAmount,
    zelleRecipient, setZelleRecipient,
    zelleAmount, setZelleAmount,
    wireBank, setWireBank,
    wireRouting, setWireRouting,
    wireAccount, setWireAccount,
    wireAmount, setWireAmount,
    paymentMemo, setPaymentMemo,
    paymentLoading,
    payeeSearch, setPayeeSearch,
    bankSearch, setBankSearch,
    executeTransfer,
    executeBillPay,
    executeZelle,
    executeWire
  };
}
