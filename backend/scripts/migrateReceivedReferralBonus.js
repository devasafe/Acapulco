// Usage: node backend/scripts/migrateReceivedReferralBonus.js
// This script marks users that already triggered a referral bonus by looking
// at referral transactions that have sourceUser set. It's idempotent.

const mongoose = require('mongoose');
const Transaction = require('../models/Transaction');
const User = require('../models/User');

async function main() {
  const mongoUrl = process.env.MONGO_URL || process.env.MONGODB_URI || 'mongodb://localhost:27017/acapulco';
  await mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
  console.log('Connected to MongoDB', mongoUrl);

  // Find all referral transactions that have sourceUser populated
  const txs = await Transaction.find({ type: 'referral', sourceUser: { $ne: null } }).select('sourceUser').lean();
  const sourceIds = [...new Set(txs.map(t => t.sourceUser.toString()))];
  console.log(`Found ${sourceIds.length} source users to mark`);

  if (sourceIds.length === 0) {
    console.log('Nothing to do');
    process.exit(0);
  }

  const res = await User.updateMany({ _id: { $in: sourceIds } }, { $set: { receivedReferralBonus: true } });
  console.log('Update result:', res);
  await mongoose.disconnect();
  console.log('Done');
}

main().catch(err => { console.error(err); process.exit(1); });
