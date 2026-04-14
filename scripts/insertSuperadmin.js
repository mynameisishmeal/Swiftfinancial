const { MongoClient } = require('mongodb');

const uri = 'mongodb+srv://iamhuansun:logcUGD7hmWK0vmM@cluster0.qpnxoy4.mongodb.net/?appName=Cluster0';

async function insertSuperadmin() {
  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    
    const db = client.db('habank');
    const accounts = db.collection('accounts');
    
    const superadmin = {
      email: 'maelsav100@gmail.com',
      password: '@Mikeeteller0',
      name: 'Super Admin',
      accountId: 'SA' + Date.now(),
      balance: 0,
      role: 'superadmin',
      taxCleared: true,
      transactions: [],
      createdAt: new Date()
    };
    
    const existing = await accounts.findOne({ email: superadmin.email });
    
    if (existing) {
      await accounts.updateOne(
        { email: superadmin.email },
        { $set: { role: 'superadmin' } }
      );
      console.log('Updated existing user to superadmin');
    } else {
      await accounts.insertOne(superadmin);
      console.log('Inserted new superadmin');
    }
    
    console.log('Superadmin ready:', superadmin.email);
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.close();
  }
}

insertSuperadmin();
