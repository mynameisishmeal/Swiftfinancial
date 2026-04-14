import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function POST(req: NextRequest) {
  try {
    const { fromEmail, toIdentifier, amount, message } = await req.json();

    const client = await clientPromise;
    const db = client.db('habank');

    // Find sender account
    const fromAccount = await db.collection('accounts').findOne({ email: fromEmail });
    if (!fromAccount) {
      return NextResponse.json({ message: 'Sender account not found' }, { status: 404 });
    }

    // Check tax clearance
    if (!fromAccount.taxCleared) {
      return NextResponse.json({ message: 'Transfer blocked: Tax clearance required' }, { status: 403 });
    }

    // Check sufficient balance
    if (fromAccount.balance < amount) {
      return NextResponse.json({ message: 'Insufficient funds' }, { status: 400 });
    }

    // Find recipient by email or phone (simplified - just email for now)
    const toAccount = await db.collection('accounts').findOne({ 
      $or: [
        { email: toIdentifier },
        { phone: toIdentifier }
      ]
    });

    if (!toAccount) {
      return NextResponse.json({ message: 'Recipient not found' }, { status: 404 });
    }

    const newFromBalance = fromAccount.balance - amount;
    const newToBalance = toAccount.balance + amount;

    // Update sender balance
    await db.collection('accounts').updateOne(
      { email: fromEmail },
      { 
        $set: { balance: newFromBalance },
        $push: {
          transactions: {
            type: 'zelle_out',
            amount: amount,
            balance: newFromBalance,
            date: new Date(),
            description: `Zelle to ${toAccount.name}`,
            recipient: toAccount.email
          } as any
        }
      }
    );

    // Update recipient balance
    await db.collection('accounts').updateOne(
      { email: toAccount.email },
      { 
        $set: { balance: newToBalance },
        $push: {
          transactions: {
            type: 'zelle_in',
            amount: amount,
            balance: newToBalance,
            date: new Date(),
            description: `Zelle from ${fromAccount.name}`,
            sender: fromAccount.email
          } as any
        }
      }
    );

    return NextResponse.json({ 
      message: `$${amount.toFixed(2)} sent to ${toAccount.name} via Zelle®`,
      newBalance: newFromBalance
    });

  } catch (error: any) {
    return NextResponse.json({ message: 'Transfer error: ' + error.message }, { status: 500 });
  }
}