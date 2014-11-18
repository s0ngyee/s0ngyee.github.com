var URL_LOGIN = '';

require.config({
    baseUrl: BASE_URL + 'js/',
    paths: {
        'Zepto': 'vendor/zepto/zepto.min',
        'fx': 'vendor/zepto/src/fx',
        'ui': 'ui',
        'game': 'game',
        'controller': 'controller',
        'reel': 'reel',
        'reelfsm': 'reelfsm',
        'reelstate': 'reelstate',
        'rewardboard': 'rewardboard',
        'dignum': 'dignum'
    },
    shim: {
        'Zepto': {
            exports: '$'
        },
        'fx': {
            deps: ['Zepto']
        },
        'ui': {
            deps: ['Zepto', 'fx']
        },
        'game': {
            deps: ['ui', 'controller', 'reel', 'reelfsm', 'reelstate', 'rewardboard', 'dignum']
        }
    }
});
require.onError = function(err){
    if(err.requireType === 'timeout' || err.requireType === 'scripterror') {
        var el = document.createElement('div'),
            elMessage;
        
        var ww = window.innerWidth,
            wh = window.innerHeight,
            w = 200,
            h = 50,
            top = (wh - h) / 2,
            left = (ww - w) / 2;
        
        el.innerHTML = '<div class="popup-box" style="width: ' + w +'px;height:' + h + 'px;left:' + left + 'px;top:' + top + 'px;"><p>网络不给力，点击刷新</p></div>';
        elMessage = el.firstChild;
        document.body.appendChild(elMessage);
        if(window.addEventListener) {
            elMessage.addEventListener('click', function(){
                window.location.reload();
            });
        }
    }
};  

define(function(require, exports, module){
    var $ = require('Zepto');
    
    require('ui');
    require('game');
    
    var game = new Game();
    game.run();
});