let gulp   = require('gulp');
let del    = require('del');
let util   = require('gulp-util');
let config = require('../config');

gulp.task('clean', function(cb) {
    return del([
        config.dest.root
    ]).then(function(paths) {
        util.log('Deleted:', util.colors.magenta(paths.join('\n')));
    });
});
