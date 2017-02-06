const path  = require('path');
const webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var paths = require('./paths');
var getClientEnvironment = require('./env');
var WatchMissingNodeModulesPlugin = require('borderline-dev-utils/WatchMissingNodeModulesPlugin');
// Get environment variables to inject into our app.
var env = getClientEnvironment('');

var modulesList = [];
modulesList = modulesList.concat(paths.appNodeModules);
modulesList = modulesList.concat(paths.ownNodeModules);
modulesList = modulesList.concat(paths.nodePaths);
console.log(modulesList);

module.exports = [
    {
        name: "ui-extension webpack dev",
        devtool: 'cheap-module-source-map',
        entry: [
            //Alternative webpack server notify the ui updates
            require.resolve('webpack-dev-server/client'),
            //Ui extension main file
            paths.uiIndexJs
        ],
        output: { //Useless in dev mode but webpack crashes without it
            path: paths.appBuild,
            pathinfo: true,
            filename: 'ui-extension.js',
            publicPath: ''
        },
        resolve: {
            extensions: ['.js', '.json', '.jsx'],
            modules: paths.nodePaths
        },
        module: {
            rules: [
                {
                    test: /\.(js|jsx)$/,
                    enforce: 'pre',
                    use: 'eslint-loader'
                },
                {
                    test: /\.js$/,
                    use: 'babel-loader'
                },
                {
                    test: /\.css$/,
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
                    'postcss-loader'
                ]
                },
                {
                    test: /\.html$/,
                    use: [
                    {
                        loader: 'html-loader',
                        options: {
                            minimize: true
                        }
                    }
                    ]
                }
            ]
        },
        plugins: [
            // Generates an `index.html` file with the <script> injected.
            new HtmlWebpackPlugin({
                inject: true,
                template: paths.appHtml
            }),
            new webpack.DefinePlugin(env),
            new webpack.HotModuleReplacementPlugin(),
            new webpack.NoEmitOnErrorsPlugin(),
            new WatchMissingNodeModulesPlugin(paths.appNodeModules)
        ]
    },
    {
        name: 'server-extension webpack dev',
        devtool: 'cheap-module-source-map',
        entry: [
            //Use a webpack server to update server side changes
            //require.resolve('webpack-dev-server/client'),
            //require.resolve('./polyfills'),
            //Server extension main file
            paths.serverIndexJs
        ],
        output: {
            path: paths.appBuild,
            pathinfo: true,
            filename: 'server-extension.js',
            publicPath: '/'
        },
        resolve: {
            extensions: ['.js', '.json', '.jsx'],
            modules: paths.nodePaths
        },
        module: {
            rules: [
                {
                    test: /\.(js|jsx)$/,
                    enforce: 'pre',
                    use: 'eslint-loader'
                },
                {
                    test: /\.js$/,
                    use: 'babel-loader'
                }
            ]
        },
        plugins: [
            new webpack.DefinePlugin(env),
            new webpack.HotModuleReplacementPlugin(),
            new webpack.NoEmitOnErrorsPlugin(),
            new WatchMissingNodeModulesPlugin(paths.appNodeModules)
        ]
    }
];

