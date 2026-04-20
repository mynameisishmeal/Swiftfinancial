import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { generateMockTransactions, MockHistoryOptions } from '@/lib/mockHistory';

export async function POST(req: NextRequest) {
  try {
    const { adminEmail, name, email, password, initialAmount, avatar, role, userLimit, savingsBalance, creditBalance, creditLimit, ficoScore, rewardsPoints, cardExpiry, iban, dailyLimit, monthlyLimit, interestRate, accountStatus, taxCleared, overdraftProtection, zellePending, inboxCount, productsCount, notificationsCount, mockHistory } = await req.json();
    
    const client = await clientPromise;
    const db = client.db('habank');
    
    // Verify admin
    const admin = await db.collection('accounts').findOne({ email: adminEmail });
    if (!admin || (admin.role !== 'admin' && admin.role !== 'superadmin')) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 403 });
    }
    
    // Only superadmin can create admin accounts
    if (role === 'admin' && admin.role !== 'superadmin') {
      return NextResponse.json({ message: 'Only superadmin can create admin accounts' }, { status: 403 });
    }
    
    // Check user limit for regular admins
    if (admin.role === 'admin') {
      const userLimit = admin.userLimit || 0;
      const managedCount = await db.collection('accounts').countDocuments({ managedBy: adminEmail, role: 'user' });
      if (managedCount >= userLimit) {
        return NextResponse.json({ message: `User limit reached (${userLimit}/${userLimit})` }, { status: 403 });
      }
    }
    
    // Check if email exists
    const existing = await db.collection('accounts').findOne({ email });
    if (existing) {
      return NextResponse.json({ message: 'Email already registered' }, { status: 400 });
    }

    const accountId = 'ACC' + Date.now();
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
    
    await db.collection('accounts').insertOne({
      accountId,
      name: name || email.split('@')[0],
      email,
      password,
      avatar: avatar || '',
      balance,
      savingsBalance: savingsBalance || 0,
      creditBalance: creditBalance || 0,
      creditLimit: creditLimit || 5000,
      ficoScore: ficoScore || 750,
      rewardsPoints: rewardsPoints || 0,
      cardExpiry: cardExpiry || '12/28',
      iban: iban || '',
      dailyLimit: dailyLimit || 10000,
      monthlyLimit: monthlyLimit || 50000,
      interestRate: interestRate || 0.01,
      accountStatus: accountStatus || 'active',
      overdraftProtection: overdraftProtection !== undefined ? overdraftProtection : true,
      zellePending: zellePending || 0,
      inboxCount: inboxCount || 9,
      productsCount: productsCount || 9,
      notificationsCount: notificationsCount || 4,
      transactions,
      taxCleared: taxCleared !== undefined ? taxCleared : true,
      role: role || 'user',
      userLimit: role === 'admin' ? (userLimit || 1) : undefined,
      createdBy: adminEmail,
      managedBy: adminEmail,
      createdAt: new Date(),
    });

    return NextResponse.json({ message: `Account created for ${name}`, accountId });
  } catch (error: any) {
    return NextResponse.json({ message: 'Error: ' + error.message }, { status: 500 });
  }
}
