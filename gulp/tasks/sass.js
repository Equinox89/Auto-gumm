let gulp         = require('gulp');
let sass         = require('gulp-sass');
let sourcemaps   = require('gulp-sourcemaps');
let postcss      = require('gulp-postcss');
let autoprefixer = require('autoprefixer');
let mqpacker     = require('css-mqpacker');
let rename       = require('gulp-rename');
let config       = require('../config');


let processors = [
    autoprefixer({
        grid: false,
        browsers: ['last 4 versions'],
        cascade: false
    }),
    mqpacker({
        sort: sortMediaQueries
    })
];

gulp.task('sass', function() {
    return gulp
        .src(config.src.sass + '/*.{sass,scss}')
        .pipe(sourcemaps.init())
        .pipe(sass({
            outputStyle: config.production ? 'compressed' : 'expanded', // nested, expanded, compact, compressed
            precision: 5
        }))
        .on('error', config.errorHandler)
        .pipe(postcss(processors))
        .pipe(sourcemaps.write('./'))
        .pipe(rename({suffix: config.production ? '.min' : ''}))
        .pipe(gulp.dest(config.dest.css));
});

gulp.task('sass:watch', function() {
    gulp.watch(config.src.sass + '/**/*.{sass,scss}', ['sass']);
});

function isMax(mq) {
    return /max-width/.test(mq);
}

function isMin(mq) {
    return /min-width/.test(mq);
}

function sortMediaQueries(a, b) {
    A = a.replace(/\D/g, '');
    B = b.replace(/\D/g, '');

    if (isMax(a) && isMax(b)) {
        return B - A;
    } else if (isMin(a) && isMin(b)) {
        return A - B;
    } else if (isMax(a) && isMin(b)) {
        return 1;
    } else if (isMin(a) && isMax(b)) {
        return -1;
    }

    return 1;
}
