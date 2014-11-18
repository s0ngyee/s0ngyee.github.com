/**
 * WLT Carousel Plugin
 * @require wlt.widget.js
 */
;(function($){
	var PAGE_CONTROL = {
        NONE: 0,
        INDICATOR: 1,
        NUMBER: 2
   	};

	var timer;

	WLT.widget.carousel = $.fn.carousel = function(){
        function Carousel(){
	        var defaults = {
	        	width: 320,
	        	height: 100,
	        	data: [],
	        	tracks: [],
	        	speed: 3000,
	        	transition: 200,
	        	scrollable: false,
	        	page_control: PAGE_CONTROL.NONE,
	        	enable_swipe: true
	        };

	        var a = arguments,
	            o = a[0] || {},
	            options = $.extend(defaults, o),
	            self = this;

	        var total = options.data.length;

	        var timer;

	        var tpl_panel = '<div class="carousel" style="width:' + options.width + 'px;height:' + options.height + 'px;"></div>',
	        	tpl_inner = '<div class="inner" style="width:' + options.width * total + 'px;"></div>',
	        	tpl_item = '<div class="item" style="width:' + options.width + 'px;height:' + options.height + 'px;"></div>',
	        	tpl_img = '<img src="" />',
	        	tpl_item_link = '<a href=""></a>',
	        	tpl_ctrl = '<div class="ctrl"></div>',
	        	tpl_indicator = '<span></span>',
	        	tpl_counter = '<div class="num"><div class="bg"></div><div class="text"><i>1</i>/' + total + '</div></div>';

	        self.el = $(tpl_panel);
	        self.elInner = $(tpl_inner);
	        self.elCtrl = $(tpl_ctrl);
	        self.elIndicator = $(tpl_indicator);
	        self.elCounter = $(tpl_counter);
	        self.elNum = $('.text i', self.elCounter).eq(0);

	        self.data = options.data;
	        self.speed = options.speed;
	        self.transition = options.transition;
	        self.total = total;
	        self.step = 0;
	        self.width = options.width;
	        self.height = options.height;
	        self.page_control = options.page_control;
	        self.enable_swipe = options.enable_swipe;
	        self.items = [];

	        var init = function(){
		        for(var i = 0; i < total; i++){
		        	var oItem = self.data[i],
		        		elLink = $(tpl_item_link),
		        		elItem = $(tpl_item),
		        		elImg = $(tpl_img);
		        	elImg.attr('src', oItem.src);
		        	elImg.css({
		        		width: options.width + 'px',
		        		height: options.height + 'px',
		        	});

		        	elItem.css({
		        	   position: 'absolute',
		        	   left: i * options.width + 'px'
		        	});

		        	elLink.attr('href', oItem.link);
		        	if(options.tracks) {
		        		elLink.attr('otype', 'button');
		        		elLink.attr('otitle', options.tracks[i]);
		        	}
		        	elLink.append(elImg);
		        	elItem.append(elLink);
		        	self.elInner.append(elItem);
		        	self.items.push(elItem);
		        }

		        switch(self.page_control) {
		            case PAGE_CONTROL.NONE:
		                break;
		            case PAGE_CONTROL.NUMBER:
		                self.el.append(self.elCounter);
		                self.elNum.html(self.step + 1);
		                break;
		            case PAGE_CONTROL.INDICATOR:
		            	if(self.total > 1) {
			                var html = '';
			                for(var i = 0; i < self.total; i++) {
			                    html += tpl_indicator;
			                }
			                self.elCtrl.append(html);
			                self.el.append(self.elCtrl);
			                self.elCtrl.children().eq(0).addClass('curr');
		            	}
		                break;
		            default:
		                break;
		        }

		        self.el.append(self.elInner);
		        timer = setTimeout(function(){
		        	self.run();
		        }, self.speed);

		        if(self.enable_swipe) {
		        	var sx, ex, cx, dx, px;
			        self.el.bind('touchstart', function(e){
			        	clearTimeout(timer);
			        	var touch = e.touches[0];
			        	if(touch) {
	                        sx = touch.pageX;
			        	}
			        });
			        self.el.bind('touchend', function(e){
			        	var touch = e.changedTouches[0];
			        	if(touch) {
			        		ex = touch.pageX;
				        	dx = ex - sx;

				        	if(dx > 0 && self.step > 0) {
				        		self.prev();
				        	} else if(dx < 0 && self.step + 1 < self.total) {
				        		self.next();
				        	}

					        timer = setTimeout(function(){
					        	self.run();
					        }, self.speed);
			        	}
			        });
		        }
	        }
	        init();
        }

        Carousel.prototype = {
        	run: function(){
	            var self = this;
        		self.next();
	            clearTimeout(timer);
	            timer = setTimeout(function(){
	                self.run();
	            }, self.speed);
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
        		self.step = self.step < 0 ? 0 : self.step;
        		self.change();
        	},
        	change: function(){
        		var self = this;
		        switch(self.page_control) {
		            case PAGE_CONTROL.NONE:
		                break;
		            case PAGE_CONTROL.NUMBER:
		                self.elNum.html(self.step + 1);
		                break;
		            case PAGE_CONTROL.INDICATOR:
		                self.elCtrl.children().removeClass('curr');
		                self.elCtrl.children().eq(self.step).addClass('curr');
		                break;
		        }
		        var len = self.items.length;
		        for(var i = 0; i < len; i++) {
		            var elItem = self.items[i];
	                elItem.css({
                        'transition' : self.transition + 'ms',
                        '-webkit-transition' : self.transition + 'ms',
                        'transform' : 'translate3d(-' + self.width * self.step + 'px, 0, 0)',
                        '-webkit-transform' : 'translate3d(-' + self.width * self.step + 'px, 0, 0)'
                    });
		        }
        	}
        };

        var a = arguments,
            o = a[0] || {},
            self = this;

        self.carousel = new Carousel(o);
        self.append(self.carousel.el);
   	};

	WLT.widget.carousel.PAGE_CONTROL = PAGE_CONTROL;

})(Zepto);