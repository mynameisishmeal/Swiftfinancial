import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function POST(req: NextRequest) {
  try {
    const { email, password, name, initialAmount, avatar } = await req.json();

    if (!email || !password || !name) {
      return NextResponse.json({ message: 'Name, email and password are required' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db('swiftfinancial');

    const existing = await db.collection('accounts').findOne({ email: email.toLowerCase().trim() });
    if (existing) {
      return NextResponse.json({ message: 'Account already exists' }, { status: 400 });
    }

    const accountId = 'ACC' + Date.now();
    const ibanNum = Math.floor(10 + Math.random() * 89).toString() + Date.now().toString().slice(-14);
    const iban = 'US' + ibanNum;
    const balance = initialAmount ? parseFloat(initialAmount) : 0;

    await db.collection('accounts').insertOne({
      accountId,
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password,
      avatar: avatar || '',
      balance,
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
      transactions: balance > 0 ? [{ type: 'deposit', amount: balance, date: new Date().toISOString(), balance, description: 'Initial deposit' }] : [],
      taxCleared: true,
      role: 'user',
      createdAt: new Date(),
      notifications: [],
    });

    return NextResponse.json({ message: 'Account created successfully', accountId });
  } catch (error: any) {
    return NextResponse.json({ message: 'Registration error: ' + error.message }, { status: 500 });
  }
}
