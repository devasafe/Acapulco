const Crypto = require('../models/Crypto');
const Setting = require('../models/Setting');

// Get all active cryptos (public)
exports.getAllCryptos = async (req, res) => {
  try {
    const cryptos = await Crypto.find({ isActive: true }).select('-__v');
    
    // ✓ Normalizar URLs de imagens e validar que existem
    const fs = require('fs');
    const path = require('path');
    
    const normalizedCryptos = cryptos.map(crypto => {
      const cryptoObj = crypto.toObject();
      if (cryptoObj.image) {
        // Garantir que começa com /
        if (!cryptoObj.image.startsWith('/')) {
          cryptoObj.image = '/' + cryptoObj.image;
        }
        // Validar que arquivo existe
        const filePath = path.join(__dirname, '../uploads', cryptoObj.image.replace('/uploads/', ''));
        if (!fs.existsSync(filePath)) {
          console.warn(`Arquivo de imagem não encontrado: ${filePath}`);
          cryptoObj.image = null; // Se não existe, retornar null
        }
      }
      return cryptoObj;
    });
    
    res.json(normalizedCryptos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Admin: Get all cryptos (both active and inactive)
exports.getAllCryptosAdmin = async (req, res) => {
  try {
    const cryptos = await Crypto.find().select('-__v').sort({ name: 1 });
    
    // ✓ Normalizar URLs de imagens
    const fs = require('fs');
    const path = require('path');
    
    const normalizedCryptos = cryptos.map(crypto => {
      const cryptoObj = crypto.toObject();
      if (cryptoObj.image) {
        // Garantir que começa com /
        if (!cryptoObj.image.startsWith('/')) {
          cryptoObj.image = '/' + cryptoObj.image;
        }
        // Validar que arquivo existe
        const filePath = path.join(__dirname, '../uploads', cryptoObj.image.replace('/uploads/', ''));
        if (!fs.existsSync(filePath)) {
          console.warn(`Arquivo de imagem não encontrado: ${filePath}`);
          cryptoObj.image = null;
        }
      }
      return cryptoObj;
    });
    
    res.json(normalizedCryptos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get crypto by ID
exports.getCryptoById = async (req, res) => {
  try {
    const crypto = await Crypto.findById(req.params.id).select('-__v');
    if (!crypto) return res.status(404).json({ error: 'Crypto not found' });
    
    // ✓ Normalizar URL de imagem
    const fs = require('fs');
    const path = require('path');
    
    const cryptoObj = crypto.toObject();
    if (cryptoObj.image) {
      if (!cryptoObj.image.startsWith('/')) {
        cryptoObj.image = '/' + cryptoObj.image;
      }
      const filePath = path.join(__dirname, '../uploads', cryptoObj.image.replace('/uploads/', ''));
      if (!fs.existsSync(filePath)) {
        console.warn(`Arquivo de imagem não encontrado: ${filePath}`);
        cryptoObj.image = null;
      }
    }
    
    res.json(cryptoObj);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Admin: Create new crypto investment
exports.createCrypto = async (req, res) => {
  try {
    let { name, symbol, price, plans, description } = req.body;
    
    // Se plans vem como string (FormData), fazer parse
    if (typeof plans === 'string') {
      try {
        plans = JSON.parse(plans);
      } catch (e) {
        return res.status(400).json({ error: 'Plans deve ser um JSON válido' });
      }
    }
    
    // Validação básica
    if (!name || !symbol) {
      return res.status(400).json({ error: 'Nome e símbolo são obrigatórios' });
    }

    if (!plans || !Array.isArray(plans) || plans.length === 0) {
      return res.status(400).json({ error: 'Pelo menos um plano é obrigatório' });
    }

    // Validar preço
    const priceNum = Number(price) || 0;
    if (priceNum < 0) {
      return res.status(400).json({ error: 'Preço não pode ser negativo' });
    }

    // Validar e converter planos
    const validPlans = [];
    for (const plan of plans) {
      const period = Number(plan.period);
      const yieldPercentage = Number(plan.yieldPercentage);
      
      if (!plan.period || !plan.yieldPercentage || isNaN(period) || isNaN(yieldPercentage)) {
        return res.status(400).json({ 
          error: `Plano inválido: período e rendimento devem ser números válidos. Recebido: period=${plan.period}, yield=${plan.yieldPercentage}` 
        });
      }

      if (period <= 0 || yieldPercentage < 0) {
        return res.status(400).json({ 
          error: 'Período deve ser maior que 0 e rendimento não pode ser negativo' 
        });
      }

      validPlans.push({
        period,
        yieldPercentage
      });
    }
    
    // Processar imagem se existir
    let imageUrl = null;
    if (req.file) {
      imageUrl = `/uploads/${req.file.filename}`;
    }
    
    const crypto = new Crypto({
      name,
      symbol: symbol.toUpperCase(),
      price: priceNum,
      plans: validPlans,
      description: description || '',
      image: imageUrl,
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
    let updateData = req.body;

    // Se há arquivo de imagem, adicionar URL da imagem aos dados de atualização
    if (req.file) {
      updateData.image = `/uploads/${req.file.filename}`;
    }

    // Se plans é string (vindo de FormData), fazer parse
    if (typeof updateData.plans === 'string') {
      try {
        updateData.plans = JSON.parse(updateData.plans);
      } catch (e) {
        return res.status(400).json({ error: 'Plans deve ser um JSON válido' });
      }
    }

    // Validar planos se fornecidos
    if (updateData.plans && Array.isArray(updateData.plans)) {
      const validPlans = [];
      for (const plan of updateData.plans) {
        const period = Number(plan.period);
        const yieldPercentage = Number(plan.yieldPercentage);
        
        if (!plan.period || !plan.yieldPercentage || isNaN(period) || isNaN(yieldPercentage)) {
          return res.status(400).json({ 
            error: `Plano inválido: período e rendimento devem ser números válidos` 
          });
        }

        if (period <= 0 || yieldPercentage < 0) {
          return res.status(400).json({ 
            error: 'Período deve ser maior que 0 e rendimento não pode ser negativo' 
          });
        }

        validPlans.push({
          period,
          yieldPercentage
        });
      }
      updateData.plans = validPlans;
    }

    const crypto = await Crypto.findByIdAndUpdate(req.params.id, updateData, { new: true });
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

// Seed database with sample cryptos (apenas para testes)
exports.seedCryptos = async (req, res) => {
  try {
    const cryptos = [
      {
        name: 'Bitcoin',
        symbol: 'BTC',
        isActive: true,
        plans: [
          { period: 30, yieldPercentage: 15 },
          { period: 60, yieldPercentage: 22 },
          { period: 90, yieldPercentage: 30 }
        ]
      },
      {
        name: 'Ethereum',
        symbol: 'ETH',
        isActive: true,
        plans: [
          { period: 30, yieldPercentage: 12 },
          { period: 60, yieldPercentage: 18 },
          { period: 90, yieldPercentage: 25 }
        ]
      },
      {
        name: 'Cardano',
        symbol: 'ADA',
        isActive: true,
        plans: [
          { period: 30, yieldPercentage: 10 },
          { period: 60, yieldPercentage: 15 },
          { period: 90, yieldPercentage: 20 }
        ]
      },
      {
        name: 'Solana',
        symbol: 'SOL',
        isActive: true,
        plans: [
          { period: 30, yieldPercentage: 14 },
          { period: 60, yieldPercentage: 20 },
          { period: 90, yieldPercentage: 28 }
        ]
      },
      {
        name: 'Ripple',
        symbol: 'XRP',
        isActive: true,
        plans: [
          { period: 30, yieldPercentage: 8 },
          { period: 60, yieldPercentage: 12 },
          { period: 90, yieldPercentage: 18 }
        ]
      }
    ];

    // Limpar dados antigos
    await Crypto.deleteMany({});

    // Inserir novos dados
    const created = await Crypto.insertMany(cryptos);
    res.json({
      message: `✅ ${created.length} criptos criadas com sucesso!`,
      cryptos: created
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
