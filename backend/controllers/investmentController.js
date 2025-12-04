exports.sell = async (req, res) => {
  try {
    const { investmentId } = req.body;
    const investment = await Investment.findById(investmentId).populate('imovel');
    if (!investment) return res.status(404).json({ error: 'Investimento não encontrado' });
    const amount = investment.amount;
  await Investment.findByIdAndDelete(investmentId);
  // Creditar valor da venda no saldo do usuário
  const User = require('../models/User');
  const user = await User.findById(req.userId);
  user.wallet += amount;
  await user.save();
  // Registrar transação de venda
  const Transaction = require('../models/Transaction');
  await Transaction.create({ user: req.userId, type: 'sell', amount });
  res.json({ message: 'Investimento vendido com sucesso', amount });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
exports.invest = async (req, res) => {
  try {
    const { imovelId } = req.body;
    const Imovel = require('../models/Imovel');
    const imovel = await Imovel.findById(imovelId);
    if (!imovel) return res.status(404).json({ error: 'Imóvel não encontrado' });
    const amount = imovel.price;
    const User = require('../models/User');
    const user = await User.findById(req.userId);
    if (user.wallet < amount) {
      return res.status(400).json({ error: 'Saldo insuficiente para investir neste imóvel.' });
    }
    user.wallet -= amount;
    await user.save();
    const investment = new Investment({ user: req.userId, imovel: imovel._id, amount });
    await investment.save();
    // Registrar transação de compra
    const Transaction = require('../models/Transaction');
    await Transaction.create({ user: req.userId, type: 'buy', amount });
    res.status(201).json(investment);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
const Investment = require('../models/Investment');
const Imovel = require('../models/Imovel');

const User = require('../models/User');
exports.getUserInvestments = async (req, res) => {
  try {
    const investments = await Investment.find({ user: req.userId }).populate('imovel');
    let totalLucro = 0;
    const now = Date.now();
    const result = await Promise.all(investments.map(async inv => {
      // Tempo investido em horas
      const horasInvestidas = Math.floor((now - new Date(inv.createdAt).getTime()) / (1000 * 60 * 60));
      // Lucro por 24h
      const lucroPorDia = inv.amount * ((inv.imovel.rentYield || 0) / 100);
      // Lucro acumulado
      const diasInvestidos = Math.floor(horasInvestidas / 24);
      const lucroTotal = lucroPorDia * diasInvestidos;
      totalLucro += lucroTotal;
      return {
        _id: inv._id,
        imovel: inv.imovel.title,
        imovelId: inv.imovel._id,
        amount: inv.amount,
        rentYield: inv.imovel.rentYield,
        lucroPorDia,
        lucroTotal,
        horasInvestidas,
        diasInvestidos,
        createdAt: inv.createdAt
      };
    }));
  // Não sobrescrever saldo da carteira aqui, pois já é atualizado por depósitos, investimentos e rendimentos
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
