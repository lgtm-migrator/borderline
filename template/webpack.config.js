var path = require('path');
var webpack = require('webpack');
var manifest = require('webpack-manifest-plugin');

var package = require('./package.json');

var manifest_cache = {
    name: package.name,
    version: package.version,
    id: Math.floor(Math.random() * 0xffffffffffffffff).toString(32)
};
var manifest_plugin = new manifest({
    fileName: 'plugin.json',
    cache: manifest_cache,
    writeToFileEmit: true
});

var server_config = {
    target: 'node',
    entry: {
        server: './code/server/index.js'
    },
    output: {
        filename: '[name].[hash].js',
        path: path.resolve(path.join('../../.build/', manifest_cache.id.toString()))
    },
    plugins: [
        manifest_plugin
    ]
};

var client_config = {
    target: 'web',
    entry: {
        client: './code/client/index.js'
    },
    output: {
        filename: '[name].[hash].js',
        path: path.resolve(path.join('../../.build/', manifest_cache.id.toString()))
    },
    plugins: [
        manifest_plugin
    ],
    resolve: {
        extensions: ['.js', '.jsx', '.json']
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
            include: './code/client/',
            use: [
                'babel-loader'
            ],
        }, {
            test: /\.css$/,
            include: './code/client/',
            use: [
                'style-loader',
                {
                    loader: 'css-loader',
                    options: {
                        modules: true,
                        importLoaders: 1,
                        localIdentName: '[hash:base64:5]'
                    }
                },
                {
                    loader: 'postcss-loader'
                }
            ]
        }, {
            test: /\.svg$/,
            use: [
                'svg-inline-loader'
            ],
        }, {
            test: /\.html$/,
            include: './code/client/',
            use: [
                {
                    loader: 'html-loader',
                    options: {
                        minimize: true
                    }
                }
            ],
        }]
    }
};

module.exports = [ server_config, client_config ];
