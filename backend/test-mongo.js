import mongoose from 'mongoose';

const uri = 'mongodb+srv://admin1:Shivam1747@cluster0.mlws4oj.mongodb.net/sovereign-wealth';

async function testConnection() {
  console.log('Attempting to connect to MongoDB Atlas...');
  try {
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000 // 5 second timeout
    });
    console.log('✅ Connection successful!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Connection failed:');
    console.error(error.message);
    if (error.message.includes('bad auth')) {
      console.log('Reason: Incorrect username or password.');
    } else if (error.message.includes('IP address')) {
      console.log('Reason: Your IP address is not whitelisted in MongoDB Atlas.');
    } else {
      console.log('Reason: The cluster might be paused, deleted, or network is blocked.');
    }
    process.exit(1);
  }
}

testConnection();
