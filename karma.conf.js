var webpackConfig = require('./webpack.config.test.js');

module.exports = function(config) {
    config.set({

        frameworks: ['jasmine'],

        files: [
            { pattern: 'karma-test-shim.js', watched: false }
        ],

        exclude: [],

        preprocessors: {
            'karma-test-shim.js': ['webpack']
        },

        webpack: webpackConfig,
        webpackMiddleware: {
            stats: 'errors-only'
        },
        webpackServer: {
            noInfo: true
        },

        reporters: ['progress'],
        port: 9876,

        logLevel: config.LOG_INFO,

        autoWatch: false,

        browsers: ['PhantomJS'],

        singleRun: true,

        //concurrency: Infinity
    })
};