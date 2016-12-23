var path = require('path');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var CopyWebpackPlugin = require('copy-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin')

var isProd = process.env.NODE_ENV === 'production' ? true : false;

var config = {
  debug: true,
  devtool: 'cheap-module-source-map',
  entry: [
    './src/assets/js/index.js',
    './src/assets/css/index.scss'
  ],

  output: {
    path: './build',
    filename: 'assets/js/bundle.js'
  },

  module: {
    loaders: [
      {
        test: /\.scss$/,
        loader: ExtractTextPlugin.extract('css!sass')
      },
      {test: /\.(woff|woff2)(\?v=\d+\.\d+\.\d+)?$/, loader: 'url?limit=10000&mimetype=application/font-woff'},
      {test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/, loader: 'url?limit=10000&mimetype=application/octet-stream'},
      {test: /\.eot(\?v=\d+\.\d+\.\d+)?$/, loader: 'file'},
      {test: /\.svg(\?v=\d+\.\d+\.\d+)?$/, loader: 'url?limit=10000&mimetype=image/svg+xml'}
    ]
  },

  resolve: {
    extensions: ['', '.js'],
    alias: {
      'bootstrap': path.resolve(__dirname, 'node_modules', 'bootstrap-sass', 'assets'),
    }
  },

  plugins: [

    // extract css into separate file
    new ExtractTextPlugin('assets/css/bundle.css'),

    // copy the chrome extension manifest
    new CopyWebpackPlugin([
      { from: './src/manifest.json', to: 'manifest.json' }
    ]),

    // copy the images
    new CopyWebpackPlugin([
      { from: './src/assets/images', to: 'assets/images' }
    ]),

    // copy the popup and settings html files
    new HtmlWebpackPlugin({
      filename: 'popup.html',
      template: './src/popup.html',
    }),

    new HtmlWebpackPlugin({
      filename: 'settings.html',
      template: './src/settings.html',
    })
  ]
};

if (isProd) {
  config.debug = false;

  // set production NODE_ENV
  config.plugins.push(
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('production')
      }
    })
  );

  // minify javascript
  config.plugins.push(
    new webpack.optimize.UglifyJsPlugin({
      compress: { warnings: false },
      output: { comments: false }
    })
  );
}

module.exports = config;
