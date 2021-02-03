let gulp        = require('gulp');
let runSequence = require('run-sequence');

gulp.task('default', function(cb) {
    runSequence(
        'build:dev',
        'watch',
        'server',
        cb
    );
});
