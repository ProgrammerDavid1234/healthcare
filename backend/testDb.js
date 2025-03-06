const { MongoClient } = require('mongodb');

const uri = 'mongodb+srv://olonadenifemi:david1234@cluster0.104ho.mongodb.net/healthcareDB?retryWrites=true&w=majority';

async function run() {
  const client = new MongoClient(uri);
  try {
    await client.connect();
    console.log('Connected to MongoDB');
  } catch (err) {
    console.error('Error connecting to MongoDB:', err);
  } finally {
    await client.close();
  }
}

run();