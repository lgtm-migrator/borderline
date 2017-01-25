const { resolve } = require('path');
const webpack = require('webpack');
const html = require('html-webpack-plugin');
const pkg = require('./package.json');

const distFolder = resolve(__dirname, 'dist');
const sourceFolder = resolve(__dirname, 'src');

module.exports = {
    entry: {
        // the vendor packages
        vendor: Object.keys(pkg.dependencies),

        borderline: [

            // activate HMR for React
            'react-hot-loader/patch',

            // bundle the client for webpack-dev-server
            // and connect to the provided endpoint
            'webpack-hot-middleware/client',

            // the entry point of our app
            sourceFolder + '/index.js'
        ],
    },
    output: {
        path: distFolder,
        filename: '[name].[hash].js',
        library: 'borderline',
        libraryTarget: 'umd',
        umdNamedDefine: true
    },
    externals: {
        // TODO Consider removing external libraries from the bundle
        // 'react': { ... }
    },
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
        }, {
            test: /\.html$/,
            include: sourceFolder,
            use: [
                {
                    loader: 'html-loader',
                    options: {
                        minimize: true
                    }
                }
            ],
        }]
    },
    plugins: [
        new webpack.optimize.CommonsChunkPlugin({
            name: ['vendor', 'manifest']
        }),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoEmitOnErrorsPlugin(),
        new html({
            filename: 'index.html',
            template: sourceFolder + '/index.html',
            inject: true
        })
    ],
    devtool: 'cheap-module-source-map'
};
