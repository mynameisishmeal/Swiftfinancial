import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const CHAT_FILE = path.join(process.cwd(), 'data', 'superadmin-chat.json');

if (!fs.existsSync(path.join(process.cwd(), 'data'))) {
  fs.mkdirSync(path.join(process.cwd(), 'data'));
}

if (!fs.existsSync(CHAT_FILE)) {
  fs.writeFileSync(CHAT_FILE, JSON.stringify({ messages: [] }));
}

export async function POST(request: Request) {
  try {
    const { message, sender, timestamp } = await request.json();
    
    const data = JSON.parse(fs.readFileSync(CHAT_FILE, 'utf-8'));
    
    data.messages.push({
      sender,
      message,
      timestamp
    });
    
    fs.writeFileSync(CHAT_FILE, JSON.stringify(data, null, 2));
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const data = JSON.parse(fs.readFileSync(CHAT_FILE, 'utf-8'));
    return NextResponse.json({ messages: data.messages });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch messages' }, { status: 500 });
  }
}
