import { NextRequest, NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI!;

export async function GET(req: NextRequest) {
  const email = req.nextUrl.searchParams.get('email');
  
  if (!email) {
    return NextResponse.json({ googleEmail: null }, { status: 400 });
  }

  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    const db = client.db('swiftfinancial');
    const account = await db.collection('accounts').findOne({ email });
    
    if (account && account.googleEmail) {
      return NextResponse.json({ googleEmail: account.googleEmail });
    }
    
    return NextResponse.json({ googleEmail: null });
  } catch (error) {
    return NextResponse.json({ googleEmail: null }, { status: 500 });
  } finally {
    await client.close();
  }
}
