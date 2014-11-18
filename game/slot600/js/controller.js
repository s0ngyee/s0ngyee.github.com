function Controller() {

    var defaults = {
        game: null
    };

    var a = arguments,
        o = a[0] || {},
        options = $.extend(defaults, o),
        self = this;
        
    self.game = options.game;
    
    self.url_login = '';
    
    //button play
    self.elBtnPlay = $('#btn_play');
    
    //button append
    self.elBtnAppend = $('#btn_bet_append');
    
    //button subtract
    self.elBtnSubtract = $('#btn_bet_subtract');
}

Controller.prototype = {
    init: function() {
        var self = this;
        
        self.elBtnPlay.on('click', function(){
            var el = $(this);
            el.addClass('on');
            self.game.play();
        });
        
        self.elBtnAppend.on('click', function(){
            var el = $(this);
        });
        
        self.elBtnSubtract.on('click', function(){
            var el = $(this);
        });
    },
    play: function() {
        
    },
    bet: function () {
        
    },
    reset: function() {
        var self = this;
        self.elBtnPlay.removeClass('on');
    }
};