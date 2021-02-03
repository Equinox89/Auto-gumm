let util = require('gulp-util');

let production = util.env.production || util.env.prod || false;
let destPath   = 'production';

let config = {
    env       : 'development',
    production: production,

    typescript : false,

    src: {
        vendor       : 'vendor/',
        // source directories
        root         : 'source',
        templates    : 'source/templates',
        templatesData: 'source/templates/data',
        sass         : 'source/scss',
        // path for sass files that will be generated automatically via some of tasks
        sassGen      : 'source/scss/generated',
        js           : 'source/js',
        img          : 'source/images',
        svg          : 'source/images/svg',
        icons        : 'source/icons',
        // path to png sources for sprite:png task
        iconsPng     : 'source/icons',
        // path to svg sources for sprite:svg task
        iconsSvg     : 'source/icons',
        // fonts
        fonts        : 'source/fonts',
        lib          : 'source/lib',
        // Custom file copy
        data         : 'source/data',
        // Snippets
        snippetsPug  : 'snippets/pug',
        snippetsScss : 'snippets/scss',
        // Out Source Dir
        moduleScss   : 'source/scss/module',
        modulePug    : 'source/templates/module',
    },
    dest: {
        root : destPath,
        html : destPath,
        css  : destPath + '/css',
        js   : destPath + '/js',
        img  : destPath + '/images',
        fonts: destPath + '/fonts',
        lib  : destPath + '/lib',
        data : destPath + '/data'
    },

    setEnv: function(env) {
        if (typeof env !== 'string') return;
        this.env = env;
        this.production = env === 'production';
        process.env.NODE_ENV = env;
    },

    logEnv: function() {
        util.log(
            'Environment:',
            util.colors.white.bgRed(' ' + process.env.NODE_ENV + ' ')
        );
    },

    errorHandler: require('./util/handle-errors')
};

config.setEnv(production ? 'production' : 'development');

module.exports = config;
