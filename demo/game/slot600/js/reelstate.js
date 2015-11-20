function ReelState() {
    var defaults = {
        
    };

    var a = arguments,
        o = a[0] || {},
        options = $.extend(defaults, o),
        self = this;
}

/**
 * Reel Stop State
 */
function ReelStateStop() {
    var defaults = {
        
    };

    var a = arguments,
        o = a[0] || {},
        options = $.extend(defaults, o),
        self = this;
}

ReelStateStop.prototype = {
    execute: function(reel) {
        var self = this;
        
        //draw reel
        if(reel.isSymbolLoaded && reel.isReelLoaded) {
            reel.draw();
        }
    }
}

/**
 * Reel Reward State
 */
function ReelRewardState() {
    
}

ReelRewardState.prototype = {
    execute: function() {
        var self = this;
        console.log('#### reward state execute ####');
    }    
}

/**
 * Reel State Speed Up
 */
function ReelStateSpeedUp() {
    
}

ReelStateSpeedUp.prototype = {
    execute: function(reel) {
        var self = this;
        reel.speed_up();
        reel.draw();
    }    
}

/**
 * Reel State Speed Down
 */
function ReelStateSpeedDown() {
    
}

ReelStateSpeedDown.prototype = {
    execute: function(reel) {
        var self = this;
        reel.speed_down();
        reel.draw();
    }    
}

/**
 * Reel Reset State
 */
function ReelStateReset() {
    
}

ReelStateReset.prototype = {
    execute: function(reel) {
        var self = this;
        reel.game.reward();
    }    
}