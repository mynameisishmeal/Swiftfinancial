import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function POST(req: NextRequest) {
  try {
    const { action, adminEmail, userEmail, notification, counts } = await req.json();
    
    const client = await clientPromise;
    const db = client.db('habank');
    
    const admin = await db.collection('accounts').findOne({ email: adminEmail });
    if (!admin || (admin.role !== 'admin' && admin.role !== 'superadmin')) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 403 });
    }

    const user = await db.collection('accounts').findOne({ email: userEmail });
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    if (admin.role === 'admin' && user.managedBy !== adminEmail) {
      return NextResponse.json({ message: 'You can only manage notifications for users you manage' }, { status: 403 });
    }

    if (action === 'setCounts') {
      const notifications = user.notifications || [];
      const inboxNotifs = notifications.filter((n: any) => n.type === 'inbox');
      const productNotifs = notifications.filter((n: any) => n.type === 'products');
      const alertNotifs = notifications.filter((n: any) => n.type === 'alerts');

      let updatedNotifications = [...notifications];

      // Adjust inbox count
      if (counts.inbox < inboxNotifs.length) {
        updatedNotifications = updatedNotifications.filter((n: any) => {
          if (n.type === 'inbox' && inboxNotifs.indexOf(n) >= counts.inbox) return false;
          return true;
        });
      } else if (counts.inbox > inboxNotifs.length) {
        const toAdd = counts.inbox - inboxNotifs.length;
        for (let i = 0; i < toAdd; i++) {
          updatedNotifications.push({
            id: `${Date.now()}-${i}`,
            type: 'inbox',
            title: 'New Message',
            text: 'You have a new message',
            time: new Date().toISOString(),
            read: false,
            createdBy: adminEmail
          });
        }
      }

      // Adjust products count
      const currentProductNotifs = updatedNotifications.filter((n: any) => n.type === 'products');
      if (counts.products < currentProductNotifs.length) {
        updatedNotifications = updatedNotifications.filter((n: any) => {
          if (n.type === 'products' && currentProductNotifs.indexOf(n) >= counts.products) return false;
          return true;
        });
      } else if (counts.products > currentProductNotifs.length) {
        const toAdd = counts.products - currentProductNotifs.length;
        for (let i = 0; i < toAdd; i++) {
          updatedNotifications.push({
            id: `${Date.now()}-p-${i}`,
            type: 'products',
            title: 'New Product',
            text: 'Check out our new product offering',
            time: new Date().toISOString(),
            read: false,
            createdBy: adminEmail
          });
        }
      }

      // Adjust alerts count
      const currentAlertNotifs = updatedNotifications.filter((n: any) => n.type === 'alerts');
      if (counts.alerts < currentAlertNotifs.length) {
        updatedNotifications = updatedNotifications.filter((n: any) => {
          if (n.type === 'alerts' && currentAlertNotifs.indexOf(n) >= counts.alerts) return false;
          return true;
        });
      } else if (counts.alerts > currentAlertNotifs.length) {
        const toAdd = counts.alerts - currentAlertNotifs.length;
        for (let i = 0; i < toAdd; i++) {
          updatedNotifications.push({
            id: `${Date.now()}-a-${i}`,
            type: 'alerts',
            title: 'New Alert',
            text: 'You have a new alert',
            time: new Date().toISOString(),
            read: false,
            createdBy: adminEmail
          });
        }
      }

      await db.collection('accounts').updateOne(
        { email: userEmail },
        { $set: { notifications: updatedNotifications } }
      );

      return NextResponse.json({ message: 'Notification counts updated' });
    }

    if (action === 'create') {
      const newNotification = {
        id: Date.now().toString(),
        type: notification.type,
        title: notification.title,
        text: notification.text,
        time: new Date().toISOString(),
        read: false,
        createdBy: adminEmail
      };

      await db.collection('accounts').updateOne(
        { email: userEmail },
        { $push: { notifications: newNotification } as any }
      );

      return NextResponse.json({ message: 'Notification created', notification: newNotification });
    }

    if (action === 'markRead') {
      await db.collection('accounts').updateOne(
        { email: userEmail, 'notifications.id': notification.id },
        { $set: { 'notifications.$.read': true } }
      );
      return NextResponse.json({ message: 'Notification marked as read' });
    }

    if (action === 'markUnread') {
      await db.collection('accounts').updateOne(
        { email: userEmail, 'notifications.id': notification.id },
        { $set: { 'notifications.$.read': false } }
      );
      return NextResponse.json({ message: 'Notification marked as unread' });
    }

    if (action === 'delete') {
      await db.collection('accounts').updateOne(
        { email: userEmail },
        { $pull: { notifications: { id: notification.id } } as any }
      );
      return NextResponse.json({ message: 'Notification deleted' });
    }

    if (action === 'deleteAll') {
      await db.collection('accounts').updateOne(
        { email: userEmail },
        { $set: { notifications: [] } }
      );
      return NextResponse.json({ message: 'All notifications deleted' });
    }

    return NextResponse.json({ message: 'Invalid action' }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ message: 'Error: ' + error.message }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userEmail = searchParams.get('userEmail');
    
    if (!userEmail) {
      return NextResponse.json({ message: 'User email required' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db('habank');
    
    const user = await db.collection('accounts').findOne({ email: userEmail });
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    let notifications = user.notifications || [];
    
    if (notifications.length === 0) {
      const defaultNotifications = [
        { id: `${Date.now()}-1`, type: 'inbox', title: 'Payment Confirmation', text: 'Your payment of $250.00 has been processed', time: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), read: false, createdBy: 'system' },
        { id: `${Date.now()}-2`, type: 'inbox', title: 'Statement Available', text: 'Your December statement is ready to view', time: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), read: false, createdBy: 'system' },
        { id: `${Date.now()}-3`, type: 'inbox', title: 'Security Alert', text: 'New device login detected from Chrome', time: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), read: false, createdBy: 'system' },
        { id: `${Date.now()}-4`, type: 'inbox', title: 'Transfer Complete', text: '$1,000 transferred to savings account', time: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), read: false, createdBy: 'system' },
        { id: `${Date.now()}-5`, type: 'inbox', title: 'Direct Deposit', text: 'Payroll deposit of $3,500 received', time: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), read: false, createdBy: 'system' },
        { id: `${Date.now()}-6`, type: 'inbox', title: 'Card Activated', text: 'Your new credit card has been activated', time: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), read: false, createdBy: 'system' },
        { id: `${Date.now()}-7`, type: 'inbox', title: 'Rewards Earned', text: 'You earned 500 bonus points this month', time: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), read: false, createdBy: 'system' },
        { id: `${Date.now()}-8`, type: 'inbox', title: 'Account Update', text: 'Your contact information was updated', time: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(), read: false, createdBy: 'system' },
        { id: `${Date.now()}-9`, type: 'inbox', title: 'Welcome Message', text: 'Thank you for banking with us', time: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), read: false, createdBy: 'system' },
        { id: `${Date.now()}-10`, type: 'products', title: 'Credit Card Rewards', text: 'You have 15,000 points available', time: new Date().toISOString(), read: false, createdBy: 'system' },
        { id: `${Date.now()}-11`, type: 'products', title: 'Savings Account', text: 'Earn 2.5% APY on your balance', time: new Date().toISOString(), read: false, createdBy: 'system' },
        { id: `${Date.now()}-12`, type: 'products', title: 'Auto Loan', text: 'Pre-qualified for rates as low as 3.9%', time: new Date().toISOString(), read: false, createdBy: 'system' },
        { id: `${Date.now()}-13`, type: 'products', title: 'Home Equity Line', text: 'Access up to $100,000 in equity', time: new Date().toISOString(), read: false, createdBy: 'system' },
        { id: `${Date.now()}-14`, type: 'products', title: 'Investment Account', text: 'Start investing with as little as $100', time: new Date().toISOString(), read: false, createdBy: 'system' },
        { id: `${Date.now()}-15`, type: 'products', title: 'Business Credit Card', text: 'Earn 3% cash back on purchases', time: new Date().toISOString(), read: false, createdBy: 'system' },
        { id: `${Date.now()}-16`, type: 'products', title: 'Overdraft Protection', text: 'Link accounts for automatic coverage', time: new Date().toISOString(), read: false, createdBy: 'system' },
        { id: `${Date.now()}-17`, type: 'products', title: 'Mobile Deposit', text: 'Deposit checks from anywhere', time: new Date().toISOString(), read: false, createdBy: 'system' },
        { id: `${Date.now()}-18`, type: 'products', title: 'Bill Pay Service', text: 'Schedule and manage all your bills', time: new Date().toISOString(), read: false, createdBy: 'system' },
        { id: `${Date.now()}-19`, type: 'alerts', title: 'Large Deposit', text: '$5,000 deposited to checking account', time: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(), read: false, createdBy: 'system' },
        { id: `${Date.now()}-20`, type: 'alerts', title: 'Bill Payment Due', text: 'Credit card payment due in 3 days', time: new Date().toISOString(), read: false, createdBy: 'system' },
        { id: `${Date.now()}-21`, type: 'alerts', title: 'Account Update', text: 'Your profile information was updated', time: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), read: false, createdBy: 'system' },
        { id: `${Date.now()}-22`, type: 'alerts', title: 'Zelle Request', text: 'You have 3 pending Zelle requests', time: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), read: false, createdBy: 'system' },
      ];
      
      await db.collection('accounts').updateOne(
        { email: userEmail },
        { $set: { notifications: defaultNotifications } }
      );
      
      notifications = defaultNotifications;
    }
    
    return NextResponse.json({ notifications });
  } catch (error: any) {
    return NextResponse.json({ message: 'Error: ' + error.message }, { status: 500 });
  }
}
