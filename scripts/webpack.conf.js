const { modifyWebpackConfig } = require('@gera2ld/plaid');

module.exports = modifyWebpackConfig(async (config) => {
  config.target = 'electron-renderer';
  return [config, {
    entry: {
      index: './src/background/index.js',
    },
    target: 'electron-main',
  }];
});
