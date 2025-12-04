const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
  try {
    const { name, email, password, isAdmin, indicadoPor } = req.body;
    // Verifica se já existe usuário com mesmo nome ou email
    const existingName = await User.findOne({ name });
    if (existingName) {
      return res.status(400).json({ error: 'Já existe um usuário com esse nome. Por favor, escolha outro nome para continuar.' });
    }
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ error: 'Já existe uma conta com esse e-mail. Tente fazer login ou utilize outro e-mail para se cadastrar.' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    let indicadoPorName = null;
    if (indicadoPor) {
      const indicante = await User.findById(indicadoPor);
      indicadoPorName = indicante ? indicante.name : null;
    }
    const user = new User({ name, email, password: hashedPassword, isAdmin: !!isAdmin, indicadoPor: indicadoPor || null, indicadoPorName });
    await user.save();
    // Se houver indicadoPor, adiciona o novo usuário ao array referrals do indicante
    if (indicadoPor) {
      await User.findByIdAndUpdate(indicadoPor, { $push: { referrals: user._id } });
    }
    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: 'User not found' });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ error: 'Invalid credentials' });
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
    const userObj = user.toObject();
    let indicadoPor = null;
    if (userObj.indicadoPor) {
      const indicante = await User.findById(userObj.indicadoPor);
      indicadoPor = indicante ? indicante.name : null;
    }
    res.json({ token, user: { ...userObj, isAdmin: user.isAdmin, indicadoPorName: indicadoPor } });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
