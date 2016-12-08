var path = require('path')
var webpack = require('webpack')

module.exports = {
  entry: './source/index.js',
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'waypoints.min.js'
  },
  devtool: 'source-map',
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      }
    ]
  },
  plugins: [
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      }
    })
  ]
}
