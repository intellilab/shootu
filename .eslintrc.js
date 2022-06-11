module.exports = {
  root: true,
  extends: [
    require.resolve('@gera2ld/plaid/eslint'),
  ],
  parserOptions: {
    ecmaFeatures: {
      legacyDecorators: true,
    },
  },
  rules: {
  },
};
