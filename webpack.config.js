var webpack = require('webpack');
var path = require('path');

const config = {
  devtool: 'inline-source-map',
  entry: './client/index.jsx',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'public')
  },
  module: {
    loaders: [
      {
        test: /\.jsx$/,
        exclude: /(node_modules|bower_components)/,
        loaders: [ 'babel-loader?presets[]=react,presets[]=es2015']
      }
    ]
  }
};

module.exports = config;
