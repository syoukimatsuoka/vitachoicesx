var RSR = RSR || {};

RSR.COMMON = {};
RSR.COMMON.WINDOW = {
    $win: null,
    $body: null,
    $scrollEl: null,
    $siteWrapper: null,
    winW: null,
    winH: null,
    isTab: null,
    wasTab: null,
    isPC: null,
    wasPC: null,
    sPos: null,
    resizeTimer: false,
    init: function(){
        this.setParameters();
        this.bindEvents();
    },
    setParameters: function(){
        this.$win = $(window);
        this.$body = $("body");
        this.$scrollEl = $("body,html");
        this.$siteWrapper = $("#siteWrapper");
    },
    bindEvents: function(){
        this.$win.on('load', $.proxy(this.loadEvent,this))
        .on('scroll', $.proxy(this.scrollEvent,this))
        .on('resize', $.proxy(this.sizeSetTimer,this));
        var self = this;
        /*$("a[href^='#']").not(".inline_modal").on('click', function(){
            var target = $(this).attr("href");
            self.scrollLink(target);
            return false;
        });*/
    },
    loadEvent: function(){
        this.sizeSet();
        this.sizeSetTimer();
        /*if(location.hash !== '' && location.hash.substr(1,1) !== '&' && $(location.hash).length>0){
            this.scrollLink(location.hash);
        }*/
    },
    /*scrollEvent: function(){
        var drawerObj = RSR.COMMON.DRAWER;
        if(drawerObj.isDrawerOpened) return;
        this.sPos = this.$win.scrollTop();
        this.$win.trigger('onScrollPosChange');
    },*/
    resizeEvent: function(){
        this.sizeSet();
        this.$win.trigger('onWinSizeChange');
        /*this.scrollEvent();*/
        this.wasTab = this.isTab;
        this.wasPC = this.isPC;
    },
    sizeSet: function(){
        this.winW = window.innerWidth;
        this.winH = this.$win.height();
        this.isTab = (this.winW>=768) ? true : false;
        //this.isTab = (this.winW>=768 && this.winW < 1600) ? true : false;
        //this.isPC = (this.winW>=1600) ? true : false;
    },
    sizeSetTimer: function(){
        if(this.resizeTimer !== false){
            clearTimeout(this.resizeTimer);
        }
        this.resizeTimer = setTimeout($.proxy(this.resizeEvent,this), 200);
    },
/*    scrollLink: function(target){
        var headerObj = RSR.COMMON.FIXEDHEADER;
        var offset = (this.isTab || !this.isPC) ? -headerObj.$headerMainArea.outerHeight() : -headerObj.$siteHeaderTop.height()-20;
        $(target).velocity("scroll", { duration: 500, offset: offset});
    }*/
};
RSR.COMMON.FIXEDHEADER = {
    headerFixedBorder: 0,
    isHeaderFixed: null,
    wasHeaderFixed: null,
    $headerMainArea: null,
    $siteHeaderTop: null,
    $headerMainFixedBorder: null,
    $headerHoldsInfo: null,
    winObj: RSR.COMMON.WINDOW,
    drawerObj: null,
    init: function(){
        this.setParameters();
        this.bindEvents();
        this.changeFixedBorder();
    },
    setParameters: function(){
        this.$headerHoldsInfo = $("#headerHoldsInfo");
        this.$headerMainArea = $("#headerMainArea");
        this.$headerMainFixedBorder = $("#headerMainFixedBorder");
        this.$siteHeaderTop = $("#siteHeaderTop");
        this.drawerObj = RSR.COMMON.DRAWER;
    },
    bindEvents: function(){
        this.winObj.$win.on("onScrollPosChange", $.proxy(this.changeScrollPosEvent,this));
        this.winObj.$win.on("onWinSizeChange", $.proxy(this.changeWinSizeEvent,this));
    },
    changeScrollPosEvent: function(){
        this.isHeaderFixed = (this.winObj.sPos > this.headerFixedBorder) ? true : false;
        if(this.drawerObj.isDrawerOpened) return;
        if(this.isHeaderFixed != this.wasHeaderFixed){
            if(this.isHeaderFixed){
                this.fixHeader();
            }else if(this.wasHeaderFixed !== null) {
                this.unfixHeader();
            }
        }
        this.wasHeaderFixed = this.isHeaderFixed;
    },
    changeWinSizeEvent: function(){
        if((this.winObj.isTab === this.winObj.wasTab) &&
            (this.winObj.isPC === this.winObj.wasPC)) return;
        if(this.winObj.isPC){
            this.$headerMainArea.removeClass("header_main_fixed header_opened");
            this.winObj.$siteWrapper.removeClass("header_fixed");
        }else if(this.winObj.isTab) {
            this.winObj.$siteWrapper.removeClass("header_fixed");
        } else {
            this.$headerMainArea.removeClass("header_main_fixed header_opened");
        }
        if(this.drawerObj.isDrawerSecondOpened){
            this.drawerObj.drawerSecondClose();
        }
        this.changeFixedBorder();
        if(this.isHeaderFixed){
            this.fixHeader();
        }
    },
    fixHeader: function(){
        if(this.winObj.isTab){
            this.$headerMainArea.addClass("header_main_fixed");
            var self = this;
            setTimeout(function(){
                self.$headerMainArea.addClass("header_opened");
            },1);
        }else if(!this.winObj.isPC) {
            this.winObj.$siteWrapper.addClass("header_fixed");
        }
        this.winObj.$win.trigger("headerFixed");
    },
    unfixHeader: function(){
        if(this.winObj.isTab){
            this.$headerMainArea.addClass("header_closed");
            var self = this;
            setTimeout(function(){
                self.$headerMainArea.removeClass("header_main_fixed header_opened header_closed");
            },200);
        }else {
            this.winObj.$siteWrapper.removeClass("header_fixed");
        }
        this.winObj.$win.trigger("headerUnfixed");
    },
    changeFixedBorder: function(){
        if(this.winObj.isPC) {
            this.headerFixedBorder = 0;
        }else if(this.winObj.isTab){
            this.headerFixedBorder = this.$headerMainFixedBorder.offset().top - this.$siteHeaderTop.height();
        }else {
            this.headerFixedBorder = this.$headerHoldsInfo.height();
        }
    }
};
$(document).on("ready", function(){
    RSR.COMMON.WINDOW.init();
    if($("img.object_fit_img").length > 0){
        objectFitImages('img.object_fit_img');
    }
    if($(".modal").length > 0){
        $(".modal").magnificPopup({type:'image'});
    }
    $(window).on('load resize orientationchange', function(){
        if($(".inline_modal").length > 0){
            $(".inline_modal").magnificPopup({
                type:'inline',
                fixedContentPos:false
            });
        }
    });
    if($(".modal_close").length > 0){
        $(".modal_close").on('click', function(){
            $.magnificPopup.close();
        });
    }

    var ua = navigator.userAgent;
    if(ua.indexOf('iPhone') > 0 || ua.indexOf('iPod') > 0 || ua.indexOf('Android') > 0 && ua.indexOf('Mobile') > 0){
        var nowDevice = 'sp';
    }else if(ua.indexOf('iPad') > 0 || ua.indexOf('Android') > 0){
        var nowDevice = 'tab';
    }else{
        var nowDevice = 'other';
    }

    $(window).on('load', function(){
        $('body').addClass('page_loaded');
    });

    $(window).on('load resize orientationchange', function(){
        var browserWidth = $(window).width();
        if ( browserWidth > 768 ){
            $('body').addClass('pc_mode').removeClass('sp_mode');
            $('.page_anchor_nav').removeClass('opened');
            $('.page_anchor_nav_list').removeAttr('style');
        } else {
            $('body').removeClass('pc_mode').addClass('sp_mode');
        }
    });

    // #で始まるアンカーをクリックした場合に処理
    $('a[href^="#"]' + 'a:not(a.disable, a.inline_modal)').click(function() {
        if ( $('body').hasClass('sp_mode') ){
            var anchor = 90;
        }else{
            var anchor = 140;
        }
        //var anchor = -1;  //teaser
        var speed = 750;
        var href= $(this).attr("href");
        var target = $(href == "#" || href == "" ? 'html' : href);
        var position = target.offset().top;

        if (target == '#'){
            $('body,html').stop().animate({scrollTop:position}, speed, "easeOutCubic");
        }else{
            $('body,html').stop().animate({scrollTop:position - anchor}, speed, "easeOutCubic");
        }
        return false;
    });
    //リンク無効
    $('a.disable').click(function(){
        return false;
    });
    //ハッシュ付きURL
    var targetID = location.hash;
    $(document).ready(function(){
        if ( $(targetID).length ) {
            $('body,html').animate({scrollTop:0}, 1);
        }
    });
    $(window).on('load', function(){
        if ( $(targetID).length ) {
            if ( $('body').hasClass('sp_mode') ){
                var anchor = 90;
            }else{
                var anchor = 140;
            }
            var position = $(targetID).offset().top;
            var speed = 750;
            $('body,html').animate({scrollTop:position - anchor}, speed, "easeOutCubic");
        }
    });

    //sp_tel_link
    if(navigator.userAgent.match(/(iPhone|iPad|iPod|Android)/)){
        $('.sp_tel_link').each(function() {
            var telNum = $(this).html();
            $(this).html($('<a>').attr('href', 'tel:' + $(this).text().replace(/-/g, '')).append(telNum + '</a>'));
        })
    }

    //gallery_hover
    $('.my-gallery figure').mouseover(function(e) {
        if ( nowDevice == 'other') {
            $('.my-gallery figure').not($(this)).addClass('unhover');
        }
    }).mouseout(function(e) {
        if ( nowDevice == 'other') {
            $('.my-gallery figure').removeClass('unhover');
        }
    });

    //toggle_box
    $('.toggle_box:not(.open_box) .toggle_box_title').click(function(){
        if( $(this).parent('.toggle_box').hasClass('opened') ){
            $(this).parent('.toggle_box').removeClass('opened');
            $(this).next('.toggle_box_text').stop().slideUp(300, 'swing');
            follower.removeClass("cursor_toggle_close");
        } else {
            $(this).parent('.toggle_box').addClass('opened');
            $(this).next('.toggle_box_text').stop().slideDown(300, 'swing');
            follower.addClass("cursor_toggle_close");
        }
    })

    //page_anchor_nav
    $('.page_anchor_nav_menu').click(function(){
        if( $(this).parent('.page_anchor_nav').hasClass('opened') ){
            $(this).parent('.page_anchor_nav').removeClass('opened');
            $(this).next('.page_anchor_nav_list').stop().slideUp(300, 'swing');
        } else {
            $(this).parent('.page_anchor_nav').addClass('opened');
            $(this).next('.page_anchor_nav_list').stop().slideDown(300, 'swing');
        }
    })

    // scroll
    var start_pos = 0;
    $(window).on('load resize orientationchange scroll', function(){
        var scrollTopNow = $(window).scrollTop();
        if ( $('body').hasClass('opening') ) {
            var mvHeight = $('.top_mv').height();

            if ( $('body').hasClass('sp_mode') ) {
                var mvHeightCheck = 60;
            }else{
                var mvHeightCheck = mvHeight + 100;
            }
            if ( scrollTopNow > mvHeightCheck ) {
                $('.top_groval_navi .site_header,.top_groval_mv_navi').addClass('header_scroll');
            }else{
                $('.top_groval_navi .site_header,.top_groval_mv_navi').removeClass('header_scroll');
            }

            if ( scrollTopNow < mvHeight / 2 ) {
                $('.site_header').addClass('header_op_top');
            }else{
                $('.site_header').removeClass('header_op_top');
            }
        }else{
            var pageTitleHeight = $('.page_title').height();
            if ( $('body').hasClass('sp_mode') ) {
                var pagePadding = 60;
            }else{
                var pagePadding = 100;
            }
            if ( scrollTopNow > pagePadding ) {
                $('.site_header').addClass('header_scroll');
            }else{
                $('.site_header').removeClass('header_scroll');
            }
        }

        if (scrollTopNow > start_pos) {
            $('.site_header').addClass('down').removeClass('up');
        } else {
            $('.site_header').addClass('up').removeClass('down');
        }
        start_pos = scrollTopNow;

    });

    $(window).on('load', function(){
        var countup = function(){
            $('.header').addClass('loaded');
        }
        setTimeout(countup, 300);
    });


    //menu
    $('.drawer_menu_first').not('.no_pull_menu').on('click',function(){
        if ( $('body').hasClass('sp_mode') ){
            $('.menu_inner').addClass('active');
            $(this).parent('.drawer_menu_navi_category').addClass('active');
            var menu = $(this).next('.drawer_menu_navi_pull').html();
            $('.navi_pull_area').html(menu);
        }
    });
    $('.menu_back_btn, .menu_close_btn').on('click touchend',function(){
        $('.menu_inner').removeClass('active');
        $('.drawer_menu_navi_category').removeClass('active')
    });


    //inview
    $('.scroll_appear_item').on('inview', function() {
        $(this).addClass('appear_item_active').removeClass('scroll_appear_item');
    });
    $('.scroll_appear_wrap').on('inview', function() {
        $(this).addClass('appear_wrap_active').removeClass('scroll_appear_wrap');
    });


    //luxy
    $(window).on('load', function(){
        if( nowDevice == 'other'){
            luxy.init();
        }
    });

    //mouse_stalker
    var follower = $(".cursor-follower");

    var posX = 0,
        posY = 0;

    var mouseX = 0,
        mouseY = 0;

    TweenMax.to({}, 0.016, {
        repeat: -1,
        onRepeat: function() {
        posX += (mouseX - posX) / 9;
        posY += (mouseY - posY) / 9;

        TweenMax.set(follower, {
            css: {
            left: posX,
            top: posY
            }
        });
        }
    });

    $(document).on("mousemove", function(e) {
        if( $('body').hasClass('pc_mode')){
            mouseX = e.pageX;
            mouseY = e.pageY;
        }
    });

    $(".header_global_navi_category, .page_anchor_nav li").on("mouseenter", function() {
        follower.addClass("cursor_disable");
    }).on("mouseleave", function() {
        follower.removeClass("cursor_disable");
    });

    $(".toggle_box:not(.open_box) .toggle_box_title").on("mouseenter", function() {
        follower.addClass("active cursor_toggle");
        if( $(this).parent('.toggle_box').hasClass('opened')){
            follower.addClass("cursor_toggle_close");
        }
    }).on("mouseleave", function() {
        follower.removeClass("active cursor_toggle cursor_toggle_close");
    });

    $(".zoom_link").on("mouseenter", function() {
        follower.addClass("active cursor_zoom");
    }).on("mouseleave", function() {
        follower.removeClass("active cursor_zoom");
    });

    //.page_slick_main
    if($('.page_slick_main').length){
        var slickItemSize = $('.page_slick_main > li').length;
        $('.slick_num_max').html(slickItemSize);
        $('.page_slick_main').slick({
            dots: false,
            slidesToShow: 1,
            slidesToScroll: 1,
            arrows: true,
            fade: true
        });
        $('.page_slick_prev').on('click',function(){
            $('.page_slick_main').slick('slickPrev');
        });
        $('.page_slick_next').on('click',function(){
            $('.page_slick_main').slick('slickNext');
        });
        $(document).on('click touchend', '.page_slick_main', function(){
            var index = $('.slick-current').index('.page_slick_main .page_slick_item');
            $('.slick_num').html(index + 1);
        });
        $('.page_slick_main').on('afterChange', function(event, slick, currentSlide){
            var index = $('.slick-current').index('.page_slick_main .page_slick_item');
            $('.slick_num').html(index + 1);
        });
        $('.page_slick_main').on('swipe', function(event, slick, direction){
            var index = $('.slick-current').index('.page_slick_main .page_slick_item');
            $('.slick_num').html(index + 1);
        });
    };

});