;(function($, window, document, undefined) {
    'use strict';

    let headerTopPos, headerVisibleHeight;

    const $document = $(document),
        $window = $(window),
        $body = $('body'),
        $html = $('html'),
        $container = $('#container'),
        $header = $('#header'),
        $footer = $('#footer'),
        $shadow = $('#shadow'),
        $call = $('#call'),
        $table = $('table'),
        $swiper = $('.swiper-container:visible');

    headerTopPos = 0;
    headerVisibleHeight = $header.height();

    $(document).ready(function() {
        cookies();
        findVideos();
        stretchFullScreen();
        SwiperModule.init($swiper);

        $('.tab-menu').tab({
            change: function(e, tab) {
                let slickBig = $(tab).find('.details__slider-master'),
                    slickSmall = $(tab).find('.details__slider-slave');

                if (slickBig.length || slickSmall.length) {
                    slickBig.slick('refresh');
                    slickSmall.slick('refresh');
                }
            }
        });

        $('.rating').rating({
            max: 5,
            readOnly: true
        });

        if ($table.length) {
            $table.not('.print').stacktable();
        }

        $('nav > ul').menuAim({
            activate: activateNav,
            deactivate: deactivateNav,
            exitMenu: function() {
                return true;
            }
        });

        function activateNav(row) {
            $(row).addClass('active');
        }

        function deactivateNav(row) {
            $(row).removeClass('active');
        }

        // call aside
        $document.on('click', '.call-aside', function (e) {
            e.preventDefault();
            let self = $(this);

            $html.css('--globalTopIndent', headerVisibleHeight);

            if (self.data('trigger')) {
                $body
                    .removeClass(function (index, css) {
                        return (css.match(/\bopen-\S+/g) || []).join(' ');
                    })
                    .addClass('open-' + self.data('trigger'));

                if (desktopSize(1080)) {
                    $html.css('--globalRightIndent', scrollbarWidth());
                }
                $html.css('overflow', 'hidden');
                $shadow.addClass('active');
            }
        });
        // end call aside

        // close aside
        $document.on('click', '#shadow, .close-aside', function(e) {
            e.preventDefault();

            $body.removeClass(function (index, css) {
                return (css.match(/\bopen-\S+/g) || []).join(' ');
            });

            $html.css({'overflow': '', '--globalRightIndent': ''});
            $shadow.removeClass('active');
        });
        // end close aside


        $document.scroll(function() {
            const scrolled = window.pageYOffset || document.documentElement.scrollTop,
                $up = $('.up');

            headerTopPos = $header.offset().top - $window.scrollTop() < 0 ?
                $header.offset().top - $window.scrollTop() :
                0;
            headerVisibleHeight = $header.height() + headerTopPos;

            if (scrolled > 100 && $('.up:hidden')) {
                $up.fadeIn();
            } else {
                $up.fadeOut();
            }

            if ((scrolled + $window.height() - $up.height()) >= $footer.offset().top) {
                $up.addClass('absolute');
            } else {
                $up.removeClass('absolute');
            }

            if (!desktopSize(1080)) {
                if($call.length) {
                    $call.css('top', headerVisibleHeight);

                    if(headerVisibleHeight + $window.scrollTop() === $call.offset().top) {
                        $call.addClass('stuck');
                    } else {
                        $call.removeClass('stuck');
                    }
                }
            }
        });

        $document.on('click', '.up', function(e) {
            e.preventDefault();
            $('body,html').animate({scrollTop: 0}, 800);
        });

        $document.on('click', '.content__open', function() {
            $(this).closest('.content').toggleClass('active');
        });

        $document.on('click', '.filters__more', function () {
            let scrollPos = $(window).scrollTop();
            $(this).closest('.filters__choice').toggleClass('active');
            $html.scrollTop(scrollPos);
        });



        // work with nav on mobile
        $document.on('click', '#call-nav', function() {
            if ($body.hasClass('open-mobile-drop') && !$body.hasClass('open-nav')) {
                $body.addClass('open-nav');
            }
        });

        $document.on('click', '.mobile-menu__back', function() {
            let self = $('nav li.is-visible:last');
            self.removeClass('is-visible').closest('ul').removeClass('is-hidden');

            if (!self.length) {
                $body.removeClass('open-nav');
            }
        });

        $document.on('click', '.nav__button', function() {
            if (!desktopSize(1080)) {
                let self = $(this);
                self.closest('ul').addClass('is-hidden').removeClass('is-visible');
                self.closest('li').addClass('is-visible');
            }
        });
        // end work with nav on mobile


        //magnific init
        $('.popup-modal').magnificPopup({
            type: 'inline',
            preloader: false,
            callbacks: {
                open: function() {

                    const mp = $.magnificPopup.instance,
                        $curr = $(mp.currItem.inlineElement[0]),
                        $swiper = $curr.find('.swiper-container');

                    if ($swiper) {
                        SwiperModule.init($swiper);
                    }
                },
            }
        });

        $('.gallery-popup').each(function () {
            $(this).magnificPopup({
                delegate: 'a',
                type: 'image',
                callbacks: {
                    elementParse: function (item) {
                        if (item.el[0].classList.contains('video-popup')) {
                            item.type = 'iframe',
                            item.iframe = {
                                patterns: {
                                    youtube: {
                                        index: 'youtube.com/',
                                        id: 'v=',
                                        src: 'http://www.youtube.com/embed/%id%?autoplay=1'
                                    },
                                    vimeo: {
                                        index: 'vimeo.com/',
                                        id: '/',
                                        src: 'http://player.vimeo.com/video/%id%?autoplay=1'
                                    }
                                }
                            }
                        } else {
                            item.type = 'image',
                            item.tLoading = 'Loading image #%curr%...',

                            item.image = {
                                tError: '<a href="%url%">The image #%curr%</a> could not be loaded.'
                            }
                        }
                    },
                },
                gallery: {
                    enabled: true,
                    tCounter: '',
                }
            });
        });


        // set video frames
        function findVideos() {
            $(document).on('click', '.video__button', function () {

                let block = $(this).closest('.video__inner');
                let url = block.find('.video__media').attr('data-embed');

                let iframe = $('<iframe allowfullscreen="" allow="autoplay" class="video__media"></iframe>');
                let source = url.replace('watch?v=', 'embed/');
                let query = '?rel=0&showinfo=0&autoplay=1';

                iframe.attr('src', source + query);

                block.append(iframe);
                $(this).remove();
            });
        }
        // end set video frames

    });

    $(window).on('resize', function() {
        stretchFullScreen();

        headerVisibleHeight = $header.height() + headerTopPos;
        $html.css('--globalTopIndent', headerVisibleHeight);
    });

    // cookies
    function cookies() {
        let cookies = $('.cookies');

        if (localStorage.getItem('cookies-accept') === null) {
            cookies.removeClass('hidden');
        }

        cookies.on('click', '.submit', function(e) {
            e.preventDefault();
            cookies.addClass('hidden');
            localStorage.setItem('cookies-accept', 'y');
        });
    }
    // end cookies


    // let stretch block out of container
    function stretchFullScreen() {
        let stretchBox = $('.stretch');

        if (stretchBox.length) {
            let winWidth = $window.width(),
                gap = winWidth - $container.outerWidth(),
                gutter = parseInt($container.css('--containerGutter'), 10);

            if (winWidth > $container.outerWidth()) {
                stretchBox.css({'width': winWidth, 'left': `${(gap + gutter) / -2}px`});
            } else {
                stretchBox.removeAttr('style');
            }
        }
    }
    // end let stretch block out of container


    // set video frames
    function findVideos() {
        $(document).on('click', '.video__button', function() {

            let block = $(this).closest('.video'),
                url = block.find('.video__media').attr('data-embed'),

                iframe = $('<iframe allowfullscreen="" allow="autoplay" class="video__media"></iframe>'),
                source = url.replace('watch?v=', 'embed/'),
                query = '?rel=0&showinfo=0&autoplay=1';

            iframe.attr('src', source + query);

            block.append(iframe);
            $(this).remove();
        });
    }
    // end set video frames




    // helpers
    function scrollbarWidth() {
        let windowWidth = $window.outerWidth(),
            bodyWidth = $body.prop('scrollWidth');
        return windowWidth - bodyWidth;
    }

    function desktopSize(size) {
        return $window.width() >= size;
    }




    // init slick on the details page
    if ($('#details').length) {
        $('#master').slick({
            infinite: true,
            slidesToShow: 1,
            slidesToScroll: 1,
            arrows: false,
            asNavFor: '#slave',
            focusOnSelect: false,
        });

        $('#slave').slick({
            slidesToShow: 6,
            slidesToScroll: 1,
            asNavFor: '#master',
            focusOnSelect: true,
            arrows: false,
            centerPadding: '0',
            responsive: [
                {
                    breakpoint: 480,
                    settings: {
                        slidesToShow: 5,
                    }
                },
            ]
        });
    }

    // end init slick on the details page

}($, window, document));


// rating

(function($) {
    'use strict';

    let rating = (function() {

        Rating.prototype.defaults = {
            rating: void 0,
            max: 5,
            createNode: true,
            readOnly: false,
            listClass: 'rating__list',
            itemClass: 'rating__item',
            fullClass: 'rating__item--full',
            fractionClass: 'rating__item--fraction',
            change: function(e, value) {}
        };

        function Rating($el, options) {
            this.options = $.extend({}, this.defaults, options);
            this.$el = $el;
            this.input = ($($el).find('input').length > 0) ? $($el).find('input') : false;

            if (this.options.createNode) {
                this.$el.append("<ul class='" + this.options.listClass + "'/>");
                for (var i = 0; i < this.options.max; i++) {
                    this.$el.find('ul').append("<li class='" + this.options.itemClass + "'/>");
                }
            }

            this.initRating();

            // if (this.options.readOnly) {
            //     return;
            // }
            if (this.$el.attr('data-mode') !== 'editable') {
                if (this.options.readOnly) {
                    return;
                }
            }

            this.$el.on('mouseover.' + this.options.listClass, 'li', (function(_this) {
                return function(e) {
                    return _this.initRating(_this.$el.find('li').index(e.currentTarget) + 1);
                };
            })(this));

            this.$el.on('mouseout.' + this.options.listClass, (function(_this) {
                return function() {
                    return _this.initRating();
                };
            })(this));

            this.$el.on('click.' + this.options.listClass, 'li', (function(_this) {
                return function(e) {
                    e.preventDefault();
                    return _this.setRating(_this.$el.find('li').index(e.currentTarget) + 1);
                };
            })(this));

            this.$el.on('rating:change', this.options.change);
        }

        Rating.prototype.setRating = function(rating) {

            if (this.options.rating === rating) {
                rating = void 0;
            }

            this.$el.attr('data-value', (rating || 0));

            if (this.input) {
                this.input.val(rating || 0);
            }

            this.options.rating = rating;
            this.initRating();
            return this.$el.trigger('rating:change', rating || 0);
        };

        Rating.prototype.initRating = function(rating) {
            let i, j, ref;

            let inp = (this.input) ? parseInt(this.input.val(), 10) : 0;
            let value = (rating) ? rating : Math.max((this.$el.attr('data-value') || 0), inp, (this.options.rating || 0));

            for (i = j = 1, ref = this.options.max; 1 <= ref ? j <= ref : j >= ref; i = 1 <= ref ? ++j : --j) {
                this.$el.find('li').eq(i - 1).removeClass(value >= i ? '' : this.options.fullClass).addClass(value >= i ? this.options.fullClass : '');
            }

            let fullItem = this.$el.find('.rating__item--full');

            if (!Number.isInteger(value)) {
                let result = Math.asin(2 * (value - Math.trunc(value)) - 1) / Math.PI + 0.5;
                fullItem.last().next()
                    .addClass(this.options.fractionClass)
                    .attr('style', `--fraction: ${result.toFixed(2)}`);
            }
        };

        return Rating;
    })();

    return $.fn.rating = function() {

        let option = arguments[0] || [];

        return this.each(function() {
            if (!$(this).data('rating')) {
                $(this).data('rating', (new rating($(this), option)));
            }
        });
    };
})(jQuery);

// end rating


// tabs
(function($) {
    'use strict';

    let tab = (function () {

        Tab.prototype.defaults = {
            itemClass: 'tab-item',
            itemActive: 'active',
            itemDefault: 'default',
            change: function(e, tab, url) {
            }
        };

        function Tab($el, options) {
            this.options = $.extend({}, this.defaults, options);
            this.$el = $el;

            this.initTab();
            this.initBox(window.location.hash, true);

            this.$el.on('click.' + this.options.itemClass, 'a.tab-link', (function (_this) {
                return function(e) {
                    let hUrl = $(this).attr('href');
                    if ($(hUrl).length > 0) {
                        e.preventDefault();
                        _this.initBox(hUrl, false);
                    }
                };
            })(this));
        }

        Tab.prototype.initBox = function(target, isAuto = true) {
            let thisTab = $(target);

            if (thisTab.length > 0) {
                let item = $("a[href='" + target + "']");
                item.parent().addClass(this.options.itemActive).siblings().removeClass(this.options.itemActive);
                thisTab.addClass(this.options.itemActive).siblings().removeClass(this.options.itemActive);
                this.$el.find('.tab-content').attr('class', 'tab-content').addClass('tab-content--' + target.replace('#', ''));

                history.replaceState({}, '', item.attr('href'));

                let $swiper = thisTab.find('.swiper-container:not(.swiper-container-initialized)');
                if ($swiper) {
                    SwiperModule.init($swiper);
                }

                if (!isAuto) {
                    this.options.change.call(this, {}, thisTab, target);
                }
            }
        };

        Tab.prototype.initTab = function () {
            let item = this.$el.find('.' + this.options.itemDefault).addClass(this.options.itemActive);
            let hash = item.find('a').attr('href');

            if ($(hash).length > 0) {
                $(hash).addClass(this.options.itemActive);
            }
        };

        return Tab;
    })();

    return $.fn.tab = function () {
        let option = arguments[0] || [];
        return this.each(function () {
            $(this).data('tabObj', (new tab($(this), option)));
        });
    };

})(jQuery);
// end tabs


var SwiperModule = (function () {
    const swiperParams = {
        products: {
            spaceBetween: -1,
            breakpoints: {
                '9999': {
                    'slidesPerView': 5,
                },
                '960': {
                    'slidesPerView': 3.5,
                },
                '768': {
                    'slidesPerView': 3,
                },
                '600': {
                    'slidesPerView': 2,
                },
            },
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev'
            },
            scrollbar: {
                el: '.swiper-scrollbar',
                draggable: true
            },
        },
        onlyScroll: {
            spaceBetween: -1,
            breakpoints: {
                '9999': {
                    'slidesPerView': 5,
                },
                '960': {
                    'slidesPerView': 3.5,
                },
                '768': {
                    'slidesPerView': 3,
                },
                '600': {
                    'slidesPerView': 2,
                },
            },
            scrollbar: {
                el: '.swiper-scrollbar',
                draggable: true
            },
        },
        onlyButtons: {
            spaceBetween: -1,
            breakpoints: {
                '9999': {
                    'slidesPerView': 5,
                },
                '960': {
                    'slidesPerView': 3.5,
                },
                '768': {
                    'slidesPerView': 3,
                },
                '600': {
                    'slidesPerView': 2,
                },
            },
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev'
            },
        },
        firstScreen: {
            spaceBetween: 0,
            slidesPerView: 1,
            watchSlidesProgress: true,
            virtualTranslate: true,
            effect: 'fade',
            fadeEffect: {
                crossFade: true,
            },
            autoplay: {
                delay: 5000,
                enabled: true,
                waitForTransition: false,
                disableOnInteraction: false
            },
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
            },
        },
        comparison: {
            spaceBetween: 1,
            breakpoints: {
                '9999': {
                    'slidesPerView': 3,
                },
                '1080': {
                    'slidesPerView': 2,
                },
            },
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
            },
        },
        comparisonList: {
            spaceBetween: 1,
            breakpoints: {
                '9999': {
                    'slidesPerView': 3,
                },
                '1080': {
                    'slidesPerView': 2,
                },
            },
        },
    };

    const dataParamsName = 'params';

    let swiperData = {},
        thumbMaster = {},
        thumbSlave = {};

    let extend = function () {
        let extended = {},
            deep = false,
            i = 0,
            length = arguments.length;

        if (typeof (arguments[0]) === 'boolean') {
            deep = arguments[0];
            i++;
        }

        function merge(obj) {
            for (let prop in obj) {
                if (obj.hasOwnProperty(prop)) {
                    if (deep && Object.prototype.toString.call(obj[prop]) === '[object Object]') {
                        extended[prop] = extend(true, extended[prop], obj[prop]);
                    } else {
                        extended[prop] = obj[prop];
                    }
                }
            }
        }

        for (; i < length; i++) {
            let obj = arguments[i];
            merge(obj);
        }

        return extended;
    };

    let initSwiper = function (elem) {
        if (!elem || !elem.length) {
            return;
        }

        let key = elem.data(dataParamsName);
        if (!key) {
            return;
        }

        swiperData[key] = new Swiper(elem, {
            on: {
                init: function() {
                    let self = this,
                        data = $(self.el).data();
                    self.params = extend(true, self.params, swiperParams[key] || {});

                    if ('master' in data) thumbMaster = self;
                    if ('slave' in data) thumbSlave = self;

                    if ('loop' in data) {
                        if (self.slides.length > 1) {
                            self.loopCreate();
                            self.params.loop = true;
                        }
                    }

                    self.slides.css('width', '');
                    self.update();
                }
            },
            watchOverflow: true,
            touchEventsTarget: 'wrapper',
            simulateTouch: false,
            roundLengths: true
        });

        if (!$.isEmptyObject(thumbMaster) && !$.isEmptyObject(thumbSlave)) {
            thumbSlave.controller.control = thumbMaster;
            thumbMaster.controller.control = thumbSlave;
        }
    };

    let init = function (elem) {
        if (!elem.length) {
            return;
        }

        elem.each(function () {
            initSwiper($(this));
        });
    };

    let get = function (elem) {
        if (!elem || !elem.length) {
            return void(0);
        }

        let key = elem.data(dataParamsName);
        return swiperData[key] || void(0);
    };

    // Facade
    return {
        init: init,
        get: get,
    };
}());
