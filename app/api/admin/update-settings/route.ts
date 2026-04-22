import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { 
      email, 
      checkingBalance,
      savingsBalance,
      creditBalance,
      creditLimit,
      ficoScore,
      rewardsPoints,
      cardExpiry,
      taxCleared,
      accountStatus,
      dailyLimit,
      monthlyLimit,
      overdraftProtection,
      interestRate,
      iban
    } = body;

    if (!email) {
      return NextResponse.json({ message: 'Email is required' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db('swiftfinancial');

    const updateData: any = {};
    
    if (checkingBalance !== undefined) updateData.balance = checkingBalance;
    if (savingsBalance !== undefined) updateData.savingsBalance = savingsBalance;
    if (creditBalance !== undefined) updateData.creditBalance = creditBalance;
    if (creditLimit !== undefined) updateData.creditLimit = creditLimit;
    if (ficoScore !== undefined) updateData.ficoScore = ficoScore;
    if (rewardsPoints !== undefined) updateData.rewardsPoints = rewardsPoints;
    if (cardExpiry !== undefined) updateData.cardExpiry = cardExpiry;
    if (taxCleared !== undefined) updateData.taxCleared = taxCleared;
    if (accountStatus !== undefined) updateData.accountStatus = accountStatus;
    if (dailyLimit !== undefined) updateData.dailyLimit = dailyLimit;
    if (monthlyLimit !== undefined) updateData.monthlyLimit = monthlyLimit;
    if (overdraftProtection !== undefined) updateData.overdraftProtection = overdraftProtection;
    if (interestRate !== undefined) updateData.interestRate = interestRate;
    if (iban !== undefined) updateData.iban = iban;

    const result = await db.collection('accounts').updateOne(
      { email },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ message: 'Account not found' }, { status: 404 });
    }

    return NextResponse.json({ 
      message: 'Account settings updated successfully',
      updated: updateData
    });
  } catch (error: any) {
    console.error('Update settings error:', error);
    return NextResponse.json({ message: 'Error updating settings: ' + error.message }, { status: 500 });
  }
}
