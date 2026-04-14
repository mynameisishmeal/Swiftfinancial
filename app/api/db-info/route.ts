import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function GET(req: NextRequest) {
  try {
    const client = await clientPromise;
    const db = client.db('habank');
    
    const collections = await db.listCollections().toArray();
    const accounts = await db.collection('accounts').find({}).toArray();
    
    return NextResponse.json({
      database: 'habank',
      collections: collections.map(c => c.name),
      accountCount: accounts.length,
      accounts: accounts.map(a => ({
        email: a.email,
        name: a.name,
        role: a.role,
        accountId: a.accountId
      }))
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
