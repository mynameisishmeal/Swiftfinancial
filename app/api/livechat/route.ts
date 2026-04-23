import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { sendTelegramNotification, formatLiveChatNotification } from '@/lib/utils/telegram';

export async function POST(request: Request) {
  try {
    const { userEmail, userName, message, timestamp, managedBy, isAria } = await request.json();
    
    const client = await clientPromise;
    const db = client.db('swiftfinancial');
    const collection = db.collection('livechats');
    
    let userChat = await collection.findOne({ userEmail });
    
    if (!userChat) {
      const newChat = {
        userEmail,
        userName,
        managedBy: managedBy || null,
        messages: [],
        unreadCount: 0,
        takenOver: false,
        aiActive: true
      };
      await collection.insertOne(newChat);
      userChat = await collection.findOne({ userEmail });
    } else if (managedBy && !userChat.managedBy) {
      await collection.updateOne(
        { userEmail },
        { $set: { managedBy } }
      );
    }
    
    const newMessage = {
      sender: isAria ? 'aria' : 'user',
      message,
      timestamp
    };
    
    await collection.updateOne(
      { userEmail },
      { 
        $push: { messages: newMessage } as any,
        $inc: isAria ? {} : { unreadCount: 1 }
      }
    );
    
    if (!isAria && managedBy) {
      const notificationText = formatLiveChatNotification(userName, userEmail, message);
      const result = await sendTelegramNotification(notificationText, managedBy);
      console.log('Telegram notification result:', result);
    }
    
    const updatedChat = await collection.findOne({ userEmail });
    
    return NextResponse.json({ success: true, takenOver: updatedChat?.takenOver || false });
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
    
    const client = await clientPromise;
    const db = client.db('swiftfinancial');
    const collection = db.collection('livechats');
    
    if (adminEmail) {
      const chats = await collection.find({
        $or: [
          { managedBy: adminEmail },
          { managedBy: null }
        ]
      }).toArray();
      return NextResponse.json({ chats });
    } else if (userEmail) {
      const userChat = await collection.findOne({ userEmail });
      return NextResponse.json({ messages: userChat?.messages || [], takenOver: userChat?.takenOver || false });
    }
    
    return NextResponse.json({ chats: [] });
  } catch (error) {
    console.error('LiveChat GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch messages' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const { userEmail, message, timestamp, action } = await request.json();
    
    const client = await clientPromise;
    const db = client.db('swiftfinancial');
    const collection = db.collection('livechats');
    
    if (action === 'takeover') {
      await collection.updateOne(
        { userEmail },
        { 
          $set: { 
            takenOver: true, 
            aiActive: false,
            unreadCount: 0
          }
        }
      );
    } else if (action === 'release') {
      await collection.updateOne(
        { userEmail },
        { 
          $set: { 
            takenOver: false, 
            aiActive: true
          }
        }
      );
    } else if (message) {
      await collection.updateOne(
        { userEmail },
        { 
          $push: { 
            messages: {
              sender: 'admin',
              message,
              timestamp
            }
          } as any
        }
      );
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('LiveChat PUT error:', error);
    return NextResponse.json({ error: 'Failed to send admin message' }, { status: 500 });
  }
}
