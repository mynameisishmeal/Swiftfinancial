import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function POST(req: NextRequest) {
  try {
    const { email, password, name } = await req.json();

    const client = await clientPromise;
    const db = client.db('habank');

    const existing = await db.collection('accounts').findOne({ email });
    if (existing) {
      return NextResponse.json({ message: 'Account already exists' }, { status: 400 });
    }

    const accountId = 'ACC' + Date.now();
    const iban = 'GB4.' + Math.random().toString().substr(2, 20) + 'e+22';

    await db.collection('accounts').insertOne({
      email,
      password,
      name,
      accountId,
      iban,
      balance: 1000000,
      role: null,
      taxCleared: false,
      avatar: '',
      transactions: [],
      createdAt: new Date(),
    });

    return NextResponse.json({ message: 'Account created successfully', accountId });
  } catch (error: any) {
    return NextResponse.json({ message: 'Registration error: ' + error.message }, { status: 500 });
  }
}
