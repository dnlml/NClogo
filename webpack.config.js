const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const WriteFilePlugin = require('write-file-webpack-plugin');
const SpriteLoaderPlugin = require('svg-sprite-loader/plugin');

const extractCss = new ExtractTextPlugin({ filename: 'assets/styles/main.min.css', allChunks: true });
const html = new HtmlWebpackPlugin({ filename: 'index.html', template: './src/index.pug', hash: true });
const copyFiles = new CopyWebpackPlugin([{ from: 'src/assets/3d', to: 'assets/3d' }]);
const writeFiles = new WriteFilePlugin();
const spriteLoader = new SpriteLoaderPlugin();

module.exports = {
  mode: 'development',
  entry: './src/assets/scripts/main.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'assets/scripts/main.min.js',
  },
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: extractCss.extract({
          fallback: 'style-loader',
          use: [{ loader: 'css-loader' }, { loader: 'sass-loader' }],
        }),
      }, {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: ['babel-loader'],
      }, {
        test: /\.pug$/,
        use: [{ loader: 'raw-loader' }, { loader: 'pug-html-loader' }],
      },
    ],
  },
  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    compress: true,
    stats: 'errors-only',
    open: true,
  },
  plugins: [
    html,
    extractCss,
    copyFiles,
    writeFiles,
    spriteLoader,
  ],
};
