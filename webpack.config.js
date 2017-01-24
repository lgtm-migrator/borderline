const { resolve } = require('path');
const webpack = require('webpack');

const distFolder = resolve(__dirname, 'dist');
const sourceFolder = resolve(__dirname, 'src/client');

module.exports = {
    entry: [
        // activate HMR for React
        'react-hot-loader/patch',

        // bundle the client for webpack-dev-server
        // and connect to the provided endpoint
        'webpack-hot-middleware/client',

        // the entry point of our app
        './src/client/index'
    ],
    output: {
        path: distFolder,
        filename: 'bundle.js',
        publicPath: '/static/'
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoEmitOnErrorsPlugin(),
    ],
    module: {
        rules: [{
            test: /\.js$/,
            exclude: '/node_modules/',
            enforce: 'pre',
            use: [
                'eslint-loader'
            ],
        }, {
            test: /\.js$/,
            include: sourceFolder,
            use: [
                'babel-loader'
            ],
        }, {
            test: /\.css$/,
            include: sourceFolder,
            use: [
                'style-loader',
                {
                    loader: 'css-loader',
                    options: {
                        modules: true,
                        importLoaders: 1,
                        localIdentName: '[name]__[local]___[hash:base64:5]'
                    }
                },
                'postcss-loader',
            ]
        }]
    },
    devtool: 'cheap-module-source-map'
};
