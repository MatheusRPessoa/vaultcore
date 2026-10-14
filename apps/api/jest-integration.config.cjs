
const unitConfig = require('./jest.config.cjs');

module.exports = {
  ...unitConfig,

  rootDir: __dirname,

  testMatch: [
    '<rootDir>/test/integration/**/*.integration-spec.ts',
  ],

  testTimeout: 30000,
  maxWorkers: 1,
};
