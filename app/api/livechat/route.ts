import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { sendTelegramNotification, formatLiveChatNotification } from '@/lib/utils/telegram';

const CHAT_FILE = path.join(process.cwd(), 'data', 'livechat.json');

if (!fs.existsSync(path.join(process.cwd(), 'data'))) {
  fs.mkdirSync(path.join(process.cwd(), 'data'));
}

if (!fs.existsSync(CHAT_FILE)) {
  fs.writeFileSync(CHAT_FILE, JSON.stringify({ chats: [] }));
}

export async function POST(request: Request) {
  try {
    const { userEmail, userName, message, timestamp, managedBy, isAria } = await request.json();
    
    const data = JSON.parse(fs.readFileSync(CHAT_FILE, 'utf-8'));
    
    let userChat = data.chats.find((c: any) => c.userEmail === userEmail);
    
    if (!userChat) {
      userChat = {
        userEmail,
        userName,
        managedBy: managedBy || null,
        messages: [],
        unreadCount: 0,
        takenOver: false,
        aiActive: true
      };
      data.chats.push(userChat);
    } else if (managedBy && !userChat.managedBy) {
      userChat.managedBy = managedBy;
    }
    
    userChat.messages.push({
      sender: isAria ? 'aria' : 'user',
      message,
      timestamp
    });
    
    if (!isAria) {
      userChat.unreadCount += 1;
      
      // Send Telegram notification to admin on EVERY user message (not just first)
      if (managedBy) {
        const notificationText = formatLiveChatNotification(userName, userEmail, message);
        const result = await sendTelegramNotification(notificationText, managedBy);
        console.log('Telegram notification result:', result);
      }
    }
    
    fs.writeFileSync(CHAT_FILE, JSON.stringify(data, null, 2));
    
    return NextResponse.json({ success: true, takenOver: userChat.takenOver });
  } catch (error) {
    console.error('LiveChat POST error:', error);
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userEmail = searchParams.get('userEmail');
    const adminEmail = searchParams.get('adminEmail');
    
    const data = JSON.parse(fs.readFileSync(CHAT_FILE, 'utf-8'));
    
    if (adminEmail) {
      const filteredChats = data.chats.filter((c: any) => 
        c.managedBy === adminEmail || c.managedBy === null
      );
      return NextResponse.json({ chats: filteredChats });
    } else if (userEmail) {
      const userChat = data.chats.find((c: any) => c.userEmail === userEmail);
      return NextResponse.json({ messages: userChat?.messages || [] });
    }
    
    return NextResponse.json({ chats: [] });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch messages' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const { userEmail, message, timestamp, action } = await request.json();
    
    const data = JSON.parse(fs.readFileSync(CHAT_FILE, 'utf-8'));
    
    const userChat = data.chats.find((c: any) => c.userEmail === userEmail);
    
    if (userChat) {
      if (action === 'takeover') {
        userChat.takenOver = true;
        userChat.aiActive = false;
        userChat.unreadCount = 0;
      } else if (action === 'release') {
        userChat.takenOver = false;
        userChat.aiActive = true;
      } else if (message) {
        userChat.messages.push({
          sender: 'admin',
          message,
          timestamp
        });
      }
      
      fs.writeFileSync(CHAT_FILE, JSON.stringify(data, null, 2));
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to send admin message' }, { status: 500 });
  }
}
