import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function POST(req: NextRequest) {
  try {
    const { email, role, secretKey } = await req.json();
    
    // Verify secret key
    if (secretKey !== process.env.UPGRADE_SECRET_KEY) {
      return NextResponse.json({ message: 'Invalid secret key' }, { status: 403 });
    }
    
    const client = await clientPromise;
    const db = client.db('habank');
    
    const account = await db.collection('accounts').findOne({ email });
    
    if (!account) {
      return NextResponse.json({ message: 'Account not found' }, { status: 404 });
    }
    
    await db.collection('accounts').updateOne(
      { email },
      { $set: { role } }
    );
    
    return NextResponse.json({ message: `Role updated successfully to ${role}` });
  } catch (error: any) {
    return NextResponse.json({ message: 'Error: ' + error.message }, { status: 500 });
  }
}
