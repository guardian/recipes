module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: ['./tsconfig.eslint.json'],
    ecmaFeatures: {
      jsx: true
    },
    ecmaVersion: 2018,
    sourceType: 'module'
  },
  plugins: [
    'react',
    'react-hooks',
    '@typescript-eslint',
    'emotion'
  ],
  settings: {
    react: { version: 'detect' }
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'prettier/@typescript-eslint',
  ],
  env: {
    browser: true,
    es6: true
  },
  rules: {
    "emotion/jsx-import": 2,

    // Enforcing this rule creates verbose function components.
    // As `displayName` is just for debugging, we've chosen to disable it.
    // See https://reactjs.org/docs/react-component.html#displayname
    "react/display-name": 0
  }
};

