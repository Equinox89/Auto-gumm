let gulp        = require('gulp');
let plumber     = require('gulp-plumber');
let svgmin      = require('gulp-svgmin');
let svgStore    = require('gulp-svgstore');
let rename      = require('gulp-rename');
let cheerio     = require('gulp-cheerio');
let through2    = require('through2');
let consolidate = require('gulp-consolidate');
let config      = require('../../config');

gulp.task('sprite:svg', function() {
    return gulp
        .src(config.src.iconsSvg + '/*.svg')
        .pipe(plumber({
            errorHandler: config.errorHandler
        }))
        .pipe(svgmin({
            js2svg: {
                pretty: true
            },
            plugins: [{
                removeDesc: true
            }, {
                cleanupIDs: true
            }, {
                mergePaths: false
            }]
        }))
        .pipe(rename({ prefix: 'icon-' }))
        .pipe(svgStore({ inlineSvg: false }))
        .pipe(through2.obj(function(file, encoding, cb) {
            let $ = file.cheerio;
            let data = $('svg > symbol').map(function() {
                let $this  = $(this);
                let size   = $this.attr('viewBox').split(' ').splice(2);
                let name   = $this.attr('id');
                let ratio  = size[0] / size[1]; // symbol width / symbol height
                let width  = size[0];
                let height  = size[1];
                let fill   = $this.find('[fill]:not([fill="currentColor"])').attr('fill');
                let stroke = $this.find('[stroke]').attr('stroke');
                return {
                    name: name,
                    ratio: +ratio.toFixed(2),
                    fill: fill || 'initial',
                    stroke: stroke || 'initial',
                    width: width || 'initial',
                    height: height || 'initial'
                };
            }).get();

            this.push(file);
            gulp.src(__dirname + '/_sprite-svg.scss')
                .pipe(consolidate('lodash', {
                    symbols: data
                }))
                .pipe(gulp.dest(config.src.sassGen));
            gulp.src(__dirname + '/sprite.html')
                .pipe(consolidate('lodash', {
                    symbols: data
                }))
                .pipe(gulp.dest(config.dest.root));
            cb();
        }))
        .pipe(cheerio({
            run: function($, file) {
                $('[fill]:not([fill="currentColor"])').removeAttr('fill');
                $('[stroke]').removeAttr('stroke');
            },
            parserOptions: { xmlMode: true }
        }))
        .pipe(rename({ basename: 'sprite' }))
        .pipe(gulp.dest(config.dest.img));
});

gulp.task('sprite:svg:watch', function() {
    gulp.watch(config.src.iconsSvg + '/*.svg', ['sprite:svg']);
});
