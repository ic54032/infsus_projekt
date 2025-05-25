module.exports = function(config) {
    config.set({
        basePath: '',
        frameworks: ['jasmine'],
        files: [
            'src/**/*.js',
            'src/**/*.ts',
            'node_modules/jasmine-core/lib/jasmine-core/jasmine.js',
            'node_modules/jasmine-core/lib/jasmine-core/jasmine-html.js',
            'node_modules/jasmine-core/lib/jasmine-core/boot.js'
        ],
        preprocessors: {
            '**/*.ts': ['typescript']
        },
        reporters: ['progress'],
        port: 9876,
        colors: true,
        logLevel: config.LOG_INFO,
        autoWatch: true,
        browsers: ['Chrome'],
        singleRun: false,
        concurrency: Infinity
    });
};