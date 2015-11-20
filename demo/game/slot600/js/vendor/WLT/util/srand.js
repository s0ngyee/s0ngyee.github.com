/**
 * WLT srand Plugin
 * @require wlt.util.js
 */
;(function($){
    var MULTIPLIER = 0x5DEECE66D,
        ADDEND = 0xB,
        MASK = (1 << 48) - 1;
    
    WLT.util.srand = function() {
        
        var a = arguments,
            s = a[0] || {},
            self = this;
            
        self.seed = 0;
        
        var init = function() {
            self.setSeed(s);
        }
        init();
    };
    
    WLT.util.srand.prototype = {
        setSeed: function(s) {
            var self = this;
            console.log(parseInt(s).toString(2));
            self.seed = (parseInt(s, 2) ^ parseInt(MULTIPLIER, 2)) & MASK;
        },
        next: function(bits) {
            var self = this;
            var seed_o, seed_n;
            seed_o = self.seed;
            seed_n = (seed_o * MULTIPLIER + ADDEND) & MASK;
            if(seed_o != seed_n) {
                self.seed = seed_n;
            }
            return seed_n >>> (48 - bits);
        },
        nextInt: function(n) {
            var self = this,
                bits, val;
            
            if ((n & -n) == n)
                return parseInt((n * self.next(31)) >> 31);
            do {
                bits = self.next(31);
                val = bits % n;
            } while (bits - val + (n - 1) < 0);
            return val;
        }
    };
})(Zepto);
