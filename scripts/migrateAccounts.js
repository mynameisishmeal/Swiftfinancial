const { MongoClient } = require('mongodb');
const fs = require('fs');
const path = require('path');

// Read .env.local manually
const envPath = path.join(__dirname, '..', '.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');
const uri = envContent.split('\n').find(line => line.includes('MONGODB_URI='))?.split('=').slice(1).join('=').trim();

async function migrateAccounts() {
  if (!uri) {
    console.error('❌ MONGODB_URI not found');
    process.exit(1);
  }

  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('✅ Connected to MongoDB\n');

    const db = client.db('swiftfinancial');
    const accounts = await db.collection('accounts').find({}).toArray();
    
    console.log(`📊 Found ${accounts.length} accounts to migrate\n`);

    let updated = 0;
    for (const account of accounts) {
      // Skip if already has these fields
      if (account.createdBy !== undefined && account.managedBy !== undefined) {
        console.log(`⏭️  Skipping ${account.email} (already migrated)`);
        continue;
      }

      const updateFields = {};
      
      // Add createdBy (null for self-registered)
      if (account.createdBy === undefined) {
        updateFields.createdBy = null;
      }
      
      // Add managedBy (null for unassigned, or first superadmin)
      if (account.managedBy === undefined) {
        if (account.role === 'superadmin' || account.role === 'admin') {
          updateFields.managedBy = null; // Admins don't have managers
        } else {
          // Assign to first superadmin if exists
          const superadmin = await db.collection('accounts').findOne({ role: 'superadmin' });
          updateFields.managedBy = superadmin ? superadmin.email : null;
        }
      }

      if (Object.keys(updateFields).length > 0) {
        await db.collection('accounts').updateOne(
          { _id: account._id },
          { $set: updateFields }
        );
        console.log(`✅ Updated ${account.email}`);
        updated++;
      }
    }

    console.log(`\n✅ Migration complete! Updated ${updated} accounts`);

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await client.close();
    console.log('✅ Connection closed');
  }
}

migrateAccounts();
