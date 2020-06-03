const path = require('path');

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'mongo_exporter.js',
    path: path.resolve(__dirname, 'dist'),
  },
};