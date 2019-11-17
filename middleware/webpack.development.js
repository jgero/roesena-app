const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const StartServerPlugin = require('start-server-webpack-plugin');
const merge = require('webpack-merge');
const nodeExternals = require('webpack-node-externals');
const path = require('path');
const webpack = require('webpack');

const common = require('./webpack.common.js');

module.exports = merge.smart(common, {
  devtool: 'inline-source-map',
  entry: ['webpack/hot/poll?1000', path.join(__dirname, 'src/main.ts')],
  externals: [
    nodeExternals({
      whitelist: ['webpack/hot/poll?1000']
    })
  ],
  mode: 'development',
  plugins: [
    new StartServerPlugin({ name: 'server.js' }),
    new webpack.NoEmitOnErrorsPlugin(),
    new CleanWebpackPlugin(),
    new webpack.HotModuleReplacementPlugin()
  ],
  watch: true
});
