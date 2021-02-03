let gulp = require('gulp');

gulp.task('watch',
    [
        'copy:watch',
        'pug:watch',
    //    'sprite:svg:watch',
        'svgstore:watch',
        'js:watch',
        'ts:watch',
        'sass:watch'
    ]
);
