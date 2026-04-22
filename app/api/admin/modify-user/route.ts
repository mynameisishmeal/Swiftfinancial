import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function POST(req: NextRequest) {
  try {
    const { accountId, adminEmail, updates } = await req.json();
    
    const client = await clientPromise;
    const db = client.db('habank');
    
    const admin = await db.collection('accounts').findOne({ email: adminEmail });
    if (!admin || (admin.role !== 'admin' && admin.role !== 'superadmin')) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 403 });
    }

    const user = await db.collection('accounts').findOne({ accountId });
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    if (admin.role === 'admin' && user.managedBy !== adminEmail) {
      return NextResponse.json({ message: 'You can only modify users you manage' }, { status: 403 });
    }

    const updateFields: any = {};
    
    if (updates.balance !== undefined) updateFields.balance = parseFloat(updates.balance);
    if (updates.checkingBalance !== undefined) updateFields.checkingBalance = parseFloat(updates.checkingBalance);
    if (updates.savingsBalance !== undefined) updateFields.savingsBalance = parseFloat(updates.savingsBalance);
    if (updates.creditLimit !== undefined) updateFields.creditLimit = parseFloat(updates.creditLimit);
    if (updates.ficoScore !== undefined) updateFields.ficoScore = parseInt(updates.ficoScore);
    if (updates.rewardsPoints !== undefined) updateFields.rewardsPoints = parseInt(updates.rewardsPoints);
    if (updates.dailyLimit !== undefined) updateFields.dailyLimit = parseFloat(updates.dailyLimit);
    if (updates.monthlyLimit !== undefined) updateFields.monthlyLimit = parseFloat(updates.monthlyLimit);
    if (updates.interestRate !== undefined) updateFields.interestRate = parseFloat(updates.interestRate);
    if (updates.avatar !== undefined) updateFields.avatar = updates.avatar;
    if (updates.iban !== undefined) updateFields.iban = updates.iban;
    if (updates.cardExpiry !== undefined) updateFields.cardExpiry = updates.cardExpiry;
    if (updates.phone !== undefined) updateFields.phone = updates.phone;

    await db.collection('accounts').updateOne(
      { accountId },
      { $set: updateFields }
    );

    return NextResponse.json({ message: 'User updated successfully' });
  } catch (error: any) {
    return NextResponse.json({ message: 'Error: ' + error.message }, { status: 500 });
  }
}
