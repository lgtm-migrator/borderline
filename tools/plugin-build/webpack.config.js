var path = require('path');
var webpack = require('webpack');

var server_config = {
    target: 'node',
    entry: {
        server: './plugins-code/chat/server/index.js'
    },
    output: {
        filename: '[name].[hash].js',
        path: path.resolve(__dirname, './build')
    }
};

var client_config = {
    target: 'web',
    entry: {
        client: './plugins-code/chat/client/index.js'
    },
    output: {
        filename: '[name].[hash].js',
        path: path.resolve(__dirname, './build')
    },
    plugins: [
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
