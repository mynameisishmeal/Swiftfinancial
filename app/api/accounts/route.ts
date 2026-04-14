import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { isSuperadmin } from '@/lib/superadmin';
import { generateMockTransactions, MockHistoryOptions } from '@/lib/mockHistory';

export async function POST(req: NextRequest) {
  try {
    const { accountId, iban, name, email, password, initialAmount, avatar, mockHistory } = await req.json();
    
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
      // Generate mock transactions
      transactions = generateMockTransactions(mockHistory as MockHistoryOptions);
      balance = mockHistory.totalAmount;
    } else if (balance > 0) {
      // Regular initial deposit
      transactions = [{
        type: 'deposit',
        amount: balance,
        date: new Date().toISOString(),
        balance: balance,
        description: 'Initial deposit'
      }];
    }

    // Enforce superadmin
    const role = isSuperadmin(email) ? 'superadmin' : undefined;
    const createdBy = null; // Self-registered
    const managedBy = null; // Not assigned to any admin yet
    
    await db.collection('accounts').insertOne({
      accountId,
      iban,
      name,
      email,
      password,
      avatar: avatar || '',
      balance,
      transactions,
      taxCleared: false,
      role,
      createdBy,
      managedBy,
      createdAt: new Date(),
    });

    return NextResponse.json({ message: `Account created for ${name}` });
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

    return NextResponse.json({ balance: account!.balance, accountId: account!.accountId, iban: account!.iban, name: account!.name, avatar: account!.avatar || '', taxCleared: account!.taxCleared || false });
  } catch (error: any) {
    return NextResponse.json({ message: 'Database error: ' + error.message }, { status: 500 });
  }
}
