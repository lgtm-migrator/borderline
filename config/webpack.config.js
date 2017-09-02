const CopyWebpackPlugin = require('copy-webpack-plugin');

// defining editor copy parameters
const editor = {
    to: 'vs',
    ignore: ['**/*languages/**/!(r\.|python\.)*', '**/*nls\.*\.+(js|map)']
};

let plugins = [];
if (process.env.NODE_ENV === 'development')
    plugins.push(new CopyWebpackPlugin([{
        context: 'node_modules/monaco-editor/dev/vs',
        from: '**/*\.+(js|svg|css|map)',
        to: editor.to,
        transform: (content) => content.toString().replace('../../min-maps/vs/', '')
    }], {
            ignore: editor.ignore
        }))
else
    plugins.push(new CopyWebpackPlugin([{
        context: 'node_modules/monaco-editor/min/vs',
        from: '**/*\.+(js|svg|css)',
        to: editor.to,
        transform: (content) => content.toString().replace('../../min-maps/vs/', '')
    }], {
            ignore: editor.ignore
        }))


module.exports = () => ({
    plugins
})
