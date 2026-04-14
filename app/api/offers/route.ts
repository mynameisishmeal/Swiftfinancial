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
    
    if (!user || !user.offers) {
      const defaultOffers = {
        aprOffer: { active: true, activated: false, pending: false },
        bonusOffer: { active: true, activated: false },
        savingsUpgrade: { active: true, upgraded: false }
      };

      await db.collection('users').updateOne(
        { email },
        { $set: { offers: defaultOffers } },
        { upsert: true }
      );

      return NextResponse.json({ offers: defaultOffers });
    }

    return NextResponse.json({ offers: user.offers || {} });
  } catch (error) {
    console.error('Offers error:', error);
    return NextResponse.json({ error: 'Failed to fetch offers' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, offerType, action } = body;

    if (!email || !offerType || !action) {
      return NextResponse.json({ error: 'Email, offerType, and action required' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db('bankdb');

    if (offerType === 'aprOffer' && action === 'apply') {
      await db.collection('users').updateOne(
        { email },
        { $set: { 'offers.aprOffer.pending': true } }
      );
      return NextResponse.json({ success: true, message: 'APR offer application sent to admin for approval' });
    }

    if (offerType === 'bonusOffer' && action === 'activate') {
      const user = await db.collection('users').findOne({ email });
      if (!user) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
      }

      await db.collection('users').updateOne(
        { email },
        { 
          $set: { 'offers.bonusOffer.activated': true },
          $inc: { balance: 200 }
        }
      );
      return NextResponse.json({ success: true, message: '$200 bonus added to your account!' });
    }

    if (offerType === 'savingsUpgrade' && action === 'upgrade') {
      await db.collection('users').updateOne(
        { email },
        { $set: { 'offers.savingsUpgrade.upgraded': true } }
      );
      return NextResponse.json({ success: true, message: 'Savings account upgraded to 4.5% APY!' });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error('Offer action error:', error);
    return NextResponse.json({ error: 'Failed to process offer' }, { status: 500 });
  }
}
