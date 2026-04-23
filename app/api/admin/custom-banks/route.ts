import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function GET(req: NextRequest) {
  try {
    const client = await clientPromise;
    const db = client.db('habank');
    
    const banks = await db.collection('customBanks').find({}).toArray();
    
    return NextResponse.json({ banks });
  } catch (error: any) {
    return NextResponse.json({ message: 'Error: ' + error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { adminEmail, bankName, category } = await req.json();
    
    if (!bankName || !category) {
      return NextResponse.json({ message: 'Bank name and category are required' }, { status: 400 });
    }
    
    const client = await clientPromise;
    const db = client.db('habank');
    
    const admin = await db.collection('accounts').findOne({ email: adminEmail });
    if (!admin || (admin.role !== 'admin' && admin.role !== 'superadmin')) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 403 });
    }
    
    // Check if bank already exists
    const existing = await db.collection('customBanks').findOne({ name: bankName });
    if (existing) {
      return NextResponse.json({ message: 'Bank already exists' }, { status: 400 });
    }
    
    await db.collection('customBanks').insertOne({
      name: bankName,
      category,
      createdBy: adminEmail,
      createdAt: new Date()
    });
    
    return NextResponse.json({ message: 'Bank added successfully' });
  } catch (error: any) {
    return NextResponse.json({ message: 'Error: ' + error.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const bankName = searchParams.get('bankName');
    const adminEmail = searchParams.get('adminEmail');
    
    if (!bankName || !adminEmail) {
      return NextResponse.json({ message: 'Bank name and admin email are required' }, { status: 400 });
    }
    
    const client = await clientPromise;
    const db = client.db('habank');
    
    const admin = await db.collection('accounts').findOne({ email: adminEmail });
    if (!admin || (admin.role !== 'admin' && admin.role !== 'superadmin')) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 403 });
    }
    
    await db.collection('customBanks').deleteOne({ name: bankName });
    
    return NextResponse.json({ message: 'Bank deleted successfully' });
  } catch (error: any) {
    return NextResponse.json({ message: 'Error: ' + error.message }, { status: 500 });
  }
}
