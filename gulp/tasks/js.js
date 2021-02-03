let gulp        = require('gulp');
let include     = require("gulp-include");
let config      = require('../config');
let browserSync = require('browser-sync');
let babel       = require('gulp-babel');
let rename      = require('gulp-rename');
let uglify      = require('gulp-uglify');
reload          = browserSync.reload;

gulp.task('js', function() {
    let js = gulp.src(config.src.js+'/**/*.js')
        .pipe(include())
        .on('error', config.errorHandler)
        .pipe(babel());
      
    if (config.production) {
        js.pipe(uglify());
    }

    js.pipe(rename({suffix: config.production ? '.min' : ''}))
        .pipe(gulp.dest(config.dest.js+'/'))
        .pipe(reload({stream: true}));
});

gulp.task('js:watch', function() {
    gulp.watch(config.src.js+'/*', ['js']);
});
