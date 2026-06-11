const EPS = 1e-9;
const sign = (n) => (n > 0 ? 1 : n < 0 ? -1 : 0);

// Aplica uma ordem (buy/sell) de `units` unidades a `price` numa posição netting.
// pos: { net (assinado: + long / - short), avgEntry, reserved (notional travado em USD) }.
// Retorna { net, avgEntry, reserved, realizedPnl, cashDelta } (cashDelta: <0 reserva, >0 devolve).
function applyNetting(pos, side, units, price) {
  const dSign = side === 'buy' ? 1 : -1;
  let net = pos.net || 0;
  let avgEntry = pos.avgEntry || 0;
  let reserved = pos.reserved || 0;
  let realizedPnl = 0;
  let cashDelta = 0;

  if (net === 0 || sign(net) === dSign) {
    // mesma direção: aumenta a posição
    const newAbs = Math.abs(net) + units;
    avgEntry = (Math.abs(net) * avgEntry + units * price) / newAbs;
    reserved += units * price;
    cashDelta -= units * price;
    net += dSign * units;
  } else {
    // direção oposta: fecha (parcial/total) a posição atual
    const dir = sign(net); // +1 fechando long, -1 fechando short
    const closeUnits = Math.min(units, Math.abs(net));
    realizedPnl = dir * (price - avgEntry) * closeUnits;
    const released = closeUnits * avgEntry;
    reserved -= released;
    cashDelta += released + realizedPnl;
    net += -dir * closeUnits;

    const remaining = units - closeUnits;
    if (remaining > EPS) {
      // cruzou o zero: abre o restante no sentido novo
      avgEntry = price;
      reserved += remaining * price;
      cashDelta -= remaining * price;
      net = dSign * remaining;
    }
  }

  if (Math.abs(net) < EPS) { net = 0; avgEntry = 0; reserved = 0; }
  return { net, avgEntry, reserved, realizedPnl, cashDelta };
}

module.exports = { applyNetting, sign };
