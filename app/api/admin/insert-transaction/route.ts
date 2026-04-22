import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function POST(req: NextRequest) {
  try {
    const { accountId, adminEmail, type, amount, description, category } = await req.json();
    
    const client = await clientPromise;
    const db = client.db('swiftfinancial');
    
    const admin = await db.collection('accounts').findOne({ email: adminEmail });
    const user = await db.collection('accounts').findOne({ accountId });
    
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }
    
    if (admin?.role !== 'superadmin' && user.managedBy !== adminEmail) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 403 });
    }
    
    const transaction = {
      type,
      amount: parseFloat(amount),
      description,
      category: category || 'Other',
      date: new Date(),
      balance: user.balance + (type === 'deposit' ? parseFloat(amount) : -parseFloat(amount))
    };
    
    await db.collection('accounts').updateOne(
      { accountId },
      { 
        $push: { transactions: transaction } as any,
        $set: { balance: transaction.balance }
      }
    );
    
    return NextResponse.json({ message: 'Transaction inserted successfully' });
  } catch (error: any) {
    return NextResponse.json({ message: 'Error: ' + error.message }, { status: 500 });
  }
}
