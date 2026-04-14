import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import speakeasy from 'speakeasy';
import QRCode from 'qrcode';

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: 'Email required' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db('bankdb');
    const user = await db.collection('users').findOne({ email });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Generate secret
    const secret = speakeasy.generateSecret({
      name: `Swift Financial (${email})`,
      length: 32
    });

    // Generate QR code
    const qrCode = await QRCode.toDataURL(secret.otpauth_url || '');

    // Store temp secret (not activated yet)
    await db.collection('users').updateOne(
      { email },
      { $set: { twoFactorTempSecret: secret.base32, twoFactorEnabled: false } }
    );

    return NextResponse.json({
      success: true,
      secret: secret.base32,
      qrCode
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
