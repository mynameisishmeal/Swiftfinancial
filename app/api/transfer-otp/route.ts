import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function POST(req: NextRequest) {
  try {
    const { action, email, otp } = await req.json();
    const client = await clientPromise;
    const db = client.db('swiftfinancial');

    const user = await db.collection('accounts').findOne({ email });
    if (!user) return NextResponse.json({ message: 'User not found' }, { status: 404 });

    if (action === 'verify') {
      if (!user.otpCode) return NextResponse.json({ message: 'No OTP has been issued for your account. Contact your bank representative.' }, { status: 400 });
      if (new Date() > new Date(user.otpExpiry)) return NextResponse.json({ message: 'OTP has expired. Request a new one from your bank representative.' }, { status: 400 });
      if (user.otpCode !== otp) return NextResponse.json({ message: 'Invalid OTP code' }, { status: 400 });

      await db.collection('accounts').updateOne(
        { email },
        { $unset: { otpCode: '', otpExpiry: '', otpGeneratedBy: '', otpGeneratedAt: '' } }
      );

      return NextResponse.json({ success: true, message: 'OTP verified' });
    }

    return NextResponse.json({ message: 'Invalid action' }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
