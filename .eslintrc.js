module.exports = {
  extends: [
    "@guardian/eslint-config-typescript",
    "plugin:@guardian/source-foundations/recommended",
    "plugin:@guardian/source-react-components/recommended",
  ],
  root: true,
  parserOptions: {
    tsconfigRootDir: __dirname,
    sourceType: 'module',
    ecmaVersion: 2020,
    ecmaFeatures: {
      jsx: true
    },
  },
  plugins: [
    'react',
    'react-hooks',
    '@emotion',
  ],
  settings: {
    react: { version: 'detect' }
  },
  extends: [
    'plugin:react/recommended',
    'plugin:react-hooks/recommended'
  ],
  rules: {
    "@emotion/jsx-import": [2, "jsxImportSource"],

    // Enforcing this rule creates verbose function components.
    // As `displayName` is just for debugging, we've chosen to disable it.
    // See https://reactjs.org/docs/react-component.html#displayname
    "react/display-name": 0,
    "react/react-in-jsx-scope": "off",
    "react/jsx-uses-react": "off",
    "react/no-unknown-property": ['error', { ignore: ['css'] }]
  }
};

