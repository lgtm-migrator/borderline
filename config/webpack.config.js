const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');

let plugins = [];
plugins.push(new MonacoWebpackPlugin({
    languages: ['python', 'javascript', 'json']
}));

module.exports = () => ({
    plugins
});
