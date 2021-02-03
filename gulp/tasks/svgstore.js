let gulp        = require('gulp');
let config      = require('../config');
let svgmin      = require('gulp-svgmin');
let svgstore    = require('gulp-svgstore');
let inject      = require('gulp-inject');
let cheerio     = require('gulp-cheerio');
let rename      = require('gulp-rename');

gulp.task('svgstore', function () {
    let store = gulp.src(config.src.iconsSvg + '/*.svg')
        .pipe(svgmin())
        .pipe(rename({prefix: 'icon-'}))
        .pipe(svgstore({ inlineSvg: true }));

    function fileContents (filePath, file) {
        return file.contents.toString();
    }

    return gulp
        .src(config.src.templates + '/layout/_sprite.pug')
        .pipe(inject(store, { transform: fileContents }))
        .pipe(cheerio({
            run: function($, file) {
                $('svg').replaceWith(function() {
                    return $("<defs/>").append($(this).contents());
                });
                $('[fill]:not([fill="currentColor"])').removeAttr('fill');
                $('[stroke]').removeAttr('stroke');
            },
            parserOptions: { xmlMode: true }
        }))
        .pipe(gulp.dest(config.src.templates + '/layout'));
});

gulp.task('svgstore:watch', function() {
    gulp.watch(config.src.iconsSvg + '/*.svg', ['svgstore']);
});
