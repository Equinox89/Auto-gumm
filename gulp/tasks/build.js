let gulp        = require('gulp');
let runSequence = require('run-sequence');
let config      = require('../config');

function build(cb) {
    runSequence(
        'clean',
        'sprite:svg',
        'svgstore',
        'sass',
        'pug',
        'js',
        'ts',
        'copy',
        'index-page',
        cb
    );
}

gulp.task('build', function(cb) {
    config.setEnv('production');
    config.logEnv();
    build(cb);
});

gulp.task('build:dev', function(cb) {
    config.setEnv('development');
    config.logEnv();
    build(cb);
});
