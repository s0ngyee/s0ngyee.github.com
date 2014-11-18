/**
 * WLT Mask Plugin
 * @require wlt.js
 */
;(function($){
    WLT.mask = function(){
        function Mask() {
            var defaults = {
                    
            };
            
            var a = arguments,
                o = a[0] || {},
                options = $.extend(defaults, o),
                self = this;
            
            var el;
                
            var init = function(){
                var elBody = $('body').eq(0);
                
                el = $('<div class="mask" style="background:black;opacity:0.4;position:absolute;left:0;top:0;width:100%;"></div>'),
                el.height(elBody.height());
            }
            
            init();
            
            return el;
        }

        var a = arguments,
            o = a[0] || {};
            
        return new Mask(o);
    }
})(Zepto)