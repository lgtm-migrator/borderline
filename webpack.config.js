const { resolve } = require('path');
const webpack = require('webpack');

const distFolder = resolve(__dirname, 'dist');
const sourceFolder = resolve(__dirname, 'src');

module.exports = {
    devtool: 'cheap-module-source-map',
    entry: [
        // activate HMR for React
        'react-hot-loader/patch',

        // bundle the client for webpack-dev-server
        // and connect to the provided endpoint
        'webpack-hot-middleware/client',

        // the entry point of our app
        './src/index'
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
            include: sourceFolder,
            use: [
                'babel-loader'
            ],
        },
        {
            test: /\.css$/,
            include: sourceFolder,
            use: [
                'style-loader',
                {
                    loader: 'css-loader',
                    options: {
                        modules: 1
                    }
                },
                'postcss-loader',
            ]
        }]
    }
};
