import { NextRequest, NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI!;

export async function POST(req: NextRequest) {
  const { accountId, userLimit } = await req.json();
  
  if (!accountId || userLimit === undefined) {
    return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
  }

  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    const db = client.db('swiftfinancial');
    
    await db.collection('accounts').updateOne(
      { accountId },
      { $set: { userLimit: parseInt(userLimit) } }
    );
    
    return NextResponse.json({ message: `User limit set to ${userLimit}` });
  } catch (error) {
    return NextResponse.json({ message: 'Failed to set user limit' }, { status: 500 });
  } finally {
    await client.close();
  }
}
