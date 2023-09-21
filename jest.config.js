const { pathsToModuleNameMapper } = require('ts-jest/utils');
const { compilerOptions } = require('./tsconfig');

module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  transform: {
    "^.+\\.(t|j)sx?$": "ts-jest"
  },
  transformIgnorePatterns: [
    "<rootDir>/node_modules/(?!lodash-es|lodash)"
  ],
  testMatch: [
    "<rootDir>/recipes-client/**/*.spec.+(ts|tsx|js)"
  ],
  moduleFileExtensions: [
    "ts",
    "tsx",
    "js"
  ],
  moduleNameMapper: {
    ...pathsToModuleNameMapper(compilerOptions.paths, { prefix: "<rootDir>/recipes-client/" })
  }
};
