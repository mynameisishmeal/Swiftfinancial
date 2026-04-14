import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function POST(req: NextRequest) {
  const { fromEmail, toEmail, amount } = await req.json();

  try {
    const client = await clientPromise;
    const db = client.db('habank');

    const fromAccount = await db.collection('accounts').findOne({ email: fromEmail });
    const toAccount = await db.collection('accounts').findOne({ email: toEmail });

    if (!fromAccount) {
      return NextResponse.json({ message: 'Sender account not found' }, { status: 404 });
    }
    if (!toAccount) {
      return NextResponse.json({ message: 'Recipient account not found' }, { status: 404 });
    }

    if (fromAccount.balance < amount) {
      return NextResponse.json({ message: 'Insufficient funds' }, { status: 400 });
    }

    const timestamp = new Date().toISOString();

    fromAccount.balance -= amount;
    fromAccount.transactions.push({
      type: 'transfer_out',
      amount,
      to: toEmail,
      date: timestamp,
      balance: fromAccount.balance,
    });

    toAccount.balance += amount;
    toAccount.transactions.push({
      type: 'transfer_in',
      amount,
      from: fromEmail,
      date: timestamp,
      balance: toAccount.balance,
    });

    await db.collection('accounts').updateOne(
      { email: fromEmail },
      { $set: { balance: fromAccount.balance, transactions: fromAccount.transactions } }
    );

    await db.collection('accounts').updateOne(
      { email: toEmail },
      { $set: { balance: toAccount.balance, transactions: toAccount.transactions } }
    );

    // Send email notifications
    try {
      await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/send-email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: fromEmail,
          subject: 'Transfer Confirmation',
          message: `<h2>Transfer Successful</h2><p>You sent $${amount} to ${toEmail}</p><p>New balance: $${fromAccount.balance.toFixed(2)}</p>`,
          type: 'transfer'
        })
      });
      
      await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/send-email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: toEmail,
          subject: 'Money Received',
          message: `<h2>Transfer Received</h2><p>You received $${amount} from ${fromEmail}</p><p>New balance: $${toAccount.balance.toFixed(2)}</p>`,
          type: 'transfer'
        })
      });
    } catch (emailError) {
      console.error('Email notification failed:', emailError);
    }

    return NextResponse.json({
      message: `Transferred $${amount} successfully`,
      fromEmail: fromAccount.email,
      toEmail: toAccount.email,
      timestamp,
    });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 400 });
  }
}
