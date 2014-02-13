$(function(){

    var elCover = $('#cover'),
        elMail = $('#mail')
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

    $('#cover').click(function(){
        elCover.fadeOut(1000);
        elMail.fadeIn(1000);
    })

    $("#demo").typewriter({
        delay: 500,
        random: true,
        randomMax: 200
    });
})