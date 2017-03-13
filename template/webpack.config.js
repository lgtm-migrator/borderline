var path = require('path');
var webpack = require('webpack');
var manifest = require('webpack-manifest-plugin');

var manifest_cache = {
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
        filename: '[name].[chunkhash].js',
        path: path.resolve('./build')
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
        filename: '[name].[chunkhash].js',
        path: path.resolve('./build')
    },
    plugins: [
        manifest_plugin
    ],
    resolve: {
        extensions: ['.js', '.jsx', '.json']
    },
    module: {
        loaders: [
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                loaders: ["babel-loader"]
            }
        ]
    }
};

module.exports = [ server_config, client_config ];
