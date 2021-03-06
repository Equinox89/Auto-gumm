let gulp   = require('gulp');
let server = require('browser-sync').create();
let util   = require('gulp-util');
let config = require('../config');

// in CL 'gulp server --open' to open current project in browser
// in CL 'gulp server --tunnel siteName' to make project available over http://siteName.localtunnel.me

gulp.task('server', function() {
    server.init({
        server: {
            baseDir: !config.production ? [config.dest.root, config.src.root] : config.dest.root,
            directory: false,
            serveStaticOptions: {
                extensions: ['html']
            },
            routes: {
                '/vendor': 'vendor'
            }
        },
        files: [
            config.dest.html + '/*.html',
            config.dest.css + '/*.css',
            config.dest.img + '/**/*'
        ],
        port: util.env.port || 8080,
        logLevel: 'info', // 'debug', 'info', 'silent', 'warn'
        logConnections: false,
        logFileChanges: true,
        open: true,
        notify: true,
        ghostMode: false,
        online: true,
        tunnel: util.env.tunnel || null
    });
});

module.exports = server;
