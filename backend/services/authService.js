const Admin = require('../models/Admin');
const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.login = async ({ email, password }) => {
  const admin = await Admin.findOne({ email });
  const user = await User.findOne({ email });
  const account = admin || user;

  if (!account) throw new Error('Account not found');

  const match = await bcrypt.compare(password, account.password);
  if (!match) throw new Error('Invalid credentials');

  const role = admin ? 'admin' : 'user';
  const token = jwt.sign({ id: account._id, role }, process.env.JWT_SECRET, { expiresIn: '1h' });

  return { token, role };
};
