const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // 1. Vérifier si l'utilisateur existe
    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
    }
    
    // 2. Vérifier le mot de passe
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
    }
    
    // 3. Générer un token JWT
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );
    
    res.json({ token, user: { id: user.id, email: user.email, username: user.username } });
  } catch (error) {
    res.status(500).json({ message: 'Erreur de serveur' });
  }
};

exports.register = async (req, res) => {
  try {
    const { email, password, username } = req.body;
    
    // 1. Vérifier si l'email existe déjà
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: 'Email déjà utilisé' });
    }
    
    // 2. Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 12);
    
    // 3. Créer l'utilisateur
    const newUser = await User.create({
      email,
      password: hashedPassword,
      username
    });
    
    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ message: 'Erreur de serveur' });
  }
};