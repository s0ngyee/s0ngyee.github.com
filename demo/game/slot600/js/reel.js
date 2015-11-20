function Reel() {
    var SRC_REEL_BG = 'images/reel_bg.png',
        SRC_SYMBOL_BG = 'images/symbol_bg.png';

    var defaults = {
        onReward: null,
        game: null
    };

    var a = arguments,
        o = a[0] || {},
        options = $.extend(defaults, o),
        self = this;
        
    self.el = $('#reel_main');
    self.cvs = self.el[0];
    self.ctx = self.cvs.getContext('2d');
    
    self.isReelLoaded = false;
    self.isSymbolLoaded = false;
    
    self.elImgReel = $('<img src="' + SRC_REEL_BG + '" />');
    self.elImgSymbol = $('<img src="' + SRC_SYMBOL_BG + '" />');

    self.game = options.game;
    
    self.reelFSM = ReelFSM.getInstance({
        reel: self
    });
    
    //reels item
    self.reels = [
        [Reel.ENUM.SYMBOL.COIN, Reel.ENUM.SYMBOL.GIFT, Reel.ENUM.SYMBOL.EGGPLANT, Reel.ENUM.SYMBOL.MELON, Reel.ENUM.SYMBOL.STRAWBERRY, Reel.ENUM.SYMBOL.LEMON],
        [Reel.ENUM.SYMBOL.COIN, Reel.ENUM.SYMBOL.GIFT, Reel.ENUM.SYMBOL.EGGPLANT, Reel.ENUM.SYMBOL.MELON, Reel.ENUM.SYMBOL.STRAWBERRY, Reel.ENUM.SYMBOL.LEMON],
        [Reel.ENUM.SYMBOL.COIN, Reel.ENUM.SYMBOL.GIFT, Reel.ENUM.SYMBOL.EGGPLANT, Reel.ENUM.SYMBOL.MELON, Reel.ENUM.SYMBOL.STRAWBERRY, Reel.ENUM.SYMBOL.LEMON]
    ];

    //reel length
    self.reel_length = Reel.CONFIG.REEL.COUNT * (Reel.CONFIG.SYMBOL.HEIGHT + 35);
    
    //current position
    self.reel_position = [0, 0, 0];
    
    //stop position
    self.reel_stop_position = [0, 0, 0];
    
    //slow flag
    self.slow_flag = [0, 0, 0];
    
    //reel speed
    self.reel_speed = [0, 0, 0];
    
    self.init();
}

Reel.ENUM = {
    STATE: {
        STOP: 0,
        SPD_UP: 1,
        SPD_DOWN: 2,
        REWARD: 3,
        RESET: 4
    },
    SYMBOL_NAME: {
        0: '金币',
        1: '礼物',
        2: '茄子',
        3: '西瓜',
        4: '草莓',
        5: '柠檬',
    },
    SYMBOL: {
        NONE: -1,
        COIN: 0,
        GIFT: 1,
        EGGPLANT: 2,
        MELON: 3,
        STRAWBERRY: 4,
        LEMON: 5
    },
    REWARD: {
        NONE: -1,
        MISS: 0,
        DOUBLE: 1,
        TEN_TIMES: 2,
        HUNDRED_TIMES: 3,
        GIFT: 4,
        SECRET: 5
    }
};

Reel.CONFIG = {
    CANVAS: {
        WIDTH: 310,
        HEIGHT: 375
    },
    SPEED: {
        MAX: 300 / 60,
        UP: 60 / 60,
        DOWN: 60 / 60
    },
    REEL: {
        COLUMN: 3,
        ROW: 3,
        COUNT: 6
    },
    SYMBOL: {
        WIDTH: 90,
        HEIGHT: 115,
        TOP: 10,
        LEFT: 10
    },
    RESOURCE: {
        REEL: 'images/reel_bg.png',
        SYMBOL: 'images/symbol_bg.png'
    },
    REEL_BG: {
        LEFT: 0,
        TOP: 120,
        WIDTH: 620,
        HEIGHT: 251
    },
    //DEPRECATE
    ACCELERATION: {
        UP: 60 / 60,
        DOWN: 60 / 60
    },
    MAX_SPD: 300 / 60,
    REEL_COUNT: 3,
    ROW_COUNT: 6,
    REEL_POSITION: 6
};

Reel.shuffle = function(array) {
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

Reel.prototype = {
    init: function() {
        var self = this;

        //shuffle
        for(var i = 0; i < Reel.CONFIG.REEL_COUNT; i++) {
            self.reels[i] = Reel.shuffle(self.reels[i]);
        }
        
        //set canvas size
        self.cvs.width = Reel.CONFIG.CANVAS.WIDTH;
        self.cvs.height = Reel.CONFIG.CANVAS.HEIGHT;
        
        self.elImgReel.on('load', function(){
            self.isReelLoaded = true;
        });
        
        self.elImgSymbol.on('load', function(){
            self.isSymbolLoaded = true;
        });
    },
    calculate: function(result) {
        var self = this;
        var stop_icons = [],
            rewards = [Reel.ENUM.SYMBOL.COIN, Reel.ENUM.SYMBOL.GIFT, Reel.ENUM.SYMBOL.EGGPLANT, Reel.ENUM.SYMBOL.MELON, Reel.ENUM.SYMBOL.STRAWBERRY, Reel.ENUM.SYMBOL.LEMON];
        switch(result) {
            case Reel.ENUM.REWARD.DOUBLE:
                rewards = Reel.shuffle(rewards);
                var icon_index_1 = rewards.shift(),
                    icon_index_2 = rewards.shift();
                stop_icons = Reel.shuffle([icon_index_1, icon_index_1, icon_index_2]);
                self.game.award.icon = icon_index_1;
                break;
            case Reel.ENUM.REWARD.TEN_TIMES:
                var icon_index = parseInt(Math.random()*(Reel.ENUM.SYMBOL.LEMON - Reel.ENUM.SYMBOL.EGGPLANT + 1) + Reel.ENUM.SYMBOL.EGGPLANT);
                stop_icons = [icon_index, icon_index, icon_index];
                self.game.award.icon = icon_index;
                break;
            case Reel.ENUM.REWARD.HUNDRED_TIMES:
                stop_icons = [Reel.ENUM.SYMBOL.COIN, Reel.ENUM.SYMBOL.COIN, Reel.ENUM.SYMBOL.COIN];
                self.game.award.icon = Reel.ENUM.SYMBOL.COIN;
                break;
            case Reel.ENUM.REWARD.GIFT:
            case Reel.ENUM.REWARD.SECRET:
                stop_icons = [Reel.ENUM.SYMBOL.GIFT, Reel.ENUM.SYMBOL.GIFT, Reel.ENUM.SYMBOL.GIFT];
                self.game.award.icon = Reel.ENUM.SYMBOL.GIFT;
                break;
            default:
                rewards = Reel.shuffle(rewards);
                stop_icons = [rewards.shift(), rewards.shift(), rewards.shift()];
                self.game.award.icon = -1;
        }
        
        for (var i = 0; i < Reel.CONFIG.REEL_COUNT; i++) {
            self.slow_flag[i] = 0;
            var stop_index = self.reels[i].indexOf(stop_icons[i]);
            stop_index = stop_index - 1 < 0 ? (Reel.CONFIG.ROW_COUNT - 1) : (stop_index - 1);
            self.reel_stop_position[i] = stop_index * Reel.CONFIG.SYMBOL.HEIGHT + 15;
        }
    },
    getFSM: function() {
        var self = this;
        return self.reelFSM;
    },
    update: function() {
        var self = this;
        self.reelFSM.update();
    },
    draw: function() {
        var self = this;
        
        //draw reel background
        self.ctx.drawImage(self.elImgReel[0], 0, 0, Reel.CONFIG.REEL_BG.WIDTH, Reel.CONFIG.REEL_BG.HEIGHT, Reel.CONFIG.REEL_BG.LEFT, Reel.CONFIG.REEL_BG.TOP, Reel.CONFIG.REEL_BG.WIDTH / 2, Reel.CONFIG.REEL_BG.HEIGHT / 2);
        self.ctx.beginPath();
        self.ctx.rect(0, 0, Reel.CONFIG.REEL_BG.WIDTH, Reel.CONFIG.REEL_BG.HEIGHT * 3);
        self.ctx.clip();
        
        //draw reel
        for (var i = 0; i < Reel.CONFIG.REEL_COUNT; i++) {
            for (var j = 0; j < Reel.CONFIG.REEL.ROW + 1; j++) {
                var current_index, symbol_offset, icon_index;
                
                symbol_offset = self.reel_position[i] % Reel.CONFIG.SYMBOL.HEIGHT + j;
                current_index = Math.floor(self.reel_position[i] / Reel.CONFIG.SYMBOL.HEIGHT);
                current_index = current_index >= Reel.CONFIG.REEL.COUNT ? current_index - Reel.CONFIG.REEL.COUNT : current_index;
                
                wrap_index = current_index + j >= Reel.CONFIG.REEL.COUNT ? (current_index + j) % Reel.CONFIG.REEL.COUNT : current_index + j;
                icon_index = self.reels[i][wrap_index];

                var sx, sy, x, y;
                
                sx = 0;
                sy = 180 * icon_index;
                x = i * Reel.CONFIG.SYMBOL.WIDTH + Reel.CONFIG.SYMBOL.LEFT * (i + 1);
                y = j * Reel.CONFIG.SYMBOL.HEIGHT  + Reel.CONFIG.SYMBOL.TOP * (j + 1) - symbol_offset;

                self.ctx.drawImage(self.elImgSymbol[0], sx, sy, 180, 180, x, y, 90, 90);
                //console.log('reel position:' + self.reel_position[i] + ' wrap_index:' + wrap_index + ' position y:' + y + ' symbol offset:' + symbol_offset);
            }
        }
    },
    move: function(n) {
        var self = this;
        self.reel_position[n] -= self.reel_speed[n];
        if(self.reel_position[n] < 0) {
            self.reel_position[n] += self.reel_length;
        }
    },
    speed_up: function() {
        var self = this;
        for (var i = 0; i < Reel.CONFIG.REEL.COLUMN; i++ ) {
            self.move(i);
            if(self.reel_speed[i] < Reel.CONFIG.MAX_SPD) {
                self.reel_speed[i] += Reel.CONFIG.SPEED.UP;
            }
        }
    },
    speed_down: function () {
        var self = this;

        if (self.reel_speed[2] == 0) {
            self.getFSM().change(new ReelStateReset());
        }
        for (var i = 0; i < Reel.CONFIG.REEL.COLUMN; i++) {
            self.move(i);
            if(!self.slow_flag[i]) {
                var check_position = false;
                if (i == 0) {
                    check_position = true;
                } else if (self.slow_flag[i - 1]) {
                    check_position = true;
                }
                if(check_position) {
                    //console.log('reel position:' + self.reel_position[i] + ' stop position: ' + self.reel_stop_position[i]);
                    if(self.reel_position[i] == self.reel_stop_position[i]) {
                        self.slow_flag[i] = 1;
                    }
                }
            } else {
                if (self.reel_speed[i] > 0) {
                    self.reel_speed[i] -= Reel.CONFIG.SPEED.DOWN;
                }
            }
        }
    },
    reset: function () {
        
    }
}