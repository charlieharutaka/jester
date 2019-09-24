/* eslint-disable @typescript-eslint/no-var-requires */
const _ = require('lodash')
const path = require('path')
const CopyPkgJsonPlugin = require('copy-pkg-json-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin')

const isEnvDevelopment = process.env.NODE_ENV === 'development'
const isEnvProduction = process.env.NODE_ENV === 'production'

const config = {
  devtool: isEnvDevelopment ? 'source-map' : false,
  mode: isEnvProduction ? 'production' : 'development',
  output: { path: path.join(__dirname, 'dist') },
  node: { __dirname: false, __filename: false },
  resolve: {
    alias: {
      '@': path.join(__dirname, 'src'),
      '@main': path.join(__dirname, 'src/main'),
      '@models': path.join(__dirname, 'src/models'),
      '@public': path.join(__dirname, 'public'),
      '@renderer': path.join(__dirname, 'src/renderer'),
      '@utils': path.join(__dirname, 'src/utils'),
    },
    extensions: ['.js', '.json', '.ts', '.tsx'],
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'cache-loader',
          },
          {
            loader: 'thread-loader',
            options: {
              workers: require('os').cpus().length - 1,
            },
          },
          {
            loader: 'ts-loader',
            options: {
              happyPackMode: true,
            },
          },
        ],
      },
      {
        test: /\.svg$/,
        loader: 'react-svg-loader',
      },
      {
        test: /\.(scss|css)$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(jpg|png|ico|icns)$/,
        loader: 'file-loader',
        options: {
          name: '[path][name].[ext]',
        },
      },
      {
        test: /\.(woff(2)?|ttf|eot)(\?v=\d+\.\d+\.\d+)?$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              outputPath: 'fonts/',
            },
          },
        ],
      },
    ],
  },
  plugins: [new ForkTsCheckerWebpackPlugin({ checkSyntacticErrors: true })],
}

const mainConfig = _.merge(_.cloneDeep(config), {
  entry: path.resolve(__dirname, 'src', 'main', 'main.ts'),
  target: 'electron-main',
  output: {
    filename: 'main.bundle.js',
  },
  plugins: [
    new CopyPkgJsonPlugin({
      remove: ['scripts', 'devDependencies', 'build'],
      replace: {
        main: './main.bundle.js',
        scripts: { start: 'electron ./main.bundle.js' },
        postinstall: 'electron-builder install-app-deps',
      },
    }),
  ],
})

const rendererConfig = _.merge(_.cloneDeep(config), {
  entry: path.resolve(__dirname, 'src', 'renderer', 'renderer.tsx'),
  target: 'electron-renderer',
  output: {
    filename: 'renderer.bundle.js',
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, './public/index.html'),
    }),
  ],
})

const reporterConfig = _.merge(_.cloneDeep(config), {
  entry: path.resolve(__dirname, 'src', 'reporter', 'JesterReporter.ts'),
  target: 'node',
  output: {
    filename: 'jester-reporter.js',
    library: '',
    libraryTarget: 'commonjs-module',
  },
})

module.exports = [mainConfig, rendererConfig, reporterConfig]
