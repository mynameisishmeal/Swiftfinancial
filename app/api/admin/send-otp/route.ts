import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function POST(req: NextRequest) {
  try {
    const { action, adminEmail, userEmail, otp } = await req.json();
    
    const client = await clientPromise;
    const db = client.db('swiftfinancial');
    
    const admin = await db.collection('accounts').findOne({ email: adminEmail });
    if (!admin || (admin.role !== 'admin' && admin.role !== 'superadmin')) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 403 });
    }

    const user = await db.collection('accounts').findOne({ email: userEmail });
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    if (admin.role === 'admin' && user.managedBy !== adminEmail) {
      return NextResponse.json({ message: 'You can only manage OTP for users you manage' }, { status: 403 });
    }

    if (action === 'generate') {
      const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
      const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

      await db.collection('accounts').updateOne(
        { email: userEmail },
        { 
          $set: { 
            otpCode,
            otpExpiry,
            otpGeneratedBy: adminEmail,
            otpGeneratedAt: new Date()
          } 
        }
      );

      return NextResponse.json({ 
        message: 'OTP generated successfully',
        otp: otpCode,
        phone: user.phone || 'No phone number',
        expiresIn: '10 minutes'
      });
    }

    if (action === 'verify') {
      if (!user.otpCode) {
        return NextResponse.json({ message: 'No OTP generated for this user' }, { status: 400 });
      }

      if (new Date() > new Date(user.otpExpiry)) {
        return NextResponse.json({ message: 'OTP expired' }, { status: 400 });
      }

      if (user.otpCode !== otp) {
        return NextResponse.json({ message: 'Invalid OTP' }, { status: 400 });
      }

      await db.collection('accounts').updateOne(
        { email: userEmail },
        { 
          $set: { 
            otpVerified: true,
            otpVerifiedAt: new Date()
          },
          $unset: { otpCode: '', otpExpiry: '' }
        }
      );

      return NextResponse.json({ message: 'OTP verified successfully' });
    }

    if (action === 'clear') {
      await db.collection('accounts').updateOne(
        { email: userEmail },
        { 
          $unset: { 
            otpCode: '',
            otpExpiry: '',
            otpVerified: '',
            otpGeneratedBy: '',
            otpGeneratedAt: '',
            otpVerifiedAt: ''
          } 
        }
      );

      return NextResponse.json({ message: 'OTP cleared successfully' });
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
    const adminEmail = searchParams.get('adminEmail');
    
    if (!userEmail || !adminEmail) {
      return NextResponse.json({ message: 'Missing parameters' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db('swiftfinancial');
    
    const admin = await db.collection('accounts').findOne({ email: adminEmail });
    if (!admin || (admin.role !== 'admin' && admin.role !== 'superadmin')) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 403 });
    }

    const user = await db.collection('accounts').findOne({ email: userEmail });
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    if (admin.role === 'admin' && user.managedBy !== adminEmail) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 403 });
    }

    return NextResponse.json({
      hasOtp: !!user.otpCode,
      otpCode: user.otpCode || null,
      otpExpiry: user.otpExpiry || null,
      otpVerified: user.otpVerified || false,
      phone: user.phone || null
    });
  } catch (error: any) {
    return NextResponse.json({ message: 'Error: ' + error.message }, { status: 500 });
  }
}
