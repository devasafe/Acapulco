// Faz poll dos preços dos ativos da watchlist e transmite via Socket.io.
// Evento: 'price' { symbol, price, changePercent }
const Asset = require('../models/Asset');
const market = require('../services/marketData');
const { getIO } = require('./socket');

const INTERVAL_MS = Number(process.env.PRICE_POLL_MS) || 5000;

async function tick() {
  let io;
  try {
    io = getIO();
  } catch (_) {
    return; // socket ainda não inicializado
  }
  try {
    const assets = await Asset.find({ isActive: true }).lean();
    await Promise.all(
      assets.map(async (a) => {
        try {
          const q = await market.getQuote(a.symbol, a.assetType);
          io.emit('price', {
            symbol: a.symbol,
            price: q.price,
            changePercent: q.changePercent,
          });
        } catch (_) {
          // ignora falha pontual de um símbolo
        }
      })
    );
  } catch (_) {
    // ignora falha do ciclo
  }
}

function start() {
  setInterval(tick, INTERVAL_MS);
  console.log(`Price broadcaster ativo (a cada ${INTERVAL_MS}ms)`);
}

module.exports = { start };
