import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const adminEmail = searchParams.get('adminEmail');
    const role = searchParams.get('role');
    
    const client = await clientPromise;
    const db = client.db('habank');
    
    let accounts;
    if (role === 'superadmin') {
      // Superadmin sees all accounts
      accounts = await db.collection('accounts').find({}).toArray();
    } else if (role === 'admin') {
      // Regular admin sees only their managed accounts
      accounts = await db.collection('accounts').find({ 
        managedBy: adminEmail
      }).toArray();
    } else {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 403 });
    }
    
    return NextResponse.json({ accounts });
  } catch (error: any) {
    return NextResponse.json({ message: 'Error: ' + error.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { accountId } = await req.json();
    
    const client = await clientPromise;
    const db = client.db('habank');
    
    await db.collection('accounts').deleteOne({ accountId });
    
    return NextResponse.json({ message: 'Account deleted successfully' });
  } catch (error: any) {
    return NextResponse.json({ message: 'Error: ' + error.message }, { status: 500 });
  }
}
