import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function POST(req: NextRequest) {
  try {
    const { identifier, adminEmail } = await req.json();
    
    const client = await clientPromise;
    const db = client.db('swiftfinancial');
    
    // Find user by account number or email
    const user = await db.collection('accounts').findOne({
      $or: [
        { accountId: identifier },
        { email: identifier }
      ]
    });
    
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }
    
    if (user.role === 'admin' || user.role === 'superadmin') {
      return NextResponse.json({ message: 'Cannot claim admin or superadmin accounts' }, { status: 400 });
    }
    
    await db.collection('accounts').updateOne(
      { _id: user._id },
      { $set: { managedBy: adminEmail } }
    );
    
    return NextResponse.json({ message: `User ${user.name} assigned to you successfully` });
  } catch (error: any) {
    return NextResponse.json({ message: 'Error: ' + error.message }, { status: 500 });
  }
}
