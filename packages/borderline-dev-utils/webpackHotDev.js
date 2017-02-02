var ansiHTML = require('ansi-html');

// Color scheme inspired by https://github.com/glenjamin/webpack-hot-middleware
var colors = {
    reset: ['transparent', 'transparent'],
    black: '181818',
    red: 'E36049',
    green: 'B3CB74',
    yellow: 'FFD080',
    blue: '7CAFC2',
    magenta: '7FACCA',
    cyan: 'C3C2EF',
    lightgrey: 'EBE7E3',
    darkgrey: '6D7891'
};
ansiHTML.setColors(colors);
