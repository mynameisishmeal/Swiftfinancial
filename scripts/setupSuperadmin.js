const { MongoClient } = require('mongodb');

const LOCAL_URI = 'mongodb://localhost:27017';
const ATLAS_URI = 'mongodb+srv://9l3ZDZBR3GxV4aDW:9l3ZDZBR3GxV4aDW@cluster0.euhmfzg.mongodb.net/swiftfinancial?appName=Cluster0';
const DB_NAME = 'swiftfinancial';

const superadmin = {
  accountId: 'ACC' + Date.now(),
  name: 'Super Admin',
  email: 'maelsav100@gmail.com',
  password: '1',
  role: 'superadmin',
  avatar: '',
  balance: 0,
  savingsBalance: 0,
  creditBalance: 0,
  creditLimit: 0,
  ficoScore: 850,
  rewardsPoints: 0,
  cardExpiry: '12/28',
  iban: '',
  dailyLimit: 999999999,
  monthlyLimit: 999999999,
  interestRate: 0,
  accountStatus: 'active',
  overdraftProtection: true,
  zellePending: 0,
  transactions: [],
  taxCleared: true,
  notifications: [],
  createdAt: new Date(),
};

async function injectSuperadmin(uri, label) {
  const client = new MongoClient(uri);
  try {
    await client.connect();
    console.log(`Connected to ${label}`);
    const db = client.db(DB_NAME);

    const existing = await db.collection('accounts').findOne({ email: superadmin.email });
    if (existing) {
      await db.collection('accounts').updateOne(
        { email: superadmin.email },
        { $set: { role: 'superadmin', password: '1' } }
      );
      console.log(`[${label}] Superadmin already exists — updated role and password.`);
    } else {
      await db.collection('accounts').insertOne(superadmin);
      console.log(`[${label}] Superadmin created successfully.`);
    }
  } catch (err) {
    console.error(`[${label}] Error:`, err.message);
  } finally {
    await client.close();
  }
}

async function main() {
  await injectSuperadmin(LOCAL_URI, 'Local MongoDB');
  await injectSuperadmin(ATLAS_URI, 'MongoDB Atlas');
  console.log('Done.');
}

main().catch(console.error);
