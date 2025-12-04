// ...existing code...
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: { type: String, default: 'user' },
  isAdmin: { type: Boolean, default: false },
  wallet: { type: Number, default: 0 },
  referrals: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  indicadoPor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  indicadoPorName: { type: String, default: null },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('User', userSchema);
