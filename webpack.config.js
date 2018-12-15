const path = require('path')
const webpack = require('webpack')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const DotenvPlugin = require('webpack-dotenv-plugin')

// TODO: add this in for production builds
// const MiniCssExtractPlugin = require('mini-css-extract-plugin')

if (!process.env.TARGET) {
  throw new Error('Please specify env variable TARGET: "chrome", or "firefox"')
}

if (!(process.env.TARGET === 'chrome' || process.env.TARGET === 'firefox')) {
  throw new Error('TARGET can only be "chrome" or "firefox"')
}

console.info('Building for target: ' + process.env.TARGET)

module.exports = {
  devtool: 'source-map',
  mode: 'development',
  context: path.resolve(__dirname, 'src'),
  entry: {
    settings: './ui/settings.js',
    popup: './ui/popup.js'
  },
  output: {
    path: path.resolve(__dirname, 'build', process.env.TARGET),
    filename: '[name].dist.js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        loader: 'babel-loader',
        options: {
          presets: [
            '@babel/preset-env',
            '@babel/preset-react'
          ],
          plugins: [
           '@babel/plugin-proposal-class-properties'
          ]
        }
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      }
    ]
  },
  plugins: [
    new DotenvPlugin({
      sample: './env.example',
      path: './.env'
    }),

    new CopyWebpackPlugin([
      { from: './static/', to: './' },
      { from: `./manifest.${process.env.TARGET}.json`, to: './manifest.json' },
      { from: '../node_modules/webextension-polyfill/dist/browser-polyfill.js', to: './vendor/browser-polyfill.js' },
      { from: '../node_modules/jquery/dist/jquery.slim.min.js', to: './vendor/jquery.js' },

      { from: '../node_modules/semantic-ui-css/semantic.min.css', to: './vendor/semantic-ui.css' },
      { from: '../node_modules/semantic-ui-css/themes/', to: './vendor/themes/' },
    ])
  ]
}
