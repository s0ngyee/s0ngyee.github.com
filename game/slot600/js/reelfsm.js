function ReelFSM() {
    var defaults = {
        reel: null
    };

    var a = arguments,
        o = a[0] || {},
        options = $.extend(defaults, o),
        self = this;
    
    self.state = null;
    
    self.reel = options.reel;
        
    ReelFSM.instance = this;
}

ReelFSM.getInstance = function(defs) {
    if(typeof ReelFSM.instance === 'object') {
        return ReelFSM.instance;
    }
    return new ReelFSM(defs);
}

ReelFSM.prototype = {
    change: function(state) {
        var self = this;
        self.state = state;
    },
    update: function() {
        var self = this;
        self.state.execute(self.reel);
    }
};