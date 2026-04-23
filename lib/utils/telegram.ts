export async function sendTelegramNotification(message: string, adminEmail?: string) {
  try {
    if (!adminEmail) return { success: false, error: 'No admin email' };
    
    // Get admin's Telegram config from DB
    const configRes = await fetch(`/api/telegram-config?email=${adminEmail}`);
    const config = await configRes.json();
    
    if (!config.success || !config.telegramBotToken || !config.telegramChatId || !config.telegramEnabled) {
      console.log('Telegram not configured for admin:', adminEmail);
      return { success: false, error: 'Not configured' };
    }
    
    const telegramUrl = `https://api.telegram.org/bot${config.telegramBotToken}/sendMessage`;
    
    const response = await fetch(telegramUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: config.telegramChatId,
        text: message,
        parse_mode: 'HTML'
      })
    });
    
    const data = await response.json();
    
    if (data.ok) {
      return { success: true };
    } else {
      console.error('Telegram error:', data);
      return { success: false, error: data.description };
    }
  } catch (error: any) {
    console.error('Telegram notification failed:', error);
    return { success: false, error: error.message };
  }
}

export function formatLiveChatNotification(userName: string, userEmail: string, message: string) {
  return `🔔 <b>New Live Chat Message</b>\n\n` +
         `👤 <b>User:</b> ${userName}\n` +
         `📧 <b>Email:</b> ${userEmail}\n` +
         `💬 <b>Message:</b> ${message.substring(0, 200)}${message.length > 200 ? '...' : ''}`;
}
