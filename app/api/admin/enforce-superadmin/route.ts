import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { isSuperadmin } from '@/lib/superadmin';

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();
    
    if (!isSuperadmin(email)) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 403 });
    }
    
    const client = await clientPromise;
    const db = client.db('habank');
    
    await db.collection('accounts').updateOne(
      { email },
      { $set: { role: 'superadmin' } },
      { upsert: false }
    );
    
    return NextResponse.json({ message: 'Superadmin enforced' });
  } catch (error: any) {
    return NextResponse.json({ message: 'Error: ' + error.message }, { status: 500 });
  }
}
