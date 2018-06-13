const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');

let plugins = [];
plugins.push(new MonacoWebpackPlugin({
    languages: ['python', 'javascript']
}));

module.exports = () => ({
    plugins
});
