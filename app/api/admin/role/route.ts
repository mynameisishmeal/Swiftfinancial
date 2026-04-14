import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function POST(req: NextRequest) {
  try {
    const { accountId, role } = await req.json();
    
    const client = await clientPromise;
    const db = client.db('habank');
    
    await db.collection('accounts').updateOne(
      { accountId },
      { $set: { role } }
    );
    
    return NextResponse.json({ message: `Role updated to ${role}` });
  } catch (error: any) {
    return NextResponse.json({ message: 'Error: ' + error.message }, { status: 500 });
  }
}
