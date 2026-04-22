import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { isSuperadmin } from '@/lib/superadmin';
import { generateMockTransactions, MockHistoryOptions } from '@/lib/mockHistory';
import { rateLimit, validateEmail, validatePhone, validatePassword, sanitizeString } from '@/lib/rateLimit';

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';
    if (!rateLimit(ip, 5, 60000)) {
      return NextResponse.json({ message: 'Too many requests. Please try again later.' }, { status: 429 });
    }

    const { accountId, iban, name, email, password, initialAmount, avatar, mockHistory, phone } = await req.json();
    
    if (!email || !password || !name || !phone) {
      return NextResponse.json({ message: 'Name, email, password, and phone are required' }, { status: 400 });
    }

    if (!validateEmail(email)) {
      return NextResponse.json({ message: 'Invalid email format' }, { status: 400 });
    }

    if (!validatePhone(phone)) {
      return NextResponse.json({ message: 'Invalid phone format' }, { status: 400 });
    }

    if (!validatePassword(password)) {
      return NextResponse.json({ message: 'Password must be 6-128 characters' }, { status: 400 });
    }
    
    const client = await clientPromise;
    const db = client.db('habank');
    
    const existingEmail = await db.collection('accounts').findOne({ email });
    if (existingEmail) {
      return NextResponse.json({ message: 'Email already registered. Please login or use a different email.' }, { status: 400 });
    }
    
    const existing = await db.collection('accounts').findOne({ accountId });
    if (existing) {
      return NextResponse.json({ message: 'Account already exists' }, { status: 400 });
    }

    let balance = initialAmount || 0;
    let transactions: any[] = [];
    
    if (mockHistory && mockHistory.totalAmount > 0) {
      transactions = generateMockTransactions(mockHistory as MockHistoryOptions);
      balance = mockHistory.totalAmount;
    } else if (balance > 0) {
      transactions = [{
        type: 'deposit',
        amount: balance,
        date: new Date().toISOString(),
        balance: balance,
        description: 'Initial deposit'
      }];
    }

    const defaultNotifications = [
      { id: `${Date.now()}-1`, type: 'inbox', title: 'Payment Confirmation', text: 'Your payment of $250.00 has been processed', time: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), read: false, createdBy: 'system' },
      { id: `${Date.now()}-2`, type: 'inbox', title: 'Statement Available', text: 'Your December statement is ready to view', time: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), read: false, createdBy: 'system' },
      { id: `${Date.now()}-3`, type: 'inbox', title: 'Security Alert', text: 'New device login detected from Chrome', time: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), read: false, createdBy: 'system' },
      { id: `${Date.now()}-4`, type: 'inbox', title: 'Transfer Complete', text: '$1,000 transferred to savings account', time: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), read: false, createdBy: 'system' },
      { id: `${Date.now()}-5`, type: 'inbox', title: 'Direct Deposit', text: 'Payroll deposit of $3,500 received', time: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), read: false, createdBy: 'system' },
      { id: `${Date.now()}-6`, type: 'inbox', title: 'Card Activated', text: 'Your new credit card has been activated', time: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), read: false, createdBy: 'system' },
      { id: `${Date.now()}-7`, type: 'inbox', title: 'Rewards Earned', text: 'You earned 500 bonus points this month', time: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), read: false, createdBy: 'system' },
      { id: `${Date.now()}-8`, type: 'inbox', title: 'Account Update', text: 'Your contact information was updated', time: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(), read: false, createdBy: 'system' },
      { id: `${Date.now()}-9`, type: 'inbox', title: 'Welcome Message', text: 'Thank you for banking with us', time: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), read: false, createdBy: 'system' },
      { id: `${Date.now()}-10`, type: 'products', title: 'Credit Card Rewards', text: 'You have 15,000 points available', time: new Date().toISOString(), read: false, createdBy: 'system' },
      { id: `${Date.now()}-11`, type: 'products', title: 'Savings Account', text: 'Earn 2.5% APY on your balance', time: new Date().toISOString(), read: false, createdBy: 'system' },
      { id: `${Date.now()}-12`, type: 'products', title: 'Auto Loan', text: 'Pre-qualified for rates as low as 3.9%', time: new Date().toISOString(), read: false, createdBy: 'system' },
      { id: `${Date.now()}-13`, type: 'products', title: 'Home Equity Line', text: 'Access up to $100,000 in equity', time: new Date().toISOString(), read: false, createdBy: 'system' },
      { id: `${Date.now()}-14`, type: 'products', title: 'Investment Account', text: 'Start investing with as little as $100', time: new Date().toISOString(), read: false, createdBy: 'system' },
      { id: `${Date.now()}-15`, type: 'products', title: 'Business Credit Card', text: 'Earn 3% cash back on purchases', time: new Date().toISOString(), read: false, createdBy: 'system' },
      { id: `${Date.now()}-16`, type: 'products', title: 'Overdraft Protection', text: 'Link accounts for automatic coverage', time: new Date().toISOString(), read: false, createdBy: 'system' },
      { id: `${Date.now()}-17`, type: 'products', title: 'Mobile Deposit', text: 'Deposit checks from anywhere', time: new Date().toISOString(), read: false, createdBy: 'system' },
      { id: `${Date.now()}-18`, type: 'products', title: 'Bill Pay Service', text: 'Schedule and manage all your bills', time: new Date().toISOString(), read: false, createdBy: 'system' },
      { id: `${Date.now()}-19`, type: 'alerts', title: 'Large Deposit', text: '$5,000 deposited to checking account', time: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(), read: false, createdBy: 'system' },
      { id: `${Date.now()}-20`, type: 'alerts', title: 'Bill Payment Due', text: 'Credit card payment due in 3 days', time: new Date().toISOString(), read: false, createdBy: 'system' },
      { id: `${Date.now()}-21`, type: 'alerts', title: 'Account Update', text: 'Your profile information was updated', time: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), read: false, createdBy: 'system' },
      { id: `${Date.now()}-22`, type: 'alerts', title: 'Zelle Request', text: 'You have 3 pending Zelle requests', time: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), read: false, createdBy: 'system' },
    ];

    const role = isSuperadmin(email) ? 'superadmin' : undefined;
    const createdBy = null;
    const managedBy = null;
    
    await db.collection('accounts').insertOne({
      accountId,
      iban: sanitizeString(iban || ''),
      name: sanitizeString(name),
      email: email.toLowerCase().trim(),
      phone: phone.trim(),
      password,
      avatar: avatar || '',
      balance,
      savingsBalance: 0,
      creditBalance: 0,
      creditLimit: 5000,
      ficoScore: 750,
      rewardsPoints: 0,
      cardExpiry: '12/28',
      dailyLimit: 10000,
      monthlyLimit: 50000,
      interestRate: 0.01,
      transactions,
      taxCleared: false,
      role,
      createdBy,
      managedBy,
      createdAt: new Date(),
      notifications: defaultNotifications,
    });

    return NextResponse.json({ message: `Account created for ${sanitizeString(name)}` });
  } catch (error: any) {
    return NextResponse.json({ message: 'Database error: ' + error.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const { accountId, amount, type } = await req.json();
    
    const client = await clientPromise;
    const db = client.db('habank');
    
    let account = await db.collection('accounts').findOne({ accountId });
    if (!account) {
      return NextResponse.json({ message: 'Account not found. Please create account first.' }, { status: 404 });
    }

  if (type === 'deposit') {
    account.balance += amount;
  } else if (type === 'withdraw') {
    if (account.balance < amount) {
      return NextResponse.json({ message: 'Insufficient funds' }, { status: 400 });
    }
    account.balance -= amount;
  }

  const transaction = {
    type,
    amount,
    date: new Date().toISOString(),
    balance: account.balance,
    description: type === 'deposit' ? 'Manual deposit' : 'Manual withdrawal'
  };
    account.transactions.push(transaction);

    await db.collection('accounts').updateOne(
      { accountId },
      { $set: { balance: account.balance, transactions: account.transactions } }
    );

    return NextResponse.json({ 
      message: `${type === 'deposit' ? 'Deposited' : 'Withdrew'} $${amount}`,
      balance: account.balance 
    });
  } catch (error: any) {
    return NextResponse.json({ message: 'Database error: ' + error.message }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get('email');
    const name = searchParams.get('name');
    const showTransactions = searchParams.get('transactions');

    if (!email) {
      return NextResponse.json({ message: 'Email required' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db('habank');
    
    let account = await db.collection('accounts').findOne({ email });
    
    // Enforce superadmin
    if (isSuperadmin(email) && account && account.role !== 'superadmin') {
      await db.collection('accounts').updateOne(
        { email },
        { $set: { role: 'superadmin' } }
      );
      account = await db.collection('accounts').findOne({ email });
    }
    
    if (!account) {
      const generatedId = 'ACC' + Date.now();
      await db.collection('accounts').insertOne({
        accountId: generatedId,
        name: name || 'User',
        email,
        balance: 0,
        transactions: [],
        createdAt: new Date(),
      });
      account = await db.collection('accounts').findOne({ email });
    }

    if (showTransactions) {
      return NextResponse.json({ transactions: account!.transactions });
    }

    return NextResponse.json({ 
      balance: account!.balance, 
      savingsBalance: account!.savingsBalance || 0,
      creditBalance: account!.creditBalance || 0,
      accountId: account!.accountId, 
      iban: account!.iban, 
      name: account!.name, 
      avatar: account!.avatar || '', 
      taxCleared: account!.taxCleared || false,
      managedBy: account!.managedBy || null
    });
  } catch (error: any) {
    return NextResponse.json({ message: 'Database error: ' + error.message }, { status: 500 });
  }
}
