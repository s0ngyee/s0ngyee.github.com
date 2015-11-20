function Game() {
    
    var defaults = {
        
    };
    
    var a = arguments,
        o = a[0] || {},
        options = $.extend(defaults, o),
        self = this;

    self.el = $('.game').eq(0);
    
    self.elTxtPoint = $('.txt_point');
    
    //neon element
    self.elBanner = $('.banner').eq(0);
    self.banner_step = 1;
        
    //reel element
    self.reel = new Reel({
        game: self
    });
    
    //score board
    self.rewardboard = new RewardBoard({
        game: self
    });
    
    //controller
    self.controller = new Controller({
        game: self 
    });
    
    //current bets
    self.bets = Game.CONFIG.BET.MIN;
    
    //earn point
    self.earn = 0;
    
    self.award = {
        redeem: 0,
        name: '',
        value: Game.ENUM.REWARD.NONE,
        point: 0,
        icon: Reel.ENUM.SYMBOL.NONE
    };
    
    self.thread = {
        reel: null,
        neon: null
    }
}

Game.ENUM = {
    BET: {
        APPEND: 0,
        SUBTRACT: 1,
        MAX: 2
    },
    REWARD: {
        MISS: 0,
        DOUBLE: 1,
        TEN_TIMES: 2,
        HUNDRED_TIMES: 3,
        GIFT: 4,
        SECRET: 5
    }
};

Game.CONFIG = {
    FPS: 180,
    BET: {
        MIN: 50,
        MAX: 100000,
        STEP: 50
    }
};

Game.shuffle = function(array) {
    var len = array.length,
    j,
    temp;
    for(var i = len - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array;
};

Game.prototype = {
    calculate: function() {
        var self = this;
        
        var result = Game.shuffle([0, 1, 2, 3, 4, 5]).shift();
        self.reel.calculate(result);
    },
    neon_loop: function() {
        var self = this;
        
        clearTimeout(self.thread.neon);
        
        self.thread.neon = setTimeout(function(){
            var result = self.elBanner[0].className.match(/step\d/g),
                cls = result ? result[0] : '';
            if(result) {
                var cls = result[0];
                self.elBanner.removeClass(cls);
            }
            self.banner_step = self.banner_step > 5 ? 1 : self.banner_step;
            self.elBanner.addClass('step' + self.banner_step);
            self.banner_step++;
            self.neon_loop();
        }, 3000);
    },
    reel_loop: function() {
        var self = this;
        
        clearTimeout(self.thread.reel);
        
        self.thread.reel = setTimeout(function(){
            self.reel.update();
            self.reel_loop();
        }, 1000/Game.CONFIG.FPS);
    },
    run: function() {
        var self = this;
        
        //change state
        self.reel.getFSM().change(new ReelStateStop());
        
        //loop
        self.neon_loop();
        self.reel_loop();
        
        //init
        self.controller.init();
    },
    play: function() {
        var self = this;
        
        self.reel.getFSM().change(new ReelStateSpeedUp());
        self.calculate();
        setTimeout(function(){
            self.reel.getFSM().change(new ReelStateSpeedDown());
        }, 500);
    },
    reward: function() {
        var self = this;
        setTimeout(function(){
            if(self.award.value != Game.ENUM.REWARD.MISS) {
                self.rewardboard.display();
            } else {
                UI.popup({
                    msg: '这次你没中奖，请再接再厉！'
                });
            }
            self.controller.reset();
            
        }, 1000);
        self.reel.getFSM().change(new ReelStateStop());
    }
}