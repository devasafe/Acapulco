const User = require('../models/User');
const Transaction = require('../models/Transaction');
const Investment = require('../models/Investment');

/**
 * Atualiza os totais do usuário (investido, lucro realizado, sacado, bônus de referência)
 */
exports.updateUserStats = async (userId) => {
  try {
    const transactions = await Transaction.find({ userId });
    
    // Calcular total investido
    const totalInvested = transactions
      .filter(t => t.type === 'investment')
      .reduce((sum, t) => sum + (Number(t.amount) || 0), 0);
    
    // Calcular total de lucro realizado (redemption + referral_bonus)
    const totalRealizedProfit = transactions
      .filter(t => t.type === 'redemption' || t.type === 'referral_bonus')
      .reduce((sum, t) => sum + (Number(t.amount) || 0), 0);
    
    // Calcular total sacado (withdrawal)
    const totalWithdrawn = transactions
      .filter(t => t.type === 'withdrawal')
      .reduce((sum, t) => sum + (Number(t.amount) || 0), 0);
    
    // Calcular total de bônus por referência
    const totalReferralBonus = transactions
      .filter(t => t.type === 'referral_bonus')
      .reduce((sum, t) => sum + (Number(t.amount) || 0), 0);
    
    // Atualizar usuário
    const user = await User.findByIdAndUpdate(
      userId,
      {
        totalInvested,
        totalRealizedProfit,
        totalWithdrawn,
        totalReferralBonus,
        updatedAt: new Date()
      },
      { new: true }
    );
    
    return user;
  } catch (error) {
    console.error('Erro ao atualizar stats do usuário:', error);
    throw error;
  }
};
