const mongoose = require('mongoose');

const imovelSchema = new mongoose.Schema({
  title: String,
  description: String,
  price: Number,
  rentYield: Number,
  available: { type: Boolean, default: true },
  images: [{ type: String }],
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Imovel', imovelSchema);
