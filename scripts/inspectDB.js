const { MongoClient } = require('mongodb');
const fs = require('fs');
const path = require('path');

// Read .env.local manually
const envPath = path.join(__dirname, '..', '.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');
const uri = envContent.split('\n').find(line => line.includes('MONGODB_URI='))?.split('=').slice(1).join('=').trim();

async function inspectDB() {
  
  if (!uri) {
    console.error('❌ MONGODB_URI not found in .env.local');
    process.exit(1);
  }

  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('✅ Connected to MongoDB\n');

    const db = client.db('habank');
    
    // Get all collections
    const collections = await db.listCollections().toArray();
    console.log('📁 Collections:', collections.map(c => c.name).join(', '));
    console.log('');

    // Inspect accounts collection
    const accounts = await db.collection('accounts').find({}).toArray();
    console.log(`👥 Total Accounts: ${accounts.length}\n`);

    if (accounts.length > 0) {
      console.log('📋 Sample Account Structure:');
      console.log(JSON.stringify(accounts[0], null, 2));
      console.log('\n');

      console.log('📊 All Accounts Summary:');
      accounts.forEach((acc, idx) => {
        console.log(`\n${idx + 1}. ${acc.name || 'N/A'}`);
        console.log(`   Email: ${acc.email}`);
        console.log(`   Account ID: ${acc.accountId}`);
        console.log(`   Balance: $${acc.balance || 0}`);
        console.log(`   Role: ${acc.role || 'user'}`);
        console.log(`   Tax Cleared: ${acc.taxCleared ? 'Yes' : 'No'}`);
        console.log(`   Transactions: ${acc.transactions?.length || 0}`);
      });
    } else {
      console.log('⚠️  No accounts found in database');
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await client.close();
    console.log('\n✅ Connection closed');
  }
}

inspectDB();
