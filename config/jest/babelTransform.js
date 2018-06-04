// @remove-file-on-eject

const babelJest = require('babel-jest');

module.exports = babelJest.createTransformer({
    presets: [require.resolve('babel-preset-react-app')],
    plugins: [require.resolve('babel-plugin-transform-decorators-legacy')],
    babelrc: false,
});
