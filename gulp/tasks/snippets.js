let gulp    = require('gulp');
let config  = require('../config.js');
let fs      = require('fs');
let path    = require('path');
let args    = require('yargs').argv;
let table   = require('cli-table3');
let allowExt    = ['.html', '.pug'];

function CopySnippet(filename, pug = true) {

    let inCode  = (pug) ? config.src.snippetsPug + "/" + filename : config.src.snippetsScss + "/" + filename;
    let outCode = (pug) ? config.src.modulePug : config.src.moduleScss;

    fs.access(inCode, (err) => {
        if (err) {
            console.log('File Not Found: ' + filename);
            return false;
        }

        gulp.src(inCode).pipe(gulp.dest(outCode));
    });
}

gulp.task('snippets', function () {

    if (args.env || false) {
        CopySnippet("_" + args.env + ".pug", true);
        CopySnippet("_" + args.env + ".scss", false);
        console.log('\n','Snippets success installed ...','\n');
    } else {

        fs.readdir(config.src.snippetsPug, function (err, files) {

            let tbl = new table({
                head: ['Snippet', 'Install Command'], colWidths: [30, 50],
                style: { 'padding-left': 0, 'padding-right': 0 },
                chars: {
                    'top': '-' , 'top-mid': '' , 'top-left': '' , 'top-right': '',
                    'bottom': '-' , 'bottom-mid': '' , 'bottom-left': '' , 'bottom-right': '',
                    'left': '' , 'left-mid': '' , 'mid': '-' , 'mid-mid': '|',
                    'right': '' , 'right-mid': '' , 'middle': ' '
                }
            });

            if (err) {
                return console.log('Unable to scan directory: ' + err);
            }
            files.forEach(function (file) {

                let parsed = path.parse(file);
                let name = parsed.name.toString().replace('_', '');

                if (~allowExt.indexOf(parsed.ext)) {
                    tbl.push([file, 'gulp snippets --env ' + name]);
                };
            });

            console.log(tbl.toString());
        });
    }

});
