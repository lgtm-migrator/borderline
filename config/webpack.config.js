const { resolve } = require('path');
const webpack = require('webpack');
const html = require('html-webpack-plugin');
const pkg = require('../package.json');

const distFolder = resolve(__dirname, '../dist');
const sourceFolder = resolve(__dirname, '../src');

module.exports = function () {

    const prod = process.env.NODE_ENV === 'production';

    // defining the application bundle components
    const borderline = [];

    if (!prod) {
        borderline.push(
            // activate HMR for React
            'react-hot-loader/patch',

            // bundle the client for webpack-dev-server
            // and connect to the provided endpoint
            'webpack-hot-middleware/client'
        );
    }

    borderline.push(
        // the entry point of our app
        sourceFolder + '/index.js'
    );

    const vendor = [];

    if (!prod) {
        vendor.push(
            'react-hot-loader',
            'redux-logger'
        );
    }

    vendor.push(
        'immutable',
        'react',
        'react-dom',
        'react-redux',
        'react-router',
        'redux',
        'redux-observable',
        'rxjs'
    );

    // defining the plugins to be used for bundling
    const plugins = [
        new webpack.optimize.CommonsChunkPlugin(prod ? {
            name: 'vendor',
            filename: 'vendor.bundle.js',
            minChunks: Infinity
        } : {
                name: ['vendor', 'manifest']
            }),
        new webpack.DefinePlugin({
            'process.env': { NODE_ENV: JSON.stringify(process.env.NODE_ENV) }
        }),
        new webpack.NamedModulesPlugin(),
    ];

    if (prod) {
        plugins.push(
            new webpack.LoaderOptionsPlugin({
                minimize: true,
                debug: false
            }),
            new webpack.optimize.UglifyJsPlugin({
                compress: {
                    warnings: false,
                    screw_ie8: true,
                    conditionals: true,
                    unused: true,
                    comparisons: true,
                    sequences: true,
                    dead_code: true,
                    evaluate: true,
                    if_return: true,
                    join_vars: true,
                },
                output: {
                    comments: false,
                },
            })
        );
    } else {
        plugins.push(
            new webpack.HotModuleReplacementPlugin(),
            new webpack.NoEmitOnErrorsPlugin()
        );
    }

    plugins.push(
        new html({
            filename: 'index.html',
            template: sourceFolder + '/index.html',
            inject: true
        })
    );

    return {
        entry: {
            // the vendor packages
            vendor: vendor,
            borderline: borderline,
        },
        output: {
            path: distFolder,
            filename: prod ? '[name].' + pkg.version + '.js' : '[name].[hash].js',
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
                            localIdentName: prod ? '[hash:base64:5]' : '[name]__[local]___[hash:base64:5]'
                        }
                    },
                    {
                        loader: 'postcss-loader',
                        options: {
                            plugins: {
                                'postcss-import': {},
                                'postcss-cssnext': {
                                    browsers: ['last 2 versions', '> 5%'],
                                },
                            }
                        }
                    }
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
        plugins: plugins,
        devtool: prod ? 'nosources-source-map' : 'eval-source-map'
    };
};
