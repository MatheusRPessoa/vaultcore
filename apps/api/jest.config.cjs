
/** @type {import('jest').Config} */
module.exports = {
  rootDir: '.',
  testEnvironment: 'node',

  testMatch: ['<rootDir>/src/**/*.spec.ts'],

  moduleFileExtensions: ['ts', 'js', 'json'],

  extensionsToTreatAsEsm: ['.ts'],

  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        useESM: true,
        tsconfig: {
          target: 'ES2022',
          module: 'ESNext',
          moduleResolution: 'Bundler',
          isolatedModules: true,
          experimentalDecorators: true,
          emitDecoratorMetadata: true,
          esModuleInterop: true,
        },
      },
    ],
  },

  clearMocks: true,
  verbose: true,
};
