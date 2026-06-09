// Fachada de dados de mercado. Roteia por assetType.
// Fase 1: cripto (Binance, grátis). Fase 3: ações via stockProvider (com chave de API).

const crypto = require('./cryptoProvider');

let stock = null;
try {
  // Carregado só se existir (Fase 3). Evita quebrar enquanto não houver provedor de ações.
  stock = require('./stockProvider');
} catch (_) {
  stock = null;
}

function providerFor(assetType) {
  if (assetType === 'stock') {
    if (!stock) throw new Error('Provedor de ações ainda não configurado');
    return stock;
  }
  return crypto; // default: cripto
}

async function getQuote(symbol, assetType = 'crypto') {
  return providerFor(assetType).getQuote(symbol);
}

async function getCandles(symbol, interval, limit, assetType = 'crypto') {
  return providerFor(assetType).getCandles(symbol, interval, limit);
}

async function validateSymbol(symbol, assetType = 'crypto') {
  return providerFor(assetType).validateSymbol(symbol);
}

async function search(query, assetType = 'crypto') {
  return providerFor(assetType).search(query);
}

module.exports = { getQuote, getCandles, validateSymbol, search };
