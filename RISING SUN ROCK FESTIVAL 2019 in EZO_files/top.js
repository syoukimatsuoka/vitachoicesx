$(function(){
    $(window).on('load', function(){
        $(".mv_slick").slick({
            dots: false,
            swipe: false,
            arrows: false,
            speed: 1800,
            autoplay: true,
            autoplaySpeed: 4000,
            fade: true,
            easing: 'ease-out',
            lazyLoad:'ondemand'
        });
    });

    $('.mv_page_prev').on('click',function(){
        $('.mv_slick').slick('slickPrev');
    });

    $('.mv_page_next').on('click',function(){
        $('.mv_slick').slick('slickNext');
    });

    var mvItemSize = $('.mv_slick .top_mv_item').length;
    $('.mv_num_max').html(mvItemSize);

    $(document).on('click touchend', '.top_mv_page', function(){
        var index = $('.slick-current').index('.mv_slick .top_mv_item');
        $('.mv_num').html(index + 1);
    });
    $('.mv_slick').on('afterChange', function(event, slick, currentSlide){
        var index = $('.slick-current').index('.mv_slick .top_mv_item');
        $('.mv_num').html(index + 1);
    });

    newsSlide();
    $(window).on('load resize orientationchange', function(){
        var browserWidth = $(window).width();
        if( browserWidth >= 920 ){
            $('.news_list_item').matchHeight();
        }
        if( browserWidth >= 920 && !$('.news_list_slide').hasClass('slick-slider')){
            newsSlide();
        } else if( browserWidth < 920 ) {
            $('.news_list_slide').slick('unslick');
            $('.news_list_item').matchHeight({
                remove: true
            });
        }
    });
    function newsSlide(){
        $('.news_list_slide').slick({
            dots: false,
            arrows:true,
            speed: 500,
            easing: 'ease-out',
            lazyLoad:'ondemand',
            infinite: false,
            autoplay: false,
            slidesToShow: 3,
            slidesToScroll: 1,
        });
    }

    $(".contents_sub_slide").slick({
        dots: false,
        speed: 500,
        easing: 'ease-out',
        lazyLoad:'ondemand',
        infinite: true,
        autoplay: false,
        slidesToShow: 3,
        slidesToScroll: 1,
        responsive: [
            {
              breakpoint: 768,
              settings: {
                slidesToShow: 1,
                slidesToScroll: 1
              }
            }
        ]
    });

});

var RSR = RSR || {};

RSR.TOP = {};
RSR.TOP.WARNING = {
    $warningArea: null,
    $warningTxtArea: null,
    $warningTxt: null,
    warningWrapW : null,
    warningW: null,
    warningL: null,
    warningTimer: null,
    winObj: RSR.COMMON.WINDOW,
    init: function(){
        this.setParameters();
        this.bindEvents();
        this.warningAnime();
    },
    setParameters: function(){
        this.$warningArea = $("#warningTicketArea");
        this.$warningTxtArea = this.$warningArea.find("p");
        this.$warningTxt = this.$warningTxtArea.find("span");
        this.warningW = this.$warningTxt.width();
        this.warningL = this.warningWrapW = this.$warningArea.width();
    },
    bindEvents: function(){
        this.winObj.$win.on('onWinSizeChange',$.proxy(this.warningWChange,this));
        var self = this;
        var cancelFrame = window.cancelAnimationFrame || window.clearTimeout;
        this.$warningArea.on('mouseenter',function(){
            cancelFrame(self.warningTimer);
        }).on('mouseleave', $.proxy(this.warningAnime,this));
    },
    warningAnime: function(){
        this.warningL--;
        this.$warningTxtArea.css("left",this.warningL);
        if(this.warningL == -this.warningW){
            this.warningL = this.warningWrapW;
        }
        var animationFrame = window.requestAnimationFrame || window.setTimeout;
        this.warningTimer = animationFrame($.proxy(this.warningAnime,this), 1000/24);
    },
    warningWChange: function(){
        this.warningWrapW = this.$warningArea.width();
        this.warningW = this.$warningTxt.width();
    }
};

$(document).on("ready", function(){
    RSR.TOP.WARNING.init();
});