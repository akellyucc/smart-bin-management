const webpack = require('webpack');

module.exports = {
  webpack: (config) => {
    config.resolve.fallback = {
      fs: false,
      zlib: require.resolve('browserify-zlib'),
      stream: require.resolve('stream-browserify'),
      path: require.resolve('path-browserify'),
      crypto: require.resolve('crypto-browserify'),
      assert: require.resolve('assert/'),
      util: require.resolve('util/'),
      http: require.resolve('stream-http'),
      querystring: require.resolve('querystring-es3'),
      timers: require.resolve('timers-browserify'),
      process: require.resolve('process/browser'), // Add this line
    };

    // Add the process polyfill
    config.plugins.push(
      new webpack.ProvidePlugin({
        process: 'process/browser',
        Buffer: ['buffer', 'Buffer'],
      })
    );

    return config;
  },
};
