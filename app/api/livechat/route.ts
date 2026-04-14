import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const CHAT_FILE = path.join(process.cwd(), 'data', 'livechat.json');

if (!fs.existsSync(path.join(process.cwd(), 'data'))) {
  fs.mkdirSync(path.join(process.cwd(), 'data'));
}

if (!fs.existsSync(CHAT_FILE)) {
  fs.writeFileSync(CHAT_FILE, JSON.stringify({ chats: [] }));
}

export async function POST(request: Request) {
  try {
    const { userEmail, userName, message, timestamp, managedBy } = await request.json();
    
    const data = JSON.parse(fs.readFileSync(CHAT_FILE, 'utf-8'));
    
    let userChat = data.chats.find((c: any) => c.userEmail === userEmail);
    
    if (!userChat) {
      userChat = {
        userEmail,
        userName,
        managedBy: managedBy || null,
        messages: [],
        unreadCount: 0
      };
      data.chats.push(userChat);
    } else if (managedBy && !userChat.managedBy) {
      userChat.managedBy = managedBy;
    }
    
    userChat.messages.push({
      sender: 'user',
      message,
      timestamp
    });
    userChat.unreadCount += 1;
    
    fs.writeFileSync(CHAT_FILE, JSON.stringify(data, null, 2));
    
    return NextResponse.json({ success: true });
  } catch (error) {
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
    const { userEmail, message, timestamp } = await request.json();
    
    const data = JSON.parse(fs.readFileSync(CHAT_FILE, 'utf-8'));
    
    const userChat = data.chats.find((c: any) => c.userEmail === userEmail);
    
    if (userChat) {
      userChat.messages.push({
        sender: 'admin',
        message,
        timestamp
      });
      
      fs.writeFileSync(CHAT_FILE, JSON.stringify(data, null, 2));
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to send admin message' }, { status: 500 });
  }
}
