module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es2021: true,
  },
  extends: ['airbnb-base', 'prettier', 'plugin:n/recommended'],
  overrides: [],
  parserOptions: {
    ecmaVersion: 'latest',
  },
  rules: {
    'no-underscore-dangle': 'off',
    'func-names': 'off',
    'no-console': 'off',
    'camelcase': 'off',
    'import/no-extraneous-dependencies': 'off',
  },
};
