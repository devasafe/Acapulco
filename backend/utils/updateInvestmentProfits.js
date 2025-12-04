const Investment = require('../models/Investment');
const Imovel = require('../models/Imovel');
const User = require('../models/User');
const Transaction = require('../models/Transaction');

async function updateProfitsForAllUsers() {
  const investments = await Investment.find({}).populate('imovel user');
  const userProfits = {};
  const now = Date.now();
  for (const inv of investments) {
    const horasInvestidas = Math.floor((now - new Date(inv.createdAt).getTime()) / (1000 * 60 * 60));
    const lucroPorDia = inv.amount * ((inv.imovel.rentYield || 0) / 100);
    const diasInvestidos = Math.floor(horasInvestidas / 24);
    const lucroTotal = lucroPorDia * diasInvestidos;
    if (!userProfits[inv.user._id]) userProfits[inv.user._id] = 0;
    userProfits[inv.user._id] += lucroTotal;
    // Registrar transação de rendimento (yield) se houver lucro
    if (lucroTotal > 0) {
      await Transaction.create({ user: inv.user._id, type: 'yield', amount: lucroTotal });
    }

    // Lucro por indicação: indicante recebe 10% do lucro do indicado
    const user = await User.findById(inv.user._id);
    if (user.indicadoPor) {
      if (!userProfits[user.indicadoPor]) userProfits[user.indicadoPor] = 0;
      const bonus = lucroTotal * 0.10;
      userProfits[user.indicadoPor] += bonus;
      if (bonus > 0) {
        await Transaction.create({ user: user.indicadoPor, type: 'referral', amount: bonus });
      }
    }
  }
  // Atualiza saldo apenas com lucros acumulados, saldo parado não rende
  for (const userId in userProfits) {
    const user = await User.findById(userId);
    user.wallet += userProfits[userId];
    await user.save();
  }
}

module.exports = updateProfitsForAllUsers;
