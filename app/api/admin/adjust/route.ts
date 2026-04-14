import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function POST(req: NextRequest) {
  try {
    const { accountId, amount, type } = await req.json();
    
    const client = await clientPromise;
    const db = client.db('habank');
    
    const account = await db.collection('accounts').findOne({ accountId });
    if (!account) {
      return NextResponse.json({ message: 'Account not found' }, { status: 404 });
    }

    if (type === 'add') {
      account.balance += amount;
    } else {
      account.balance -= amount;
    }

    const transaction = {
      type: type === 'add' ? 'admin_credit' : 'admin_debit',
      amount,
      date: new Date().toISOString(),
      balance: account.balance,
    };
    account.transactions.push(transaction);

    await db.collection('accounts').updateOne(
      { accountId },
      { $set: { balance: account.balance, transactions: account.transactions } }
    );

    return NextResponse.json({ 
      message: `${type === 'add' ? 'Added' : 'Deducted'} $${amount}`,
      balance: account.balance 
    });
  } catch (error: any) {
    return NextResponse.json({ message: 'Error: ' + error.message }, { status: 500 });
  }
}
