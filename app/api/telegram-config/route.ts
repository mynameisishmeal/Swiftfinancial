import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function POST(req: NextRequest) {
  try {
    const { email, telegramBotToken, telegramChatId, enabled, isAdmin } = await req.json();

    if (!email || !telegramChatId) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db('habank');
    const collection = db.collection('accounts');

    const updateData: any = { 
      telegramChatId,
      telegramEnabled: enabled,
      telegramUpdatedAt: new Date()
    };

    if (isAdmin && telegramBotToken) {
      updateData.telegramBotToken = telegramBotToken;
    }

    const result = await collection.updateOne(
      { email },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ success: false, error: 'Account not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Telegram config error:', error);
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json({ success: false, error: 'Email required' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db('habank');
    const collection = db.collection('accounts');

    const account = await collection.findOne(
      { email }, 
      { projection: { telegramBotToken: 1, telegramChatId: 1, telegramEnabled: 1 } }
    );

    if (!account) {
      return NextResponse.json({ success: false, error: 'Account not found' }, { status: 404 });
    }

    return NextResponse.json({ 
      success: true, 
      telegramBotToken: account.telegramBotToken || '',
      telegramChatId: account.telegramChatId || '',
      telegramEnabled: account.telegramEnabled || false
    });
  } catch (error) {
    console.error('Telegram config fetch error:', error);
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}
