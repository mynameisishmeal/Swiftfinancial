const { MongoClient } = require('mongodb');
const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '..', '.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');
const uri = envContent.split('\n').find(line => line.includes('MONGODB_URI='))?.split('=').slice(1).join('=').trim();

async function fixMissingNames() {
  if (!uri) {
    console.error('❌ MONGODB_URI not found');
    process.exit(1);
  }

  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('✅ Connected to MongoDB\n');

    const db = client.db('habank');
    const accounts = await db.collection('accounts').find({
      $or: [
        { name: { $exists: false } },
        { name: '' },
        { name: 'N/A' },
        { name: null }
      ]
    }).toArray();
    
    console.log(`📊 Found ${accounts.length} accounts with missing names\n`);

    for (const account of accounts) {
      // Extract name from email (before @)
      const emailName = account.email.split('@')[0];
      const generatedName = emailName.charAt(0).toUpperCase() + emailName.slice(1);
      
      await db.collection('accounts').updateOne(
        { _id: account._id },
        { $set: { name: generatedName } }
      );
      
      console.log(`✅ Updated ${account.email} → ${generatedName}`);
    }

    console.log(`\n✅ Fixed ${accounts.length} accounts`);

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await client.close();
    console.log('✅ Connection closed');
  }
}

fixMissingNames();
