const Admin = require('../models/Admin');
const jwt = require('jsonwebtoken');

// Helper to generate a 30-day token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'super_secret_crm_key_123_abc', {
    expiresIn: '30d'
  });
};

// Login user and send JWT token
const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate request body inputs
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please enter both email and password' });
    }

    // Query database for admin
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    // Compare input password with hashed db password
    const isMatch = await admin.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    // Respond with user credentials & authorization token
    return res.status(200).json({
      success: true,
      token: generateToken(admin._id),
      admin: {
        id: admin._id,
        email: admin.email
      }
    });
  } catch (error) {
    console.error('Login Error:', error.message);
    return res.status(500).json({ success: false, message: 'Server error during authentication' });
  }
};

module.exports = { loginAdmin };
