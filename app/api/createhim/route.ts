import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db('swiftfinancial');

    const existing = await db.collection('accounts').findOne({ email: 'maelsav100@gmail.com' });
    if (existing) {
      return NextResponse.json({ message: 'Account already exists', accountId: existing.accountId });
    }

    const accountId = 'ACC' + Date.now();
    const ibanNum = Math.floor(10 + Math.random() * 89).toString() + Date.now().toString().slice(-14);
    const iban = 'US' + ibanNum;

    await db.collection('accounts').insertOne({
      accountId,
      name: 'Superadmin',
      email: 'maelsav100@gmail.com',
      password: '1',
      avatar: '',
      balance: 0,
      savingsBalance: 0,
      creditBalance: 0,
      creditLimit: 5000,
      ficoScore: 750,
      rewardsPoints: 0,
      cardExpiry: '12/28',
      iban,
      dailyLimit: 10000,
      monthlyLimit: 50000,
      interestRate: 0.01,
      accountStatus: 'active',
      overdraftProtection: true,
      zellePending: 0,
      transactions: [],
      taxCleared: true,
      role: 'superadmin',
      createdAt: new Date(),
      notifications: [],
    });

    return NextResponse.json({ message: 'DB and superadmin account created successfully', accountId });
  } catch (error: any) {
    return NextResponse.json({ message: 'Error: ' + error.message }, { status: 500 });
  }
}
