const { MongoClient, ServerApiVersion } = require('mongodb');
const dns = require('dns');
const fs = require('fs');

// Fix DNS resolution for Node.js 22 on Windows
dns.setDefaultResultOrder('ipv4first');
dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);

// Read .env.local manually
const envPath = '.env.local';
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  envContent.split('\n').forEach(line => {
    const [key, ...valueParts] = line.split('=');
    if (key && valueParts.length) {
      process.env[key.trim()] = valueParts.join('=').trim();
    }
  });
}

const uri = process.env.MONGODB_URI;

if (!uri) {
  console.error('❌ MONGODB_URI not found in .env.local');
  process.exit(1);
}

console.log('🔍 Testing MongoDB Connection...');
console.log('📍 URI:', uri.replace(/\/\/([^:]+):([^@]+)@/, '//<username>:<password>@'));
console.log('🌐 DNS Servers:', dns.getServers());
console.log('');

const options = {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
  serverSelectionTimeoutMS: 30000,
  connectTimeoutMS: 30000,
  socketTimeoutMS: 45000,
  maxPoolSize: 10,
  minPoolSize: 5,
  retryWrites: true,
  retryReads: true,
  family: 4,
};

async function testConnection() {
  let client;
  
  try {
    console.log('⏳ Connecting to MongoDB...');
    client = new MongoClient(uri, options);
    
    await client.connect();
    console.log('✅ Connected successfully!');
    
    console.log('⏳ Testing ping...');
    await client.db('admin').command({ ping: 1 });
    console.log('✅ Ping successful!');
    
    console.log('⏳ Listing databases...');
    const dbs = await client.db().admin().listDatabases();
    console.log('✅ Databases:', dbs.databases.map(db => db.name).join(', '));
    
    console.log('');
    console.log('🎉 All tests passed! MongoDB connection is working.');
    
  } catch (error) {
    console.error('');
    console.error('❌ Connection failed!');
    console.error('Error:', error.message);
    console.error('Code:', error.code);
    console.error('');
    
    if (error.code === 'ETIMEOUT' || error.code === 'ECONNREFUSED') {
      console.log('💡 Suggestions:');
      console.log('   1. Check your internet connection');
      console.log('   2. Verify MongoDB Atlas IP whitelist (add 0.0.0.0/0 for testing)');
      console.log('   3. Try downgrading to Node.js 20 LTS or 22.13.1');
      console.log('   4. Check if your firewall is blocking the connection');
      console.log('   5. Try using a VPN or different network');
    }
    
    process.exit(1);
  } finally {
    if (client) {
      await client.close();
      console.log('🔌 Connection closed.');
    }
  }
}

testConnection();
