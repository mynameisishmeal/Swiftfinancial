import clientPromise from './mongodb';

export async function testConnection() {
  try {
    console.log('🔄 Connecting to MongoDB...');
    const client = await clientPromise;
    await client.db('admin').command({ ping: 1 });
    console.log('✅ MongoDB connected successfully');
    return true;
  } catch (error: any) {
    console.error('❌ MongoDB connection failed:', error.message);
    return false;
  }
}

// Auto-run on import
testConnection();
