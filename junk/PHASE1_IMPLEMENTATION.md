# Phase 1 Implementation Plan: Make Payments Functional

## Current Status
- ✅ Beautiful UI complete at `/testdashboard`
- ✅ Payment forms built with validation
- ❌ Forms not connected to backend APIs
- ❌ No loading states
- ❌ No success/error messages

## What Needs to Be Added

### 1. Transfer Between Accounts
**Location:** Payments tab, when paymentType === 'transfer'

**Add:**
```typescript
const [transferAmount, setTransferAmount] = useState('');
const [transferTo, setTransferTo] = useState('savings');
const [transferLoading, setTransferLoading] = useState(false);

const handleTransfer = async () => {
  if (!transferAmount || parseFloat(transferAmount) <= 0) {
    setMessage('Please enter a valid amount');
    return;
  }
  
  setTransferLoading(true);
  // Call existing transfer API
  const res = await fetch('/api/accounts', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ 
      accountId, 
      amount: parseFloat(transferAmount), 
      type: 'transfer',
      to: transferTo 
    }),
  });
  
  const data = await res.json();
  setMessage(data.message);
  if (data.balance !== undefined) {
    setBalance(data.balance);
    await loadAccount(email);
  }
  setTransferAmount('');
  setTransferLoading(false);
  setTimeout(() => setMessage(''), 3000);
};
```

### 2. Bill Pay
**Location:** Payments tab, when paymentType === 'bill'

**Add:**
```typescript
const [billAmount, setBillAmount] = useState('');
const [billPayee, setBillPayee] = useState('');
const [billLoading, setBillLoading] = useState(false);

const handleBillPay = async () => {
  if (!billAmount || !billPayee) {
    setMessage('Please select a payee and enter amount');
    return;
  }
  
  setBillLoading(true);
  // Create new bill pay API endpoint
  const res = await fetch('/api/billpay', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ 
      email,
      accountId,
      payee: billPayee,
      amount: parseFloat(billAmount)
    }),
  });
  
  const data = await res.json();
  setMessage(data.message);
  if (res.ok) {
    await loadAccount(email);
    setBillAmount('');
    setBillPayee('');
  }
  setBillLoading(false);
  setTimeout(() => setMessage(''), 3000);
};
```

### 3. Zelle Payments
**Location:** Payments tab, when paymentType === 'zelle'

**Add:**
```typescript
const [zelleRecipient, setZelleRecipient] = useState('');
const [zelleAmount, setZelleAmount] = useState('');
const [zelleMessage, setZelleMessage] = useState('');
const [zelleLoading, setZelleLoading] = useState(false);

const handleZelle = async () => {
  if (!zelleAmount || !zelleRecipient) {
    setMessage('Please enter recipient and amount');
    return;
  }
  
  if (!taxCleared) {
    setMessage('Zelle blocked: You have outstanding tax issues.');
    return;
  }
  
  setZelleLoading(true);
  const res = await fetch('/api/zelle', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ 
      fromEmail: email, 
      toIdentifier: zelleRecipient, 
      amount: parseFloat(zelleAmount),
      message: zelleMessage
    }),
  });
  
  const data = await res.json();
  setMessage(data.message);
  if (res.ok) {
    await loadAccount(email);
    setZelleAmount('');
    setZelleRecipient('');
    setZelleMessage('');
  }
  setZelleLoading(false);
  setTimeout(() => setMessage(''), 3000);
};
```

### 4. Wire Transfer
**Location:** Payments tab, when paymentType === 'wire'

**Add:**
```typescript
const [wireBank, setWireBank] = useState('');
const [wireRouting, setWireRouting] = useState('');
const [wireAccount, setWireAccount] = useState('');
const [wireAmount, setWireAmount] = useState('');
const [wireLoading, setWireLoading] = useState(false);

const handleWire = async () => {
  if (!wireBank || !wireRouting || !wireAccount || !wireAmount) {
    setMessage('Please fill all wire transfer fields');
    return;
  }
  
  if (wireRouting.length !== 9) {
    setMessage('Routing number must be exactly 9 digits');
    return;
  }
  
  setWireLoading(true);
  const res = await fetch('/api/wire', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ 
      fromEmail: email,
      bankName: wireBank,
      routingNumber: wireRouting,
      accountNumber: wireAccount,
      amount: parseFloat(wireAmount)
    }),
  });
  
  const data = await res.json();
  setMessage(data.message);
  if (res.ok) {
    await loadAccount(email);
    setWireBank('');
    setWireRouting('');
    setWireAccount('');
    setWireAmount('');
  }
  setWireLoading(false);
  setTimeout(() => setMessage(''), 3000);
};
```

## Additional Features Needed

### 5. Deposit & Withdraw (from original dashboard)
Add these to the Accounts tab detail buttons:

```typescript
const [amount, setAmount] = useState('');
const [actionLoading, setActionLoading] = useState('');

const deposit = async () => {
  setActionLoading('deposit');
  const res = await fetch('/api/accounts', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ accountId, amount: parseFloat(amount), type: 'deposit' }),
  });
  const data = await res.json();
  setMessage(data.message);
  if (data.balance !== undefined) {
    setBalance(data.balance);
    await loadAccount(email);
  }
  setAmount('');
  setActionLoading('');
  setTimeout(() => setMessage(''), 3000);
};

const withdraw = async () => {
  if (!taxCleared) {
    setMessage('Withdrawal blocked: Outstanding tax issues.');
    return;
  }
  setActionLoading('withdraw');
  const res = await fetch('/api/accounts', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ accountId, amount: parseFloat(amount), type: 'withdraw' }),
  });
  const data = await res.json();
  setMessage(data.message);
  if (data.balance !== undefined) {
    setBalance(data.balance);
    await loadAccount(email);
  }
  setAmount('');
  setActionLoading('');
  setTimeout(() => setMessage(''), 3000);
};
```

### 6. Statement Downloads
```typescript
const downloadStatement = () => {
  const statement = `
Bank of America Account Statement
==================================

Account Holder: ${name}
Account Number: ${accountId}
Statement Date: ${new Date().toLocaleDateString()}

Current Balance: $${balance.toFixed(2)}

Transaction History:
-------------------
${transactions.slice().reverse().map(t => 
  `${new Date(t.date).toLocaleDateString()} - ${(t.description || t.type).toUpperCase()} - $${(t.amount || 0).toFixed(2)}`
).join('\\n')}
  `;

  const blob = new Blob([statement], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `Statement_${accountId}_${new Date().toISOString().split('T')[0]}.txt`;
  a.click();
  setMessage('Statement downloaded');
  setTimeout(() => setMessage(''), 3000);
};
```

### 7. Avatar Upload
```typescript
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
        setMessage('Profile picture updated');
        setTimeout(() => setMessage(''), 3000);
      }
    };
    reader.readAsDataURL(file);
  }
};
```

## UI Updates Needed

1. **Replace Continue buttons with actual handlers**
2. **Add loading states to buttons**
3. **Bind input fields to state variables**
4. **Add success/error message display**
5. **Add form validation**

## API Endpoints Needed

### Existing (Already Working):
- ✅ `/api/accounts` - GET (load account)
- ✅ `/api/accounts` - PUT (deposit/withdraw)
- ✅ `/api/transfer` - POST (transfer between users)
- ✅ `/api/zelle` - POST (Zelle payments)
- ✅ `/api/accounts/avatar` - PUT (update avatar)

### New (Need to Create):
- ❌ `/api/billpay` - POST (bill payments)
- ❌ `/api/wire` - POST (wire transfers)

## Execution Order

1. ✅ Add all state variables
2. ✅ Create handler functions
3. ✅ Bind inputs to state
4. ✅ Replace Continue buttons with handlers
5. ✅ Add loading states
6. ✅ Test each payment type
7. ✅ Create missing API endpoints
8. ✅ Add error handling

## Estimated Time: 2-3 hours

---

**Next Step:** Implement these changes in `/app/testdashboard/page.tsx`
