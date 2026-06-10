// Fachada de dados de mercado. Roteia por priceMode do ativo:
//  - 'controlled' -> controlledProvider (motor próprio)
//  - 'mirror'     -> por assetType: 'stock' -> stockProvider (futuro), senão cryptoProvider (Binance)
const crypto = require('./cryptoProvider');
const controlled = require('./controlledProvider');
const Asset = require('../../models/Asset');

let stock = null;
try {
  stock = require('./stockProvider'); // só se existir (fase futura)
} catch (_) {
  stock = null;
}

function mirrorProvider(assetType) {
  if (assetType === 'stock') {
    if (!stock) throw new Error('Provedor de ações ainda não configurado');
    return stock;
  }
  return crypto;
}

// Resolve o provedor. priceMode/assetType podem vir do chamador (que já tem o ativo)
// ou são buscados pelo símbolo quando ausentes.
async function providerFor(symbol, assetType, priceMode) {
  if (priceMode === undefined) {
    const asset = await Asset.findOne({ symbol: String(symbol || '').toUpperCase() }).lean();
    priceMode = asset?.priceMode || 'mirror';
    assetType = asset?.assetType || assetType || 'crypto';
  }
  if (priceMode === 'controlled') return controlled;
  return mirrorProvider(assetType);
}

async function getQuote(symbol, assetType = 'crypto', priceMode) {
  return (await providerFor(symbol, assetType, priceMode)).getQuote(symbol);
}

async function getCandles(symbol, interval, limit, assetType = 'crypto', priceMode) {
  return (await providerFor(symbol, assetType, priceMode)).getCandles(symbol, interval, limit);
}

async function validateSymbol(symbol, assetType = 'crypto', priceMode) {
  return (await providerFor(symbol, assetType, priceMode)).validateSymbol(symbol);
}

// Busca combina mirror (cripto) + controlados.
async function search(query, assetType = 'crypto') {
  const [a, b] = await Promise.all([
    mirrorProvider(assetType).search(query).catch(() => []),
    controlled.search(query).catch(() => []),
  ]);
  return [...b, ...a]; // controlados primeiro
}

module.exports = { getQuote, getCandles, validateSymbol, search };
