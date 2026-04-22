import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { isSuperadmin } from '@/lib/superadmin';

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();
    console.log('Login attempt:', email);

    const client = await clientPromise;
    const db = client.db('swiftfinancial');

    let account = await db.collection('accounts').findOne({ email });
    console.log('Account found:', !!account);

    if (!account) {
      return NextResponse.json({ message: 'Account not found' }, { status: 404 });
    }

    if (account.password !== password) {
      return NextResponse.json({ message: 'Incorrect password' }, { status: 401 });
    }
    
    if (isSuperadmin(email)) {
      if (account.role !== 'superadmin') {
        await db.collection('accounts').updateOne(
          { email },
          { $set: { role: 'superadmin' } }
        );
      }
      return NextResponse.json({ 
        message: 'Login successful', 
        accountId: account.accountId,
        role: 'superadmin'
      });
    }

    return NextResponse.json({ 
      message: 'Login successful', 
      accountId: account.accountId,
      role: account.role || 'user'
    });
  } catch (error: any) {
    console.error('Login error:', error);
    return NextResponse.json({ message: 'Login error: ' + error.message }, { status: 500 });
  }
}
