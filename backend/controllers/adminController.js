const User = require('../models/User');
const Transaction = require('../models/Transaction');
const Setting = require('../models/Setting');
const Investment = require('../models/Investment');

// Get all users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select('name email wallet totalInvested totalRealizedProfit totalReferralBonus referralCode createdAt')
      .lean();
    
    // Enriquecer com dados de transações se necessário
    const enrichedUsers = await Promise.all(users.map(async (user) => {
      try {
        // Buscar profit realizado
        const profitTransactions = await Transaction.find({
          userId: user._id,
          type: 'profit'
        }).lean();
        
        const realizedProfit = profitTransactions.reduce((sum, t) => sum + (Number(t.amount) || 0), 0);

        // Buscar saques realizados
        const withdrawTransactions = await Transaction.find({
          userId: user._id,
          type: 'withdrawal'
        }).lean();
        
        const totalWithdrawn = withdrawTransactions.reduce((sum, t) => sum + (Number(t.amount) || 0), 0);

        // Buscar depósitos realizados
        const depositTransactions = await Transaction.find({
          userId: user._id,
          type: 'deposit'
        }).lean();
        
        const totalDeposited = depositTransactions.reduce((sum, t) => sum + (Number(t.amount) || 0), 0);
        
        return {
          ...user,
          walletBalance: Number(user.wallet) || 0,
          totalInvested: Number(user.totalInvested) || 0,
          profit: realizedProfit,  // SEMPRE use o total de transactions, não fallback
          totalReferralBonus: Number(user.totalReferralBonus) || 0,
          totalWithdrawn: totalWithdrawn,
          totalDeposited: totalDeposited
        };
      } catch (userErr) {
        console.error(`Erro ao processar usuário ${user._id}:`, userErr);
        return {
          ...user,
          walletBalance: Number(user.wallet) || 0,
          totalInvested: Number(user.totalInvested) || 0,
          profit: 0,  // Se houver erro, retorna 0 (não temos transactions válidas)
          totalReferralBonus: Number(user.totalReferralBonus) || 0,
          totalWithdrawn: 0,
          totalDeposited: 0
        };
      }
    }));

    res.json(enrichedUsers);
  } catch (err) {
    console.error('Erro em getAllUsers:', err);
    res.status(500).json({ error: err.message });
  }
};

// Get admin dashboard stats
exports.getAdminStats = async (req, res) => {
  try {
    const users = await User.find();
    const transactions = await Transaction.find();
    const investments = await Investment.find();

    const totalDeposits = transactions
      .filter(t => t.type === 'deposit')
      .reduce((sum, t) => sum + t.amount, 0);

    const totalWithdrawals = transactions
      .filter(t => t.type === 'withdrawal')
      .reduce((sum, t) => sum + t.amount, 0);

    const totalReferralBonuses = transactions
      .filter(t => t.type === 'referral_bonus')
      .reduce((sum, t) => sum + t.amount, 0);

    const stats = {
      totalUsers: users.length,
      totalDeposits,
      totalWithdrawals,
      totalReferralBonuses,
      netFlow: totalDeposits - totalWithdrawals,
      totalTransactions: transactions.length,
      activeInvestments: investments.filter(i => i.status === 'active').length,
      totalInvested: investments.reduce((sum, i) => sum + i.amount, 0)
    };

    res.json(stats);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get referral settings
exports.getReferralSettings = async (req, res) => {
  try {
    let setting = await Setting.findOne({ key: 'referral_percentage' });
    if (!setting) {
      setting = new Setting({ key: 'referral_percentage', value: '10' });
      await setting.save();
    }
    res.json({ referralPercentage: Number(setting.value) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update referral settings
exports.updateReferralSettings = async (req, res) => {
  try {
    const { referralPercentage } = req.body;
    
    if (!referralPercentage || referralPercentage < 0 || referralPercentage > 100) {
      return res.status(400).json({ error: 'Invalid referral percentage' });
    }

    let setting = await Setting.findOne({ key: 'referral_percentage' });
    if (!setting) {
      setting = new Setting({ key: 'referral_percentage' });
    }
    
    setting.value = String(referralPercentage);
    await setting.save();
    
    res.json({ message: 'Updated', referralPercentage });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get referral profits
exports.getReferralProfits = async (req, res) => {
  try {
    const users = await User.find().select('name email wallet referralCode').lean();
    
    const profits = await Promise.all(users.map(async (user) => {
      const referralBonuses = await Transaction.find({
        userId: user._id,
        type: 'referral_bonus'
      });
      
      const totalBonus = referralBonuses.reduce((sum, t) => sum + t.amount, 0);
      return {
        userId: user._id,
        name: user.name,
        email: user.email,
        referralCode: user.referralCode,
        totalBonusEarned: totalBonus,
        bonusCount: referralBonuses.length
      };
    }));

    res.json(profits.filter(p => p.totalBonusEarned > 0));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get referral bonus details
exports.getReferralBonusDetails = async (req, res) => {
  try {
    // Get all referral bonus transactions
    const bonusTransactions = await Transaction.find({ type: 'referral_bonus' }).populate('userId', 'name email referralCode');
    
    // Enrich with referrer info (who was referred)
    const details = await Promise.all(bonusTransactions.map(async (tx) => {
      // Parse the description to get the name of who was referred
      // Format: "Bônus de referência - João fez primeiro depósito de R$ 1000.00"
      let referredName = 'Desconhecido';
      
      if (tx.description && tx.description.includes(' - ')) {
        const parts = tx.description.split(' - ');
        if (parts.length >= 2) {
          // Remove " fez primeiro depósito de R$..." part
          const nameWithExtra = parts[1];
          referredName = nameWithExtra.split(' fez')[0].trim();
        }
      }
      
      // Find the referred user to get their email
      const referredUser = await User.findOne({ name: referredName });
      
      return {
        transactionId: tx._id,
        referrer: {
          name: tx.userId.name,
          email: tx.userId.email,
          referralCode: tx.userId.referralCode
        },
        referred: {
          name: referredName,
          email: referredUser ? referredUser.email : 'Não encontrado',
          createdAt: referredUser ? referredUser.createdAt : null
        },
        bonusAmount: tx.amount,
        description: tx.description,
        bonusDate: tx.createdAt
      };
    }));

    res.json(details.sort((a, b) => b.bonusDate - a.bonusDate));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
