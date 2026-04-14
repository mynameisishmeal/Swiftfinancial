import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json({ error: 'Email required' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db('bankdb');
    
    let user = await db.collection('users').findOne({ email });
    
    if (!user || !user.notifications) {
      const defaultNotifications = [
        {
          id: 'notif-1',
          title: 'Welcome to Swift Financial',
          text: 'Thank you for choosing us as your banking partner',
          time: new Date().toISOString(),
          read: false,
          type: 'welcome'
        },
        {
          id: 'notif-2',
          title: 'Account Verified',
          text: 'Your account has been successfully verified',
          time: new Date().toISOString(),
          read: false,
          type: 'account'
        },
        {
          id: 'notif-3',
          title: 'Security Alert',
          text: 'New device login detected. If this wasn\'t you, please contact us immediately',
          time: new Date().toISOString(),
          read: false,
          type: 'security'
        },
        {
          id: 'notif-4',
          title: 'Special Offer Available',
          text: '0% APR for 15 months on balance transfers. Limited time offer!',
          time: new Date().toISOString(),
          read: false,
          type: 'offer'
        }
      ];

      await db.collection('users').updateOne(
        { email },
        { $set: { notifications: defaultNotifications } },
        { upsert: true }
      );

      return NextResponse.json({ notifications: defaultNotifications });
    }

    return NextResponse.json({ notifications: user.notifications || [] });
  } catch (error) {
    console.error('Notifications error:', error);
    return NextResponse.json({ error: 'Failed to fetch notifications' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { email, notificationId } = body;

    if (!email || !notificationId) {
      return NextResponse.json({ error: 'Email and notificationId required' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db('bankdb');

    await db.collection('users').updateOne(
      { email, 'notifications.id': notificationId },
      { $set: { 'notifications.$.read': true } }
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Mark notification read error:', error);
    return NextResponse.json({ error: 'Failed to mark notification as read' }, { status: 500 });
  }
}
