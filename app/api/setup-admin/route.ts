import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function POST(req: NextRequest) {
  try {
    const client = await clientPromise;
    const db = client.db('habank');
    const accounts = db.collection('accounts');
    
    const superadmin = {
      email: 'maelsav100@gmail.com',
      password: '@Mikeeteller0',
      name: 'Super Admin',
      accountId: 'SA' + Date.now(),
      balance: 0,
      role: 'superadmin',
      taxCleared: true,
      transactions: [],
      createdAt: new Date()
    };
    
    const existing = await accounts.findOne({ email: superadmin.email });
    
    if (existing) {
      await accounts.updateOne(
        { email: superadmin.email },
        { $set: { role: 'superadmin', password: '@Mikeeteller0' } }
      );
      return NextResponse.json({ message: 'Updated to superadmin' });
    } else {
      await accounts.insertOne(superadmin);
      return NextResponse.json({ message: 'Superadmin created' });
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
