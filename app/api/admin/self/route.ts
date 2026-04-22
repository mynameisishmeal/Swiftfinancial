import { NextRequest, NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI!;

export async function GET(req: NextRequest) {
  const email = req.nextUrl.searchParams.get('email');
  
  if (!email) {
    return NextResponse.json({ message: 'Missing email' }, { status: 400 });
  }

  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    const db = client.db('swiftfinancial');
    const account = await db.collection('accounts').findOne({ email });
    
    if (account) {
      return NextResponse.json({ 
        userLimit: account.userLimit || 0,
        role: account.role 
      });
    }
    
    return NextResponse.json({ message: 'Account not found' }, { status: 404 });
  } catch (error) {
    return NextResponse.json({ message: 'Failed to fetch account' }, { status: 500 });
  } finally {
    await client.close();
  }
}
