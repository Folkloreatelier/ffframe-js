module.exports = {



    /**
     * Webpack
     */
    webpack: {
        cssFilename: env => (env === 'dev' ? '[name]-[contenthash].css' : '[name].css'),
        cssLocalIdent: '[name]-[local]',

        imageFilename: env => (env === 'dev' ? 'img/[name]-[hash:6].[ext]' : 'img/[name].[ext]'),
        imagePublicPath: '/',

        fontFilename: env => (env === 'dev' ? 'fonts/[name]-[hash:6].[ext]' : 'fonts/[name].[ext]'),
        fontPublicPath: '/',
    },


    /**
     * Imagemin
     */
    imagemin: {
        files: [
            'src/img/**/*.{jpg,png,jpeg,gif,svg}',
        ],
        output: 'dist/img',

        pngquant: {
            quality: '65-80',
        },

        svgo: {
            plugins: [
                {
                    removeViewBox: false,
                },
            ],
        },
    },

    /**
     * PostCSS
     */
    postcss: {
        map: {
            inline: false,
        },
        plugins: {
            autoprefixer: {},
            cssnano: {
                preset: 'default',
                zindex: false,
                discardUnused: {
                    fontFace: false,
                },
            },
        },
        env: {
            dev: {
                plugins: {
                    autoprefixer: false,
                    cssnano: false,
                },
            },
        },
    },

    /**
     * Modernizr
     */
    modernizr: {
        cache: true,

        devFile: false,

        dest: '.tmp/modernizr.js',

        options: [
            'addTest',
            'html5printshiv',
            'testProp',
            'fnBind',
        ],

        uglify: false,

        tests: [],

        excludeTests: ['hidden'],

        crawl: true,

        useBuffers: false,

        files: {
            src: [
                '*[^(g|G)runt(file)?].{js,css,scss}',
                '**[^node_modules]/**/*.{js,css,scss}',
                '!lib/**/*',
            ],
        },

        customTests: [],
    },

};
