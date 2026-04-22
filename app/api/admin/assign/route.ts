import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function POST(req: NextRequest) {
  try {
    const { accountId, adminEmail } = await req.json();
    
    const client = await clientPromise;
    const db = client.db('swiftfinancial');
    
    await db.collection('accounts').updateOne(
      { accountId },
      { $set: { managedBy: adminEmail } }
    );
    
    return NextResponse.json({ message: `User assigned to ${adminEmail}` });
  } catch (error: any) {
    return NextResponse.json({ message: 'Error: ' + error.message }, { status: 500 });
  }
}
