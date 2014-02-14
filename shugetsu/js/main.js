$(function(){

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
            if(pt > -100) {
                et += 1;
                ph += 5;
                pt -= 5;
                if(ph < 230) {
                    elPaper.css({ height: ph + 'px'});
                }
                if(et < 210) {
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


})