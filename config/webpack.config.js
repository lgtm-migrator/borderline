const { resolve } = require('path');
const webpack = require('webpack');

const distFolder = resolve(__dirname, '../dist');
const sourceFolder = resolve(__dirname, '../src');

module.exports = {

    entry: [
        // bundle the client for webpack-dev-server
        // and connect to the provided endpoint
        'webpack-dev-server/client?http://localhost:8080',

        // bundle the client for hot reloading
        // only- means to only hot reload for successful updates
        'webpack/hot/only-dev-server',

        // activate HMR for React
        'react-hot-loader/patch',

        // the entry point of borderline
        './index.js'
    ],

    output: {
        // the output bundle
        filename: 'bundle.js',

        path: distFolder,

        // necessary for HMR to know where to load the hot update chunks
        publicPath: '/'
    },

    context: sourceFolder,

    devtool: 'inline-source-map',

    devServer: {
        inline: true,

        historyApiFallback: true,

        hot: true,
        // enable HMR on the server

        contentBase: distFolder,
        // match the output path

        publicPath: '/'
        // match the output `publicPath`
    },

    module: {
        rules: [
            {
                test: /\.js$/,
                use: [
                    'babel-loader',
                ],
                exclude: /node_modules/
            },
            {
                test: /\.(scss|svg)$/,
                use: [
                    'file-loader'
                ],
            },
        ],
    },

    plugins: [
        // enable HMR globally
        new webpack.HotModuleReplacementPlugin(),

        // prints more readable module names in the browser console on HMR updates
        new webpack.NamedModulesPlugin(),
    ],

    node: {
        fs: 'empty',
        net: 'empty',
        tls: 'empty'
    }
}
