const { MongoClient } = require('mongodb');

const uri = 'mongodb+srv://9l3ZDZBR3GxV4aDW:9l3ZDZBR3GxV4aDW@cluster0.euhmfzg.mongodb.net/?appName=Cluster0';

async function addTestUser() {
  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    const db = client.db('habank');
    
    const testUser = {
      email: 'test@test.com',
      password: 'test123',
      role: 'user',
      accountId: 'ACC' + Date.now(),
      createdAt: new Date()
    };
    
    const existing = await db.collection('accounts').findOne({ email: testUser.email });
    
    if (existing) {
      console.log('Test user already exists');
      console.log('Email:', testUser.email);
      console.log('Password:', existing.password);
    } else {
      await db.collection('accounts').insertOne(testUser);
      console.log('Test user created successfully!');
      console.log('Email:', testUser.email);
      console.log('Password:', testUser.password);
    }
  } finally {
    await client.close();
  }
}

addTestUser().catch(console.error);
