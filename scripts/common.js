const path = require('path')

module.exports = {
  output: {
    path: path.resolve('./', 'build'),
    filename: '[name].js',
    library: 'll1',
    libraryTarget: 'umd',
    globalObject: 'this',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: 'babel-loader',
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    alias: {
      '@': path.resolve('./', 'src'),
    },
    extensions: ['.js', '.json'],
  },
}
