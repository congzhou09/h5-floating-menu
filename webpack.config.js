const pkg = require('./package.json');
const Webpack = require('webpack');
const Path = require('path');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
  mode: 'production',
  // mode: "development",
  entry: Path.resolve(__dirname, './src/index.js'),
  output: {
    path: Path.resolve(__dirname, './dist'),
    filename: 'h5-floating-menu.min.js',
    library: 'H5FloatingMenu',
    libraryTarget: 'umd',
    libraryExport: 'default'
  },
  optimization: {
    minimizer: [
      new TerserPlugin({
        extractComments: false
      })
    ]
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader'
      }
    ]
  },
  plugins: [
    new Webpack.BannerPlugin(
      [
        'h5-floating-menu v' + pkg.version + ' (' + pkg.homepage + ')',
        '',
        'Copyright (C) 2019. Free to use, very pleased to reserve my name: "Congzhou" '
      ].join('\n')
    )
  ]
};
