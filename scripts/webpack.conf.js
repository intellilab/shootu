const { modifyWebpackConfig } = require('@gera2ld/plaid');

module.exports = modifyWebpackConfig(async (config) => {
  config.target = 'electron-main';
  return config;
});
