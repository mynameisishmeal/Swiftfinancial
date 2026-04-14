import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import speakeasy from 'speakeasy';

export async function POST(req: NextRequest) {
  try {
    const { email, token } = await req.json();

    if (!email || !token) {
      return NextResponse.json({ error: 'Email and token required' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db('bankdb');
    const user = await db.collection('users').findOne({ email });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const secret = user.twoFactorTempSecret || user.twoFactorSecret;
    if (!secret) {
      return NextResponse.json({ error: '2FA not set up' }, { status: 400 });
    }

    // Verify token
    const verified = speakeasy.totp.verify({
      secret,
      encoding: 'base32',
      token,
      window: 2
    });

    if (!verified) {
      return NextResponse.json({ error: 'Invalid verification code' }, { status: 401 });
    }

    // Activate 2FA if this is first verification
    if (user.twoFactorTempSecret) {
      await db.collection('users').updateOne(
        { email },
        {
          $set: {
            twoFactorSecret: user.twoFactorTempSecret,
            twoFactorEnabled: true
          },
          $unset: { twoFactorTempSecret: '' }
        }
      );
    }

    return NextResponse.json({
      success: true,
      message: '2FA verified successfully'
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
