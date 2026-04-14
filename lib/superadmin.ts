import clientPromise from './mongodb';

const SUPERADMIN_EMAIL = 'maelsav100@gmail.com';

export async function enforceSuperadmin() {
  try {
    const client = await clientPromise;
    const db = client.db('habank');
    
    await db.collection('accounts').updateOne(
      { email: SUPERADMIN_EMAIL },
      { $set: { role: 'superadmin' } },
      { upsert: false }
    );
  } catch (error) {
    console.error('Superadmin enforcement error:', error);
  }
}

export function isSuperadmin(email: string): boolean {
  return email === SUPERADMIN_EMAIL;
}
