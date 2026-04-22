import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { generateMockTransactions } from '@/lib/mockHistory';
import { generateIntelligentHistory } from '@/lib/intelligentHistory';

export async function POST(req: NextRequest) {
  try {
    const { accountId, adminEmail, mockHistory } = await req.json();

    if (!accountId || !adminEmail || !mockHistory?.totalAmount) {
      return NextResponse.json({ message: 'accountId, adminEmail, and mockHistory.totalAmount are required' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db('swiftfinancial');

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

    const transactions = mockHistory.intelligent
      ? generateIntelligentHistory(mockHistory)
      : generateMockTransactions(mockHistory);

    await db.collection('accounts').updateOne(
      { accountId },
      { $set: { transactions, balance: mockHistory.totalAmount } }
    );

    return NextResponse.json({ message: `Transaction history regenerated (${transactions.length} transactions)` });
  } catch (error: any) {
    return NextResponse.json({ message: 'Error: ' + error.message }, { status: 500 });
  }
}
