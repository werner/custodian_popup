var path = require('path');
var webpack = require('webpack');
module.exports = {
  mode: 'development',
  entry: './src/popup.ts',
  devtool: 'inline-source-map',
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'popup.bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    extensions: [ '.tsx', '.ts', '.js' ]
  },
  devServer: {
    compress: true,
    port: 9966
  },
  stats: {
    colors: true
  },
  devtool: 'source-map'
 };
