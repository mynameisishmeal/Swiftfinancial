import { NextRequest, NextResponse } from 'next/server';
import { sendTelegramNotification } from '@/lib/utils/telegram';

export async function POST(req: NextRequest) {
  try {
    const { adminEmail } = await req.json();

    if (!adminEmail) {
      return NextResponse.json({ success: false, error: 'Admin email required' }, { status: 400 });
    }

    const testMessage = `🧪 <b>Telegram Test Message</b>\n\n` +
                       `✅ Your Telegram integration is working correctly!\n` +
                       `📅 ${new Date().toLocaleString()}\n\n` +
                       `You will receive notifications here when users send messages in LiveChat.`;

    const result = await sendTelegramNotification(testMessage, adminEmail);

    if (result.success) {
      return NextResponse.json({ success: true, message: 'Test message sent successfully!' });
    } else {
      return NextResponse.json({ success: false, error: result.error || 'Failed to send test message' }, { status: 500 });
    }
  } catch (error: any) {
    console.error('Telegram test error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
