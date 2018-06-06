const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');

// defining editor copy parameters
const editor = {
    to: 'vs'
};

let plugins = [];
plugins.push(new MonacoWebpackPlugin({
    languages: ['python', 'javascript']
}));

module.exports = () => ({
    plugins
});
