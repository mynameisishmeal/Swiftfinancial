import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function POST(req: NextRequest) {
  try {
    const { accountId, adminEmail, action, transactionIndex, updates } = await req.json();
    
    const client = await clientPromise;
    const db = client.db('habank');
    
    const admin = await db.collection('accounts').findOne({ email: adminEmail });
    if (!admin || (admin.role !== 'admin' && admin.role !== 'superadmin')) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 403 });
    }

    const user = await db.collection('accounts').findOne({ accountId });
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    if (admin.role === 'admin' && user.managedBy !== adminEmail) {
      return NextResponse.json({ message: 'You can only modify users you manage' }, { status: 403 });
    }

    const transactions = user.transactions || [];

    if (action === 'delete') {
      transactions.splice(transactionIndex, 1);
    } else if (action === 'edit') {
      if (updates.type) transactions[transactionIndex].type = updates.type;
      if (updates.amount !== undefined) transactions[transactionIndex].amount = parseFloat(updates.amount);
      if (updates.description) transactions[transactionIndex].description = updates.description;
      if (updates.category) transactions[transactionIndex].category = updates.category;
      if (updates.date) transactions[transactionIndex].date = updates.date;
    }

    await db.collection('accounts').updateOne(
      { accountId },
      { $set: { transactions } }
    );

    return NextResponse.json({ message: 'Transaction updated successfully' });
  } catch (error: any) {
    return NextResponse.json({ message: 'Error: ' + error.message }, { status: 500 });
  }
}
