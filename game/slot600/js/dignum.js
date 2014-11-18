function DigNum() {
    
}

/*
function DigNum() {
    var defaults = {
        game: null
    };

    var a = arguments,
        o = a[0] || {},
        options = $.extend(defaults, o),
        self = this;
        
    self.game = options.game;
    
    self.el = $('.score-board .num');
    
    self.tpl_digits = '<span class="ico-dig"></span>';
    
    self.elDigits = self.el.children();
    
    self.thread = null;
    
}

DigNum.prototype = {
    display: function() {
        var self = this;
        var point = self.game.earn.toString(),
            plen = point.length,
            bit = 0;
        if(plen <= 4) {
            for(var i = 0, len = 4 - plen; i < len; i++) {
                point = '0' + point;
            }
            plen = 4;
        }
        for(var i = 0; i < plen; i++) {
            var el = $(self.elDigits[i]);
            self.reset(i);
        }
        
        //digit bit animation
        var animate = function() {
            clearTimeout(self.thread);
            if(bit < plen) {
                self.set(bit, point[bit]);
                self.thread = setTimeout(function(){
                    bit++;
                    animate();
                }, 500);
            }
        }
        animate();
    },
    set: function(i, n){
        var self = this;
        var el = self.elDigits[i];
        self.reset(i);
        $(el).addClass('n' + n);
    },
    reset: function(i) {
        var self = this;
        var el = self.elDigits[i];
        if(!el) {
            el = $(self.tpl_digits)[0];
            self.el.append(el);
            self.elDigits.push(el);
        }
        var result = el.className.match(/n\d/g),
            cls = result ? result[0] : '';
        if(result) {
            var cls = result[0];
            $(el).removeClass(cls);
        }
    }
};
*/