/**
 * WLT Plugin
 */
;(function($){
   	$.extend(window, {WLT: {
   	    extend: function(Child, Parent) {
            var F = function(){};
            F.prototype = Parent.prototype;
            Child.prototype = new F();
            Child.prototype.constructor = Child;
            Child.uber = Parent.prototype;
   	    }
   	}});
   	
    var POPUP_STYLE = {
        DEFAULT: 0,
        LOADING: 1
    };
    
    WLT.popup = function(){
        
        var defaults = {
            is_modal: 1,
            msg: '',
            width: 150,
            height: 0,
            delay: 1000,
            style: POPUP_STYLE.DEFAULT
        };
        
        var a = arguments,
            o = a[0] || {},
            options = $.extend(defaults, o),
            self = this;
        
        var el = $('<div class="popup-box"></div>'),
            elMsg = $('<p>' + options.msg + '</p>')
        
        var init = function(){
            var ww = $(window).width(),
                wh = $(window).height(),
                w, h;
                
            el.width(options.width);
            if(options.height) {
                el.height(options.height);
            }
            
            if(options.style == POPUP_STYLE.LOADING) {
                el.append('<p><img src="/app_js/wanlitong/v40/wap/vendor/WLT/images/loading.gif" width="24" height="24" /></p>');
            }
            el.append(elMsg);
            $('body').append(el);
            
            w = el.width();
            h = el.height();
            
            el.css({
                top: (wh / 2 - h / 2) + 'px',
                left: (ww / 2 - w / 2) + 'px'
            });
            
            if(options.style == POPUP_STYLE.DEFAULT){
                setTimeout(function(){
                    el.animate({
                        opacity: 0  
                    }, options.delay, function(){
                        el.remove();    
                    });
                }, options.delay);
            }
        }
        init();
        return el;
    }
    WLT.popup.POPUP_STYLE = POPUP_STYLE;
})(Zepto);