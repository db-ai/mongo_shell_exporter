const path = require('path')

module.exports = {
  // mode: 'development',
  target: 'node',
  entry: './src/index.js',
  output: {
    filename: 'mongo_exporter.js',
    path: path.resolve(__dirname, 'dist')
  },
  resolve: {
    alias: {
      src: path.resolve(__dirname, 'src')
    }
  }
}
