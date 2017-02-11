var webpack = require('webpack');

const config = {
  devtool: 'inline-source-map',
  entry: './client/index.jsx',
  output: {
    filename: 'bundle.js',
    path: './public'
  },
  module: {
    loaders: [
      {
        test: /\.jsx$/,
        exclude: /(node_modules|bower_components)/,
        loaders: [ 'babel?presets[]=react,presets[]=es2015']
      }
    ]
  }
};

module.exports = config;
