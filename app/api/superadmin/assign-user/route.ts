import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function POST(req: NextRequest) {
  try {
    const { userId, adminEmail, superadminEmail } = await req.json();
    
    const client = await clientPromise;
    const db = client.db('habank');
    
    const superadmin = await db.collection('accounts').findOne({ email: superadminEmail });
    if (superadmin?.role !== 'superadmin') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 403 });
    }
    
    await db.collection('accounts').updateOne(
      { accountId: userId },
      { $set: { managedBy: adminEmail } }
    );
    
    return NextResponse.json({ message: 'User assigned successfully' });
  } catch (error: any) {
    return NextResponse.json({ message: 'Error: ' + error.message }, { status: 500 });
  }
}
