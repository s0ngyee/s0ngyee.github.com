/**
 * WLT Page Control Plugin
 * @require wlt.widget.js
 */
;(function($){
	
	WLT.widget.pgctrl = $.fn.pgctrl = function(){
		function PageControl() {
	        var defaults = {
	        	total: 3,
	        	height: 30,
	        	width: '100%'
	        };

	        var a = arguments,
	            o = a[0] || {},
	            options = $.extend(defaults, o),
	            self = this;
	            
	        var tpl_panel = '<div class="pg-ctrl"></div>',
	        	tpl_inner = '<div class="inner"></div>',
	        	tpl_dot = '<span></span>';
	        
	        self.el = $(tpl_panel);
	        self.total = options.total;
	        self.inner = $(tpl_inner);
	        self.step = 0;
	        self.items = [];

	        var init = function(){
	        	for(var i = 0; i < self.total; i++) {
	        		var el = $(tpl_dot);
	        		if(i == self.step) {
	        			el.addClass('curr');
	        		}
	        		self.inner.append(el);
	        		self.items.push(el);
	        	}
	        	self.el.append(self.inner);
	        };
	        init();
		}
		
		PageControl.prototype = {
			change: function(){
        		var self = this;
		        var len = self.items.length;
		        self.inner.children().removeClass('curr');
                self.inner.children().eq(self.step).addClass('curr');
			},
			next: function(){
	            var self = this;
        		self.step++;
        		self.step = self.step > self.total - 1 ? 0 : self.step;
        		self.change();
			},
			prev: function(){
	            var self = this;
        		self.step--;
        		self.step = self.step < 0 ? self.total - 1 : self.step;
        		self.change();
			}
		};

        var a = arguments,
            o = a[0] || {},
            self = this;

        self.pgctrl = new PageControl(o);
        self.append(self.pgctrl.el);
        return this;
	}

})(Zepto);