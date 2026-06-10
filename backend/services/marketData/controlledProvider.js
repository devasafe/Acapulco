// backend/services/marketData/controlledProvider.js
// Provedor de mercado para ativos priceMode='controlled'. Não chama API externa:
// lê control.currentPrice (Asset) e os candles persistidos (PriceCandle).
const Asset = require('../../models/Asset');
const candleStore = require('../priceEngine/candleStore');

// Converte '15m' / '1h' / '4h' / '1d' em minutos (base de agregação = 5min).
function intervalToMinutes(interval) {
  const m = String(interval || '1h').match(/^(\d+)([mhd])$/i);
  if (!m) return 60;
  const n = Number(m[1]);
  const unit = m[2].toLowerCase();
  if (unit === 'm') return n;
  if (unit === 'h') return n * 60;
  return n * 60 * 24; // 'd'
}

async function getQuote(symbol) {
  const s = String(symbol || '').toUpperCase();
  const asset = await Asset.findOne({ symbol: s, priceMode: 'controlled' });
  if (!asset || !asset.control?.currentPrice) throw new Error(`Ativo controlado não encontrado: ${s}`);
  const price = asset.control.currentPrice;
  const changePercent = await candleStore.change24h(asset._id, price);
  return { symbol: s, price, changePercent, high: price, low: price, volume: 0 };
}

async function getCandles(symbol, interval = '1h', limit = 200) {
  const s = String(symbol || '').toUpperCase();
  const asset = await Asset.findOne({ symbol: s, priceMode: 'controlled' });
  if (!asset) throw new Error(`Ativo controlado não encontrado: ${s}`);
  return candleStore.getCandles(asset._id, intervalToMinutes(interval), limit);
}

async function validateSymbol(symbol) {
  const s = String(symbol || '').toUpperCase();
  const asset = await Asset.findOne({ symbol: s, priceMode: 'controlled' });
  return !!asset;
}

async function search(query, limit = 20) {
  const q = String(query || '').toUpperCase();
  const assets = await Asset.find({ priceMode: 'controlled', isActive: true }).lean();
  return assets
    .filter((a) => a.symbol.includes(q) || (a.name || '').toUpperCase().includes(q))
    .slice(0, limit)
    .map((a) => ({ symbol: a.symbol, name: a.name, assetType: a.assetType }));
}

module.exports = { getQuote, getCandles, validateSymbol, search };
