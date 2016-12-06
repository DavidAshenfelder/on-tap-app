const webpack = require('webpack');
const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
  entry: ['babel-polyfill', './src/app.js', 'whatwg-fetch'],
  output: {
    path: './public/dist',
    filename: './js/app.bundle.js',
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        loader: 'babel',
        query: {
          presets: ['react', 'es2015', 'stage-0'],
        },
      }, {
        test: /\.(s?css)$/,
        loader: ExtractTextPlugin.extract('style', [
          'css?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]&sourceMap',
          'postcss',
          'sass',
        ]),
        exclude: /(node_modules)/,
      },
      {
        test: /\.svg$/,
        loader: 'svg-sprite',
      },
    ],
  },
  plugins: [
    new webpack.NoErrorsPlugin(),
    new ExtractTextPlugin('./css/app.css'),
    new webpack.optimize.DedupePlugin(),
  ],
  resolve: {
    extensions: ['', '.js', '.jsx'],
    alias: {
      apphome: path.resolve(__dirname, 'src'),
      'react/addons': 'react',
    },
  },
  devServer: {
    inline: true,
    hot: true,
    contentBase: 'http://localhost:3000',
    // This would be used if we ever had multiple routes and wanted
    // react-router to handle those route changes.
    // proxy: {
    //   '/api': {
    //     target: 'http://localhost:3000',
    //     bypass: function (req, res, proxyOptions) {
    //       if (req.headers && req.headers.accept && req.headers.accept.indexOf('html') !== -1) {
    //         return '/index.html';
    //       }
    //     }
    //   }
    // }
  }
};
