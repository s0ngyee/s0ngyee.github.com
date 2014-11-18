/**
 * 
 * 

Reward.ENUM = {
    ITEM_ID: {
        GIFT01: '140106010020429',
        GIFT02: '140106010010429',
        GIFT03: '140106010010430',
        GIFT04: '140106010020430',
        GIFT05: '140106010030430',
        GIFT06: '140106010040430',
        GIFT07: '20140505120',
        GIFT08: '000001',
        GIFT08: '000002',
        GIFT08: '000003',
        GIFT08: '000004'
    },
    ITEM_NAME: {
        GIFT01: '星巴克江浙沪中杯',
        GIFT02: '哈根达斯（单球/雪芭）',
        GIFT03: '麦乐鸡（5块）',
        GIFT04: '麦旋风（奥利奥口味）',
        GIFT05: '板烧鸡腿堡套餐',
        GIFT06: '麦辣鸡腿汉堡套餐',
        GIFT07: '1号店优惠券',
        GIFT08: 'iPhone大奖',
        GIFT08: 'ipadmini大奖',
        GIFT08: '金条大奖',
        GIFT08: '单反相机大奖'
    }
}
 */

function RewardBoard() {
    var defaults = {
        game: null
    };

    var a = arguments,
        o = a[0] || {},
        options = $.extend(defaults, o),
        self = this;
    
    self.game = options.game;
    
    self.thread = null;
    
    self.el = $('<div class="board-reward"></div>');
    
    self.elMask = $('<div class="mask"></div>');
    self.elBoard = $('<div class="board"></div>');
    
    self.elNav = $('<div class="nav"></div>');
    self.elBanner = $('<div class="title">恭喜你</div>');
    self.elItem = $('<div class="item"></div>');
    self.elRewardItem = $('<div class="item-icon"></div>')
    self.elResult = $('<div class="result"></div>');
    self.elScore = $('<div class="point"></div>');
    
    self.elBtnClose = $('<span class="close">x</span>');
    
    self.init();
}

RewardBoard.ENUM = {
    REDEEM: {
        '005': '5元话费积分',
        '0010': '10元话费积分',
        '0020': '20元话费积分',
        '0050': '50元话费积分',
        '00100': '100元话费积分',
        '140106010020429': '星巴克江浙沪中杯',
        '140106010010429': '哈根达斯（单球/雪芭）',
        '140106010010430': '麦乐鸡（5块）',
        '140106010020430': '麦旋风（奥利奥口味）',
        '140106010030430': '板烧鸡腿堡套餐',
        '140106010040430': '麦辣鸡腿汉堡套餐',
        '20140505120': '1号店优惠券',
        '000001': 'iPhone大奖',
        '000002': 'iPadMini大奖',
        '000003': '金条大奖',
        '000004': '单反相机大奖'
    }
}

RewardBoard.prototype = {
    init: function(){
        var self = this;
        
        var elBody = $('body').eq(0),
            h = elBody.height();
        
        self.elNav.append(self.elBtnClose);
        self.elItem.append(self.elRewardItem);
        
        self.elBoard.append(self.elNav);
        self.elBoard.append(self.elBanner);
        self.elBoard.append(self.elItem);
        self.elBoard.append(self.elResult);
        self.elBoard.append(self.elScore);
        
        self.el.append(self.elMask);
        self.el.append(self.elBoard);
        
        self.el.height(h);
        elBody.append(self.el);
        
        self.elBtnClose.on('click', function(){
           self.close(); 
        });
    },
    light_loop: function() {
        var self = this;
        clearTimeout(self.thread);
        
        self.thread = setTimeout(function(){
            self.light_loop();
        }, 500);
    },
    animate: function() {
        var self = this;
    },
    display: function() {
        var self = this;
        
        var reward = self.game.award;
        
        self.light_loop();
        self.elRewardItem.addClass('reward-' + reward.icon);
        self.elResult.html(reward.name);
        self.el.show();
    },
    close: function() {
        var self = this;

        var result = self.elRewardItem[0].className.match(/reward-\d/g),
            cls = result ? result[0] : '';
        self.elRewardItem.removeClass(cls);
        self.el.hide();

        clearTimeout(self.thread);
    }
};