// Curva de retenção (sobrevivência) a partir de usuários ativados.
// PURO: sem I/O. Trabalha com diferença de tempo em dias (DAY = 86400000 ms).

const DAY = 24 * 3600 * 1000;

// users: [{ createdAt: Date, lastTradeAt: Date }] (apenas ativados, com >= 1 trade)
// milestones: inteiros em dias (ex.: [0,1,7,14,30,60,90])
// now: Date de referência
// Retorna [{ day, retained, eligible, retainedCount }] na ordem dos milestones.
function computeRetention(users, milestones, now) {
  const nowMs = now.getTime();
  return milestones.map((day) => {
    const thresholdMs = day * DAY;
    let eligible = 0;
    let retainedCount = 0;
    for (const u of users) {
      const ageMs = nowMs - u.createdAt.getTime();
      if (ageMs >= thresholdMs) {
        eligible++;
        const lifespanMs = u.lastTradeAt.getTime() - u.createdAt.getTime();
        if (lifespanMs >= thresholdMs) retainedCount++;
      }
    }
    const retained = eligible === 0 ? 0 : Math.round((retainedCount / eligible) * 1000) / 10;
    return { day, retained, eligible, retainedCount };
  });
}

module.exports = { computeRetention };
