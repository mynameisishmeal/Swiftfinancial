import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { generateMockTransactions, MockHistoryOptions } from '@/lib/mockHistory';
import { generateIntelligentHistory, IntelligentHistoryOptions } from '@/lib/intelligentHistory';
import { validateEmail, validatePhone, validatePassword, sanitizeString } from '@/lib/rateLimit';

export async function POST(req: NextRequest) {
  try {
    const { adminEmail, name, email, phone, password, transactionPin, initialAmount, avatar, role, userLimit, savingsBalance, creditBalance, creditLimit, ficoScore, rewardsPoints, cardExpiry, iban, dailyLimit, monthlyLimit, interestRate, accountStatus, taxCleared, overdraftProtection, zellePending, inboxCount, productsCount, notificationsCount, mockHistory } = await req.json();
    
    if (!email || !password || !name || !phone || !transactionPin) {
      return NextResponse.json({ message: 'Name, email, password, phone, and transaction PIN are required' }, { status: 400 });
    }

    if (transactionPin.length !== 4 || !/^\d{4}$/.test(transactionPin)) {
      return NextResponse.json({ message: 'Transaction PIN must be exactly 4 digits' }, { status: 400 });
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
    const db = client.db('swiftfinancial');
    
    const admin = await db.collection('accounts').findOne({ email: adminEmail });
    if (!admin || (admin.role !== 'admin' && admin.role !== 'superadmin')) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 403 });
    }
    
    if (role === 'admin' && admin.role !== 'superadmin') {
      return NextResponse.json({ message: 'Only superadmin can create admin accounts' }, { status: 403 });
    }
    
    if (admin.role === 'admin' && (role || 'user') === 'user') {
      const userLimit = admin.userLimit || 0;
      const managedCount = await db.collection('accounts').countDocuments({ managedBy: adminEmail, role: 'user' });
      if (managedCount >= userLimit) {
        return NextResponse.json({ message: `User limit reached (${managedCount}/${userLimit})` }, { status: 403 });
      }
    }
    
    const existing = await db.collection('accounts').findOne({ email });
    if (existing) {
      return NextResponse.json({ message: 'Email already registered' }, { status: 400 });
    }

    const accountId = 'ACC' + Date.now();
    let balance = initialAmount || 0;
    let transactions: any[] = [];
    
    if (mockHistory && mockHistory.totalAmount > 0) {
      if (mockHistory.intelligent) {
        transactions = generateIntelligentHistory(mockHistory as IntelligentHistoryOptions);
      } else {
        transactions = generateMockTransactions(mockHistory as MockHistoryOptions);
      }
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
    
    const defaultNotifications = role === 'user' ? [
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
    ] : [];
    
    await db.collection('accounts').insertOne({
      accountId,
      name: sanitizeString(name || email.split('@')[0]),
      email: email.toLowerCase().trim(),
      phone: phone.trim(),
      password,
      transactionPin,
      avatar: avatar || '',
      balance,
      savingsBalance: savingsBalance || 0,
      creditBalance: creditBalance || 0,
      creditLimit: creditLimit || 5000,
      ficoScore: ficoScore || 750,
      rewardsPoints: rewardsPoints || 0,
      cardExpiry: cardExpiry || '12/28',
      iban: sanitizeString(iban || ''),
      dailyLimit: dailyLimit || 10000,
      monthlyLimit: monthlyLimit || 50000,
      interestRate: interestRate || 0.01,
      accountStatus: accountStatus || 'active',
      overdraftProtection: overdraftProtection !== undefined ? overdraftProtection : true,
      zellePending: zellePending || 0,
      transactions,
      taxCleared: taxCleared !== undefined ? taxCleared : true,
      role: role || 'user',
      userLimit: role === 'admin' ? (userLimit || 1) : undefined,
      createdBy: adminEmail,
      managedBy: (role || 'user') === 'user' ? adminEmail : null,
      createdAt: new Date(),
      notifications: defaultNotifications,
    });

    return NextResponse.json({ message: `Account created for ${sanitizeString(name)}`, accountId });
  } catch (error: any) {
    return NextResponse.json({ message: 'Error: ' + error.message }, { status: 500 });
  }
}
