import { pathsToModuleNameMapper } from 'ts-jest';

export const preset = "ts-jest";
export const testEnvironment = "node";
export const transform = {
  "^.+\\.(t|j)sx?$": "ts-jest"
};
export const transformIgnorePatterns = [
  "<rootDir>/node_modules/(?!lodash-es|lodash)"
];
export const testMatch = [
  "<rootDir>/recipes-client/**/*.spec.+(ts|tsx|js)"
];
export const moduleFileExtensions = [
  "ts",
  "tsx",
  "js"
];
export const moduleDirectories = ['node_modules', '.'];
export const moduleNameMapper = {
  ...pathsToModuleNameMapper([], { prefix: "<rootDir>/recipes-client/" })
};
