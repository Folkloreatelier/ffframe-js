const path = require('path');

const BABEL_ENV = process.env.BABEL_ENV || process.env.NODE_ENV || '';
const compiling = BABEL_ENV === 'es' || BABEL_ENV === 'cjs';

const presets = [
    ['env', BABEL_ENV === 'test' ? {} : {
        modules: BABEL_ENV === 'cjs' ? 'commonjs' : false,
        targets: {
            browsers: [
                '> 1%',
                'last 5 versions',
                'ios >= 8',
                'ie >= 10',
            ],
        },
        useBuiltIns: true,
    }],
    'react',
];

const plugins = [
    'syntax-dynamic-import',
    ['transform-object-rest-spread', {
        useBuiltIns: true,
    }],
    ['transform-runtime', {
        helpers: true,
        polyfill: false,
        regenerator: true,
        moduleName: 'babel-runtime',
    }],
];

if (BABEL_ENV === 'dev') {
    plugins.push('react-hot-loader/babel');
} else if (BABEL_ENV === 'test') {
    plugins.push('dynamic-import-node');
}

if (compiling) {
    plugins.push(['css-modules-transform', {
        preprocessCss: path.join(__dirname, './lib/processScss.js'),
        extensions: ['.css', '.scss'],
        generateScopedName: path.join(__dirname, './lib/generateScopedName.js'),
    }]);
    plugins.push([path.join(__dirname, './lib/transformRequireIgnore'), {
        extensions: ['.global.scss'],
    }]);
    if (BABEL_ENV === 'es') {
        plugins.push(['react-intl', {
            messagesDir: './intl/messages/',
        }]);
    }
}

module.exports = {
    presets,
    plugins,
};
