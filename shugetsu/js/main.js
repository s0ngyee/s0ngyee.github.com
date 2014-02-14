$(function(){

    $.mobile.loadingMessage = false;

    var elCover = $('#cover'),
        elContent = $('#content');

    //slide cover
    var elDots =   $('.love > div > div > div');
    elDots.each(function(i){
        var el = $(this);
        el.css({
            position: 'relative',
            top: '-200px',
            opacity: 0
        });
        var wait = Math.floor((Math.random()*3000)+1);
        el.delay(wait).animate({
            top: '200px',
            opacity: 1
        }, 1000);
    });

    $('#cover').on('tap', function(){
        elCover.fadeOut(1000);
        elContent.fadeIn(1000);
    });

    var elEnvelope = $('.envelope').eq(0),
        elPaper = $('.paper').eq(0),
        elWords = $('#words');

    var t1 = null;

    var type_words = function() {
        elWords.typewriter({
            delay: 100,
            random: true,
            randomMax: 200
        });
    }

    var isExpand = false;

    var show_paper = function() {
        var et = elEnvelope.position().top,
            ph = elPaper.height(),
            pt = elPaper.position().top;

        t1 = setTimeout(function(){
            if(pt > -180) {
                et += 1;
                ph += 5;
                pt -= 5;
                if(ph < 280) {
                    elPaper.css({ height: ph + 'px'});
                }
                if(et < 250) {
                    elEnvelope.css({top: et + 'px'});
                }
                elPaper.css({ top: pt + 'px'});
                show_paper();
            } else {
                clearTimeout(t1);
                type_words();
            }
        }, 50);
    }

    elEnvelope.on('tap', function(){
        if(!isExpand) {
            isExpand = !isExpand;
            show_paper();

        }
    });

    var elCarrot = $('.carrot').eq(0),
        elLantern = $('.lantern').eq(0),
        elClouds = $('.clouds').eq(0),
        elRabbit = $('.rabbit').eq(0);
    elCarrot.on('tap', function(){
        elLantern.fadeIn(1000);
        elClouds.animate({
            left: '+=250'
        }, 8000);
        elRabbit.animate({
            left: '+=200'
        }, 10000, function(){
            elLantern.fadeOut(3000);
        });
    })

})