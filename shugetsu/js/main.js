$(function(){

    var elCover = $('#cover'),
        elContent = $('#content');

    //slide cover
    $('.love > div > div > div').each(function(){
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
        },1000);
    });

    $('#cover').on('tap', function(){
        elCover.fadeOut(1000);
        elContent.fadeIn(1000);
    });

    var elEnvelope = $('.envelope').eq(0);
        elPaper = $('.paper').eq(0);

    var elMTitle = $('#m_title'),
        elMContent = $('#m_content'),
        elMSig = $('#m_sig');

    elEnvelope.on('tap', function(){
        elPaper
    })
    /*
    $("#demo").typewriter({
        delay: 500,
        random: true,
        randomMax: 200
    });
    */
})