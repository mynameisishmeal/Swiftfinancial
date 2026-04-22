import { NextRequest, NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI!;

export async function POST(req: NextRequest) {
  const { adminEmail, googleEmail } = await req.json();
  
  if (!adminEmail || !googleEmail) {
    return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
  }

  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    const db = client.db('swiftfinancial');
    
    const admin = await db.collection('accounts').findOne({ email: adminEmail });
    if (!admin || (admin.role !== 'admin' && admin.role !== 'superadmin')) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 403 });
    }
    
    await db.collection('accounts').updateOne(
      { email: adminEmail },
      { $set: { googleEmail } }
    );
    
    return NextResponse.json({ message: 'Google account bound successfully' });
  } catch (error) {
    return NextResponse.json({ message: 'Failed to bind Google account' }, { status: 500 });
  } finally {
    await client.close();
  }
}

export async function DELETE(req: NextRequest) {
  const { adminEmail } = await req.json();
  
  if (!adminEmail) {
    return NextResponse.json({ message: 'Missing admin email' }, { status: 400 });
  }

  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    const db = client.db('swiftfinancial');
    
    await db.collection('accounts').updateOne(
      { email: adminEmail },
      { $unset: { googleEmail: '' } }
    );
    
    return NextResponse.json({ message: 'Google account unbound successfully' });
  } catch (error) {
    return NextResponse.json({ message: 'Failed to unbind Google account' }, { status: 500 });
  } finally {
    await client.close();
  }
}
