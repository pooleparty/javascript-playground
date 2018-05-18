const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');

const productionEnvPlugin = new webpack.DefinePlugin({
  'process.env': {
    NODE_ENV: JSON.stringify('production'),
  },
});

const PATHS = {
  build: path.resolve(__dirname, 'build'),
  src: path.resolve(__dirname, 'src'),
};

const entry = ['./index.js'];

const baseConfig = {
  devtool: 'source-map',
  context: path.join(process.cwd()),
  entry,
  output: {
    path: PATHS.build,
    filename: 'index.js',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        include: [PATHS.src],
        loader: 'babel-loader',
      },
    ],
  },
};

const envConfig = new Proxy(
  {
    dev: {},
    dist: {
      devtool: false,
      plugins: [productionEnvPlugin],
    },
  },
  {
    // Proxy will force dev configuration to be returned
    // if no matching environment found
    get(target, name) {
      if (target[name]) {
        return target[name];
      }
      return target.dev;
    },
  },
);

module.exports = env => merge(baseConfig, envConfig[env]);
