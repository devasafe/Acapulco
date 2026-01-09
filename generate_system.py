#!/usr/bin/env python3
"""
Generator Script for Acapulco Investment Platform
Generates all backend controllers, routes, and frontend pages
"""

import os
import sys

BASE_PATH = "d:\\PROJETOS\\Acapulco"

# ==================== BACKEND CONTROLLERS ====================

CRYPTO_CONTROLLER = '''const Crypto = require('../models/Crypto');
const Setting = require('../models/Setting');

// Get all active cryptos
exports.getAllCryptos = async (req, res) => {
  try {
    const cryptos = await Crypto.find({ isActive: true }).select('-__v');
    res.json(cryptos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get crypto by ID
exports.getCryptoById = async (req, res) => {
  try {
    const crypto = await Crypto.findById(req.params.id).select('-__v');
    if (!crypto) return res.status(404).json({ error: 'Crypto not found' });
    res.json(crypto);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Admin: Create new crypto investment
exports.createCrypto = async (req, res) => {
  try {
    const { name, symbol, period, yieldPercentage } = req.body;
    if (!name || !symbol || !period || !yieldPercentage) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    const crypto = new Crypto({
      name,
      symbol: symbol.toUpperCase(),
      period: Number(period),
      yieldPercentage: Number(yieldPercentage),
      isActive: true
    });
    
    await crypto.save();
    res.status(201).json(crypto);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Admin: Update crypto
exports.updateCrypto = async (req, res) => {
  try {
    const crypto = await Crypto.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!crypto) return res.status(404).json({ error: 'Crypto not found' });
    res.json(crypto);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Admin: Delete crypto
exports.deleteCrypto = async (req, res) => {
  try {
    const crypto = await Crypto.findByIdAndDelete(req.params.id);
    if (!crypto) return res.status(404).json({ error: 'Crypto not found' });
    res.json({ message: 'Crypto deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Admin: Toggle crypto active status
exports.toggleCryptoStatus = async (req, res) => {
  try {
    const crypto = await Crypto.findById(req.params.id);
    if (!crypto) return res.status(404).json({ error: 'Crypto not found' });
    
    crypto.isActive = !crypto.isActive;
    await crypto.save();
    res.json(crypto);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
'''

INVESTMENT_CONTROLLER = '''const Investment = require('../models/Investment');
const User = require('../models/User');
const Transaction = require('../models/Transaction');
const Crypto = require('../models/Crypto');

// Get user's investments
exports.getMyInvestments = async (req, res) => {
  try {
    const investments = await Investment.find({ userId: req.user.id })
      .populate('cryptoId', 'name symbol period yieldPercentage')
      .sort('-createdAt');
    res.json(investments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Create investment (buy crypto)
exports.createInvestment = async (req, res) => {
  try {
    const { cryptoId, amount } = req.body;
    
    if (!cryptoId || !amount) {
      return res.status(400).json({ error: 'Missing cryptoId or amount' });
    }

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    
    if (user.wallet < amount) {
      return res.status(400).json({ error: 'Insufficient balance' });
    }

    const crypto = await Crypto.findById(cryptoId);
    if (!crypto) return res.status(404).json({ error: 'Crypto not found' });

    const expectedProfit = (amount * crypto.yieldPercentage / 100).toFixed(2);
    
    const investment = new Investment({
      userId: req.user.id,
      type: 'crypto',
      cryptoId,
      cryptoName: crypto.name,
      amount,
      investmentPlan: crypto.period,
      yieldPercentage: crypto.yieldPercentage,
      expectedProfit,
      status: 'active'
    });

    await investment.save();

    // Deduct from wallet
    user.wallet -= amount;
    await user.save();

    // Record transaction
    const transaction = new Transaction({
      userId: req.user.id,
      type: 'investment',
      amount,
      description: `Investimento em ${crypto.name}`,
      relatedInvestment: investment._id
    });
    await transaction.save();

    res.status(201).json(investment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Withdraw/resgate investment
exports.withdrawInvestment = async (req, res) => {
  try {
    const { investmentId } = req.body;
    
    const investment = await Investment.findById(investmentId);
    if (!investment) return res.status(404).json({ error: 'Investment not found' });
    
    if (investment.userId.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    if (investment.status !== 'active') {
      return res.status(400).json({ error: 'Investment not active' });
    }

    const user = await User.findById(req.user.id);
    const totalReturn = parseFloat(investment.amount) + parseFloat(investment.expectedProfit);
    
    user.wallet += totalReturn;
    await user.save();

    investment.status = 'withdrawn';
    await investment.save();

    // Record withdrawal transaction
    const transaction = new Transaction({
      userId: req.user.id,
      type: 'withdrawal',
      amount: totalReturn,
      description: `Resgate do investimento em ${investment.cryptoName}`,
      relatedInvestment: investment._id
    });
    await transaction.save();

    res.json({ message: 'Investment withdrawn', totalReturn });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get dashboard stats
exports.getDashboardStats = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const user = await User.findById(userId);
    const investments = await Investment.find({ userId });
    const transactions = await Transaction.find({ userId });

    const activeInvestments = investments.filter(i => i.status === 'active');
    const totalInvested = activeInvestments.reduce((sum, i) => sum + i.amount, 0);
    const totalExpectedProfit = activeInvestments.reduce((sum, i) => sum + parseFloat(i.expectedProfit || 0), 0);

    const stats = {
      wallet: user.wallet,
      totalInvested,
      totalExpectedProfit: totalExpectedProfit.toFixed(2),
      activeInvestments: activeInvestments.length,
      completedInvestments: investments.filter(i => i.status === 'completed').length,
      withdrawnInvestments: investments.filter(i => i.status === 'withdrawn').length,
      recentTransactions: transactions.slice(0, 10).reverse()
    };

    res.json(stats);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
'''

ADMIN_CONTROLLER = '''const User = require('../models/User');
const Transaction = require('../models/Transaction');
const Setting = require('../models/Setting');
const Investment = require('../models/Investment');

// Get all users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('name email wallet referralCode createdAt').lean();
    res.json(users);
  } catch (err) {
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
'''

# ==================== BACKEND ROUTES ====================

AUTH_ROUTES = '''const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/register', authController.register);
router.post('/register-with-referral', authController.registerWithReferral);
router.post('/login', authController.login);

module.exports = router;
'''

CRYPTO_ROUTES = '''const express = require('express');
const router = express.Router();
const cryptoController = require('../controllers/cryptoController');
const { authenticateToken } = require('../middleware/auth');
const isAdmin = require('../middleware/isAdmin');

// Public routes
router.get('/', cryptoController.getAllCryptos);
router.get('/:id', cryptoController.getCryptoById);

// Admin routes
router.post('/', authenticateToken, isAdmin, cryptoController.createCrypto);
router.put('/:id', authenticateToken, isAdmin, cryptoController.updateCrypto);
router.delete('/:id', authenticateToken, isAdmin, cryptoController.deleteCrypto);
router.patch('/:id/toggle', authenticateToken, isAdmin, cryptoController.toggleCryptoStatus);

module.exports = router;
'''

INVESTMENT_ROUTES = '''const express = require('express');
const router = express.Router();
const investmentController = require('../controllers/investmentController');
const { authenticateToken } = require('../middleware/auth');

router.get('/', authenticateToken, investmentController.getMyInvestments);
router.post('/', authenticateToken, investmentController.createInvestment);
router.post('/withdraw', authenticateToken, investmentController.withdrawInvestment);
router.get('/stats', authenticateToken, investmentController.getDashboardStats);

module.exports = router;
'''

ADMIN_ROUTES = '''const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { authenticateToken } = require('../middleware/auth');
const isAdmin = require('../middleware/isAdmin');

// Admin middleware
const adminAuth = [authenticateToken, isAdmin];

router.get('/users', ...adminAuth, adminController.getAllUsers);
router.get('/stats', ...adminAuth, adminController.getAdminStats);
router.get('/referral-settings', ...adminAuth, adminController.getReferralSettings);
router.put('/referral-settings', ...adminAuth, adminController.updateReferralSettings);
router.get('/referral-profits', ...adminAuth, adminController.getReferralProfits);

module.exports = router;
'''

USER_ROUTES = '''const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authenticateToken } = require('../middleware/auth');

router.get('/profile', authenticateToken, userController.getProfile);
router.put('/profile', authenticateToken, userController.updateProfile);
router.get('/referrals', authenticateToken, userController.getReferrals);
router.get('/dashboard-stats', authenticateToken, userController.getDashboardStats);

module.exports = router;
'''

WALLET_ROUTES = '''const express = require('express');
const router = express.Router();
const walletController = require('../controllers/walletController');
const { authenticateToken } = require('../middleware/auth');

router.get('/', authenticateToken, walletController.getWallet);
router.post('/deposit', authenticateToken, walletController.deposit);
router.post('/withdraw', authenticateToken, walletController.withdraw);

module.exports = router;
'''

# Files to generate
files_to_create = [
    (f"{BASE_PATH}\\backend\\controllers\\cryptoController.js", CRYPTO_CONTROLLER),
    (f"{BASE_PATH}\\backend\\controllers\\investmentController.js", INVESTMENT_CONTROLLER),
    (f"{BASE_PATH}\\backend\\controllers\\adminController.js", ADMIN_CONTROLLER),
    (f"{BASE_PATH}\\backend\\routes\\authRoutes.js", AUTH_ROUTES),
    (f"{BASE_PATH}\\backend\\routes\\cryptoRoutes.js", CRYPTO_ROUTES),
    (f"{BASE_PATH}\\backend\\routes\\investmentRoutes.js", INVESTMENT_ROUTES),
    (f"{BASE_PATH}\\backend\\routes\\adminRoutes.js", ADMIN_ROUTES),
    (f"{BASE_PATH}\\backend\\routes\\userRoutes.js", USER_ROUTES),
    (f"{BASE_PATH}\\backend\\routes\\walletRoutes.js", WALLET_ROUTES),
]

def create_files():
    for filepath, content in files_to_create:
        os.makedirs(os.path.dirname(filepath), exist_ok=True)
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"✅ Created: {filepath}")

if __name__ == "__main__":
    create_files()
    print("\n✅ All backend files generated successfully!")
