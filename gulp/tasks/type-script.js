let gulp        = require('gulp');
let config      = require('../config');
let ts          = require('gulp-typescript');
let browserSync = require('browser-sync');
reload          = browserSync.reload;

gulp.task('ts', function () {
    if (config.typescript) {
        return gulp.src(config.src.js + '/**/*.ts')
            .pipe(ts({
                noImplicitAny: true,
            }))
            .on('error', config.errorHandler)
            .pipe(gulp.dest(config.dest.js + '/'))
            .pipe(reload({stream: true}));
    }
});

gulp.task('ts:watch', function () {
    if (config.typescript) {
        gulp.watch(config.src.js + '/*', ['ts']);
    }
});
