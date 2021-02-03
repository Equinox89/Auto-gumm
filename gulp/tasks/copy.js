let gulp    = require('gulp');
let config  = require('../config.js');

gulp.task('copy:fonts', function () {
    return gulp
        .src(config.src.fonts + '/**/*.*')
        .pipe(gulp.dest(config.dest.fonts));
});

gulp.task('copy:data', function () {
    return gulp
        .src(config.src.data + '/**/*.*')
        .pipe(gulp.dest(config.dest.data));
});

gulp.task('copy:favicon', function () {
    return gulp
        .src(config.src.root + '/*icon*')
        .pipe(gulp.dest(config.dest.html));
});

gulp.task('copy:img', function () {
    return gulp
        .src(config.src.img + '/**/*.{jpg,png,jpeg,svg,gif}')
        .pipe(gulp.dest(config.dest.img));
});

gulp.task('copy', [
    'copy:img',
    'copy:data',
    'copy:favicon',
    'copy:fonts'
]);

gulp.task('copy:watch', function () {
    gulp.watch(config.src.img + '/*', ['copy']);
});
