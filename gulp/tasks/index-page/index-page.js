let gulp        = require('gulp');
let consolidate = require('gulp-consolidate');
let fs          = require('fs');
let path        = require('path');
let config      = require('../../config');
let allowExt    = ['.html', '.pug'];

gulp.task('index-page', function () {
    if (config.production) {
        let fullList = fs.readdirSync(config.src.templates);
        let pages = fullList.reduce(function (acc, val) {
            let parsed = path.parse(val);
            let name = parsed.name;
            let ext = parsed.ext;
            if (~allowExt.indexOf(ext)) {
                return acc.concat(name + '.html');
            }
            return acc;
        }, []);

        return gulp
            .src(__dirname + '/__index.html')
            .pipe(consolidate('lodash', {
                pages: pages
            }))
            .pipe(gulp.dest(config.dest.html));
    }
});
