## How to use

Clone this repo and then in command line type:

* `npm install`         - install all dependencies
* `composer install`     - install all packages

* `composer require bower-asset/{package_name}`   - add packages
* `composer remove bower-asset/{package_name}`    - remove packages


## !! preferable to add the following versions of packages:

  ```json
   "bower-asset/swiper": "4.5.0",
   "bower-asset/select2": "4.0.5",
   "bower-asset/ion.rangeslider": "2.2.0",
   "bower-asset/modaal": "0.4.4"
  ```

## !! reserved classes

  ```json
   ".hide": "hiding any elem in layout !important",
   ".modal-init": "initialize any inline block with Modal plugin",
   ".rating": "initialize Rating plugin (set in main.js. clear if don't use)",
   ".tab, .tab-menu, .tab-content": "initialize and use Tabs plugin (set in main.js. clear if don't use)",
   ".product": "for preview item in catalog layout, another grid or slider",
   ".text": "for text modules on a paages",
   ".stretch": "for stretching section to full screen out of container (set in main.js)",
   ".hide-screen-max-1080": "hide module from 1079 and less",
   ".hide-screen-min-1080": "hide module from 1080 and more"
  ```

## !! swiper structure

  ```json
   ".swiper": "Main wrapper.",
   ".swiper-container": "slider main container",
   ".swiper-wrapper": "additional required wrapper",
   ".swiper-slide": "slider slide (always in .swiper-wrapper)",
   ".swiper-pagination": "if you need pagination (always in .swiper-container)",
   ".swiper-button-prev, .swiper-button-next": "if you need navigation bittons (always in .swiper-container)",
   ".swiper-scrollbar": "if you need scrollbar (always in .swiper-container)"

  ```

## !! swiper additional structure

```json
   ".swiper": "Main wrapper. Has additional classes like this:",
   ".swiper--special-buttons": "Allows buttons to take size of img or svg inside them. Exclusive class .swiper--external-buttons",
   ".swiper--corner-buttons": "Need if you want to put navigation buttons on the rigth top corner of swiper-container",
   ".swiper--outside-buttons": "Need if you want to put navigation buttons out of swiper-container on the right and left sides. Works with .fake-overflow and .swiper-case.stretch inside",
   ".fake-overflow": "Swiper container overflow becomes visible. Need if you want to put navigation buttons out of swiper-container",
   ".fake-overflow--outside-on-right": "Addition to class fake-overflow. Need if you want to have blur effect on the right of swiper container. Works with .swiper-case.stretch",
   ".swiper-case.stretch": "Wrapparound .swiper-container for creating fake-overflow effect on the right and left sides. Useless without .swiper.fake-overflow"
  ```

## How to start

* `gulp`                - run dev-server and let magic happen, or
* `gulp build`          - build project from sources

---

## List of Gulp tasks

To run separate task type in command line `gulp [task_name]`.
Almost all tasks also have watch mode - `gulp [task_name]:watch`, but you don't need to use it directly.

### Main tasks
Task name          | Description
:------------------|:----------------------------------
`default`          | will start all tasks required by project in dev mode: initial build, watch files, run server with livereload
`build:dev`        | build dev version of project (without code optimizations)
`build`            | build production-ready project (with code optimizations)

### Other tasks
Task name          | Description
:------------------|:----------------------------------
`sass` 	         | compile .sass/.scss to .css. We also use [postcss](https://github.com/postcss/postcss) for [autoprefixer](https://github.com/postcss/autoprefixer), so feel free to include other awesome postcss [plugins](https://github.com/postcss/postcss#plugins) when needed
`copy`             | copy common files from `./source` path to `./production` path
`swig`             | compile [swig](http://paularmstrong.github.io/swig/)  templates
`nunjucks`         | compile Mozilla's awesome [nunjucks](https://mozilla.github.io/nunjucks/) templates
`sprite:svg`       | create svg symbol sprites ([css-tricks](https://css-tricks.com/svg-sprites-use-better-icon-fonts/))
`server`           | run dev-server powered by [BrowserSync](https://www.browsersync.io/)
`clean`            | remove `./production` folder
`index-page`       | create index file with links to all project pages
`snippets`         | call list of prepared packages you can use in project (with commands to call)

## Flags

We have several useful flags.

* `gulp --open` or `gulp server --open` - run dev server and then open preview in browser
* `gulp --tunnel=[name]` or `gulp server --tunnel [name]` - runs dev server and allows you to easily share a web service on your local development machine (powered by [localtunnel.me](https://localtunnel.me/)). Your local site will be available at `[name].localtunnel.me`.
* `gulp [task_name] --prod` or `gulp [task_name] --production` - run task in production mode. Some of the tasks (like, sass or js compilation) have additional settings for production mode (such as code minification), so with this flag you can force production mode. `gulp build` uses this mode by default.

## Other
You can also use [npm scripts](https://docs.npmjs.com/misc/scripts):

* `npm run start` - same as `gulp default`.
* `npm run build` - same as `gulp build`.
