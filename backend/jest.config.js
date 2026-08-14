module.exports = {
  // Load environment variables before tests
  setupFiles: ['dotenv/config'],

  // Optional: specify test environment
  testEnvironment: 'node',

  // Optional: increase default timeout
  testTimeout: 20000,
};
