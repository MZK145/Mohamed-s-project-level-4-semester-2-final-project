const dotenv = require('dotenv');

// Load environment variables before Jest starts the test files.
dotenv.config({ path: process.env.NODE_ENV === 'test' ? '.env.test' : '.env' });

module.exports = {
  testEnvironment: 'node',
  testTimeout: 20000,
};
