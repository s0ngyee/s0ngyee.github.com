window.onload = function () {
    (function (d) {
        var ce = function (e, n) {
                var a = document.createEvent("CustomEvent");
                a.initCustomEvent(n, true, true, e.target);
                e.target.dispatchEvent(a);
                a = null;
                return false
            },
            nm = true, sp = {x: 0, y: 0}, ep = {x: 0, y: 0},
            touch = {
                touchstart: function (e) {
                    sp = {x: e.touches[0].pageX, y: e.touches[0].pageY}
                },
                touchmove: function (e) {
                    nm = false;
                    ep = {x: e.touches[0].pageX, y: e.touches[0].pageY}
                },
                touchend: function (e) {
                    if (nm) {
                        ce(e, 'fc')
                    } else {
                        var x = ep.x - sp.x, xr = Math.abs(x), y = ep.y - sp.y, yr = Math.abs(y);
                        if (Math.max(xr, yr) > 20) {
                            ce(e, (xr > yr ? (x < 0 ? 'swl' : 'swr') : (y < 0 ? 'swu' : 'swd')))
                        }
                    }
                    ;
                    nm = true
                },
                touchcancel: function (e) {
                    nm = false
                }
            };
        for (var a in touch) {
            d.addEventListener(a, touch[a], false);
        }
    })(document);
//EXAMPLE OF USE
    var h = function (e) {
        console.log(e.target);
        console.log(e.type, e)
    };
    document.body.addEventListener('swu', h, false);
    document.body.addEventListener('swd', h, false);
}

$(function(){
    //auto adaptation
    var calculate_size = function () {
        var BASE_FONT_SIZE = 100;

        var docEl = document.documentElement,
            clientWidth = docEl.clientWidth;
        if (!clientWidth) return;
        docEl.style.fontSize = BASE_FONT_SIZE * (clientWidth / 320) + 'px';
    };

    // Abort if browser does not support addEventListener
    if (!document.addEventListener)
        return;
    var resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize';
    window.addEventListener(resizeEvt, calculate_size, false);
    document.addEventListener('DOMContentLoaded', calculate_size, false);
    calculate_size();

//    //page effect
//    $('.pages').dragend({
//        pageClass: 'page',
//        direction: 'vertical'
//    });

    //rule display
    var elRule = $('.rule').eq(0);

    $('.b-rule').on('click', function(){
        elRule.show();
    });

    $('.b-back').on('click', function(){
        elRule.hide();
    });

    $('.b-apply').on('click', function(){
        console.log('##### apply #####');
//        $(".pages").dragend({
//            scrollToPage: 2
//        });
    });

    //main page
    var elMilk = new Milk();
    elMilk.Initialize('milk');

    var elPopShare = $('.pop-share');
    $('#btn-share').on('click', function(){
        console.log('##### share #####');
        elPopShare.show();
    });
    $('.b-close').on('click', function(){
        elPopShare.hide();
    });

    $('#btn-random').on('click', function(){
        console.log('##### random #####');

        //calculate the level and use the LEVEL POSITION to animate
        var LEVEL_POS = [1.7, 1.53, 1.34, 1.15, 0.96, 0.75, 0.56, 0.36, 0.18, 0.02],
            level = Math.floor(Math.random() * (10 - 1)) + 1;

        $('#milk').animate({
            top: LEVEL_POS[level] + 'rem'
        }, 3000, 'linear', function(){
            $('.volume span').removeClass('a');
            console.log($('.volume .lv' + level));
            $('.volume .lv' + level).addClass('a');
        });
    });

    $('#btn-exchange').on('click', function(){
        console.log('##### exchange #####');

        var phone = $('#user-phone').val();
        if(!phone.match(/1{10}/g)) {
            alert('请输入正确的手机号码!');
            return;
        }
    });
});