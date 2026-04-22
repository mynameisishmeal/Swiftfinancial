import { NextRequest, NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI!;

export async function GET(req: NextRequest) {
  const email = req.nextUrl.searchParams.get('email');
  const adminEmail = req.nextUrl.searchParams.get('adminEmail');
  
  if (!email) {
    return NextResponse.json({ verified: false }, { status: 400 });
  }

  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    const db = client.db('swiftfinancial');
    
    // Check if email matches an admin/superadmin account directly
    const account = await db.collection('accounts').findOne({ email });
    if (account && (account.role === 'admin' || account.role === 'superadmin')) {
      return NextResponse.json({ verified: true, role: account.role });
    }
    
    // Check if this Google email is bound to the current admin
    if (adminEmail) {
      const admin = await db.collection('accounts').findOne({ email: adminEmail });
      if (admin && admin.googleEmail === email && (admin.role === 'admin' || admin.role === 'superadmin')) {
        return NextResponse.json({ verified: true, role: admin.role });
      }
    }
    
    return NextResponse.json({ verified: false });
  } catch (error) {
    return NextResponse.json({ verified: false }, { status: 500 });
  } finally {
    await client.close();
  }
}
