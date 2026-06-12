// Provedor de dados de mercado de CRIPTO via API pública da Binance (grátis, sem chave).
// Símbolos no formato par, ex.: BTCUSDT, ETHUSDT, SOLUSDT.
// Docs: https://binance-docs.github.io/apidocs/spot/en/

// data-api.binance.vision = mirror público de market-data da Binance, SEM geo-bloqueio
// (api.binance.com bloqueia IPs de datacenter US, ex.: Render). Mesma API /api/v3/*.
const BASE = process.env.BINANCE_BASE || 'https://data-api.binance.vision';

// Cache simples em memória para respeitar rate limit.
let exchangeSymbolsCache = { at: 0, symbols: [] };
const SYMBOLS_TTL = 6 * 60 * 60 * 1000; // 6h

async function binanceGet(path) {
  const res = await fetch(`${BASE}${path}`);
  if (!res.ok) {
    const body = await res.text().catch(() => '');
    throw new Error(`Binance ${res.status}: ${body.slice(0, 200)}`);
  }
  return res.json();
}

function normalizeSymbol(symbol) {
  return String(symbol || '').trim().toUpperCase();
}

// Cotação atual + variação 24h
async function getQuote(symbol) {
  const s = normalizeSymbol(symbol);
  const data = await binanceGet(`/api/v3/ticker/24hr?symbol=${s}`);
  return {
    symbol: s,
    price: Number(data.lastPrice),
    changePercent: Number(data.priceChangePercent),
    high: Number(data.highPrice),
    low: Number(data.lowPrice),
    volume: Number(data.volume),
  };
}

// Candles (OHLC) para o gráfico estilo bolsa
async function getCandles(symbol, interval = '1h', limit = 200) {
  const s = normalizeSymbol(symbol);
  const data = await binanceGet(
    `/api/v3/klines?symbol=${s}&interval=${interval}&limit=${limit}`
  );
  // Cada item: [openTime, open, high, low, close, volume, closeTime, ...]
  return data.map((k) => ({
    time: k[0],
    open: Number(k[1]),
    high: Number(k[2]),
    low: Number(k[3]),
    close: Number(k[4]),
    volume: Number(k[5]),
  }));
}

// Valida se um símbolo existe e está sendo negociado
async function validateSymbol(symbol) {
  const s = normalizeSymbol(symbol);
  try {
    const info = await binanceGet(`/api/v3/exchangeInfo?symbol=${s}`);
    const sym = info?.symbols?.[0];
    return !!sym && sym.status === 'TRADING';
  } catch (_) {
    return false;
  }
}

// Lista de símbolos negociáveis (cacheada) para a busca
async function loadSymbols() {
  const now = Date.now();
  if (now - exchangeSymbolsCache.at < SYMBOLS_TTL && exchangeSymbolsCache.symbols.length) {
    return exchangeSymbolsCache.symbols;
  }
  const info = await binanceGet('/api/v3/exchangeInfo');
  const symbols = (info.symbols || [])
    .filter((s) => s.status === 'TRADING' && s.quoteAsset === 'USDT')
    .map((s) => ({ symbol: s.symbol, base: s.baseAsset, quote: s.quoteAsset }));
  exchangeSymbolsCache = { at: now, symbols };
  return symbols;
}

// Busca por símbolo ou nome do ativo base (ex.: "btc" -> BTCUSDT)
async function search(query, limit = 20) {
  const q = normalizeSymbol(query);
  if (!q) return [];
  const symbols = await loadSymbols();
  return symbols
    .filter((s) => s.symbol.includes(q) || s.base.includes(q))
    .slice(0, limit)
    .map((s) => ({ symbol: s.symbol, name: `${s.base}/${s.quote}`, assetType: 'crypto' }));
}

module.exports = { getQuote, getCandles, validateSymbol, search };
