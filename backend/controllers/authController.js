const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// POST /api/auth/signup
exports.signup = async (req, res) => {
  const { name, email, password } = req.body;

  // ✅ Add this validation
  if (!name || !email || !password) {
    return res.status(400).json({ msg: 'All fields are required' });
  }

  try {
    let user = await User.findOne({ email });
    console.log('Received signup request body:', req.body);
    if (user) return res.status(400).json({ msg: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);

    user = new User({ name, email, password: hashedPassword });
    await user.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '1d'
    });

    res.status(201).json({ token, user: { id: user._id, name, email } });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};


// POST /api/auth/login
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '1d'
    });

    res.json({ token, user: { id: user._id, name: user.name, email } });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};
