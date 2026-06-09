const Setting = require('../models/Setting');

const DEFAULTS = {
  starting_balance: 100000, // saldo virtual inicial (fictício)
};

async function getSetting(key, fallback) {
  const doc = await Setting.findOne({ key });
  if (doc && doc.value !== undefined && doc.value !== null) return doc.value;
  return fallback !== undefined ? fallback : DEFAULTS[key];
}

async function setSetting(key, value) {
  return Setting.findOneAndUpdate(
    { key },
    { value, updatedAt: Date.now() },
    { upsert: true, new: true }
  );
}

async function getStartingBalance() {
  return Number(await getSetting('starting_balance', DEFAULTS.starting_balance));
}

module.exports = { getSetting, setSetting, getStartingBalance, DEFAULTS };
