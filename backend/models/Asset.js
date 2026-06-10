const mongoose = require('mongoose');

const assetSchema = new mongoose.Schema({
  symbol: { type: String, required: true, unique: true, uppercase: true, trim: true },
  name: { type: String, required: true },
  assetType: { type: String, enum: ['crypto', 'stock'], default: 'crypto' },
  logo: { type: String },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Asset', assetSchema);
