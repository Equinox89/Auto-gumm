let gulp        = require('gulp');
let pug         = require('gulp-pug');
let plumber     = require('gulp-plumber');
let changed     = require('gulp-changed');
let gulpif      = require('gulp-if');
let frontMatter = require('gulp-front-matter');
let prettify    = require('gulp-prettify');
let removeEmptyLines = require('gulp-remove-empty-lines');
let config      = require('../config');

function renderHtml(onlyChanged) {
    return gulp
        .src([config.src.templates + '/[^_]*.pug'])
        .pipe(plumber({ errorHandler: config.errorHandler }))
        .pipe(gulpif(onlyChanged, changed(config.dest.html, { extension: '.html' })))
        .pipe(frontMatter({ property: 'data' }))
        .pipe(pug({
            data: {
                bowerDir: '../' + config.src.vendor,
                minSuffix: (config.production) ? '.min' : ''
            }
        }))
        .pipe(prettify({
            indent_size: 4,
            wrap_attributes: 'auto', // 'force'
            preserve_newlines: true,
            end_with_newline: true
        }))
        .pipe(gulpif(config.production, removeEmptyLines({
            removeComments: true
        })))
        .pipe(gulp.dest(config.dest.html));
}

gulp.task('pug', function() {
    return renderHtml();
});

gulp.task('pug:changed', function() {
    return renderHtml(true);
});

gulp.task('pug:watch', function() {
    gulp.watch([config.src.templates + '/**/_*.pug'], ['pug']);
    gulp.watch([config.src.templates + '/**/[^_]*.pug'], ['pug:changed']);
});
