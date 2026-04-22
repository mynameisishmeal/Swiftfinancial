import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function POST(req: NextRequest) {
  const { to, subject, amount, type, fromAccount, toAccount, timestamp } = await req.json();

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(to right, #dc2626, #000); padding: 20px; text-align: center;">
        <h1 style="color: white; margin: 0;">swiftfinancial</h1>
      </div>
      <div style="padding: 30px; background: #f9f9f9;">
        <h2 style="color: #dc2626;">Transaction Receipt</h2>
        <p><strong>Type:</strong> ${type}</p>
        <p><strong>Amount:</strong> $${amount}</p>
        ${type === 'Transfer' ? `<p><strong>From:</strong> ${fromAccount}</p><p><strong>To:</strong> ${toAccount}</p>` : ''}
        <p><strong>Date:</strong> ${new Date(timestamp).toLocaleString()}</p>
        <hr style="border: 1px solid #ddd; margin: 20px 0;">
        <p style="color: #666; font-size: 12px;">Thank you for banking with swiftfinancial</p>
      </div>
    </div>
  `;

  try {
    const client = await clientPromise;
    const db = client.db('swiftfinancial');

    await db.collection('mail').insertOne({
      to,
      subject,
      html,
      sent: false,
      createdAt: new Date(),
    });

    return NextResponse.json({ message: 'Email queued successfully' });
  } catch (error: any) {
    return NextResponse.json({ message: 'Failed to queue email', error: error.message }, { status: 500 });
  }
}
