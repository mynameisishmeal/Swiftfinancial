import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function PUT(req: NextRequest) {
  try {
    const { email, avatar } = await req.json();

    const client = await clientPromise;
    const db = client.db('swiftfinancial');

    await db.collection('accounts').updateOne(
      { email },
      { $set: { avatar } }
    );

    return NextResponse.json({ message: 'Avatar updated successfully' });
  } catch (error: any) {
    return NextResponse.json({ message: 'Error: ' + error.message }, { status: 500 });
  }
}
