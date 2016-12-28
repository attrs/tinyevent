var path = require('path');
var webpack = require('webpack');

module.exports = {
  entry: path.join(__dirname, 'lib/tinyevent.js'),
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'tinyevent.js',
    library: 'tinyevent',
    libraryTarget: 'umd',
    umdNamedDefine: true
  },
  devtool: 'source-map'
};
