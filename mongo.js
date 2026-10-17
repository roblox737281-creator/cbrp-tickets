const mongodb = require('mongodb');
const { env } = require('../env');
let client = null;
let db = null;
let connecting = null;
async function getMongoDb() {
  if (db) return db;
  if (connecting) return connecting;
  const uri = env.mongoUri;
  if (!uri) throw new Error('MONGODB_URI is not set');
  connecting = (async () => {
    client = new mongodb.MongoClient(uri);
    await client.connect();
    db = client.db();
    return db;
  })();
  try {
    return await connecting;
  } finally {
    connecting = null;
  }
}

module.exports = { getMongoDb };
