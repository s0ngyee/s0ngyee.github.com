/**
 * WLT CoverFlow Plugin
 * @require wlt.widget.js
 */
;(function($){
    WLT.widget.coverflow = $.fn.coverflow = function(){

		var a = arguments,
		    o = a[0] || {},
		    self = parent = this;
    	
        var xform,
        	xperspective;
        $.each(['Transform', 'Perspective'], function(i, name){
        	$.each(['webkit', 'Moz', 'O', 'ms'], function(j, prefix) {
        		var s = prefix + name,
        			os = '-' +  prefix.toLowerCase() + '-' + name.toLowerCase();
        		if(typeof document.body.style[s] !== 'undefined') {
        			i == 0 ? xform = os : xperspective = os;
        		}
        	});
        });
        
        var getTouchOffset = function(e){
            if (e.targetTouches && (e.targetTouches.length >= 1)) {
                et = e.targetTouches[0];
                return {x: et.clientX, y: et.clientY};
            }
            
            if (e.offsetX && e.offsetY) {
                console.log({x: e.offsetX, y: e.offsetY});
                return {x: e.offsetX, y: e.offsetY};
            }
            
            var target,
                eventCoord,
                pageCoord,
                offsetCoord;
            
            target = e.target;
            eventCoord = {
                x: window.pageXOffset + e.clientX,
                y: window.pageYOffset + e.clientY
            };
            pageCoord = {x: 0, y: 0};
            
            while (target) {
                pageCoord.x += target.offsetLeft;
                pageCoord.y += target.offsetTop;
                target = target.offsetParent;
            }
            offsetCoord = {
                x: eventCoord.x - pageCoord.x,
                y: eventCoord.y - pageCoord.y
            };
            console.log(offsetCoord);
            return offsetCoord;           
        };
        
        function Coverflow(){
            var defaults = {
                items: [],
            	width: 100,
            	height: 100,
            	total: 3,
                dist: 500,        	//camera distance
                angle: 0,        	//rotate Y angle
                zIndex: 100,    	//coverflow zIndex
                duration: 500,    	//autoscroll duration (ms)
                shift: 10,       	//shift
                dim: 280			//dim side width
            };

            var a = arguments,
                o = a[0] || {},
                options = $.extend(defaults, o),
                self = this;
            
            var tpl_panel = '<div class="coverflow"></div>',
                tpl_cover = '<div class="cover"></div>';
            
            //elements
            self.el = $(tpl_panel);
            self.covers = [];
            
            //outer control variables
            self.items = options.items;
            self.total = options.total;
            self.width = options.width;
            self.height = options.height;
            self.dim = options.dim;
            self.dist = options.dist;
            self.angle = options.angle;
            self.zIndex = options.zIndex;
            self.duration =options.duration;
            self.shift = options.shift;
            
            //inner control variables
            self.pressed = false;
            self.currentPos = null;
            self.timer = null;
            self.velocity = 0;
            self.amplitude = 0;
            self.frame = 0;
            self.offset = 0;
            self.target = 0;
            self.ts = null;
            self.center = null;
            
            var tap = function (e){
                self.pressed = true;
                
                self.currentPos = getTouchOffset(e);
                self.velocity = self.amplitude = 0;
                self.frame = self.offset;

                clearInterval(self.timer);
                self.timer = setInterval(function(){
                    var now, 
                    	elapsed, 
                    	delta, 
                    	v;

                    now = Date.now();
                    elapsed = now - self.ts;
                    self.ts = now;
                    delta = self.offset - self.frame;
                    self.frame = self.offset;

                    v = 1000 * delta / (1 + elapsed);
                    self.velocity = 0.8 * v + 0.2 * self.velocity;
                }, 100);
                
                e.preventDefault();
//                e.stopPropagation();
                return false;
            };
            
            var drag = function (e){
                var pos,
                	delta;
                if(self.pressed) {
                    pos = getTouchOffset(e);
                    delta = self.currentPos.x - pos.x;
                    if (delta > 2 || delta < -2) {
                    	self.currentPos = pos;
                    	self.scroll(self.offset + delta);
                    }
                }
                e.preventDefault();
//                e.stopPropagation();
                return false;
            };
            
            var release = function (e){
                self.pressed = false;
                clearInterval(self.timer);
                
                self.target = self.offset;
                if(self.velocity > 10 || self.velocity < -10) {
                	self.amplitude = 0.9 * self.velocity;
                	self.target = self.offset + self.amplitude;
                }
            	self.target = Math.round(self.target / self.dim) * self.dim;
            	self.amplitude = self.target - self.offset;
            	self.ts = Date.now();
            	requestAnimationFrame(self.autoScroll);
                
                e.preventDefault();
//                e.stopPropagation();
                return false;
            };
                
            var init = function(){
                
            	//init panel
            	var elStyle = {
                        'width': '100%',
                        'height': '100%',
                        'overflow': 'hidden',
                        'position': 'relative'
            	};
            	elStyle[xperspective] = self.dist;
                self.el.css(elStyle);
                
                //init covers
                var len = self.total;
                for(var i = 0; i < len; i++) {
                    var elCover = $(tpl_cover),
                    	elInner = self.items[i];
                    elCover.css({
                    	'width': self.width,
                    	'height': self.height,
                    	'overflow': 'hidden',
                    	'position': 'absolute'
                    });
                    elCover.append(elInner);
                    self.covers.push(elCover);
                    self.el.append(elCover);
                }
                /*
                if(typeof window.ontouchstart !== 'undefined') {
                    self.el.bind('touchstart', function(e){
                        console.log('#### coverflow tap ####');
                        tap(e);
                    });
                    self.el.bind('touchmove',  function(e){
                        console.log('#### coverflow drag ####');
                        drag(e);
                    });
                    self.el.bind('touchend',  function(e){
                        console.log('#### coverflow release ####');
                        release(e);
                    });
                }
                */
                
                self.scroll();
            };
            
            init();
        }

        Coverflow.prototype = {
            autoScroll: function(){
            	var self = this;
                var elapsed, 
                	delta;

                if (self.amplitude) {
                    elapsed = Date.now() - timestamp;
                    delta = self.amplitude * Math.exp(-elapsed / self.duration);
                    if (delta > 4 || delta < -4) {
                        self.scroll(self.target - delta);
                        requestAnimationFrame(selfautoScroll);
                    } else {
                    	self.scroll(target);
                    }
                }
            },
            scroll: function(d){
            	var self = this;
            	
            	var half,
            		delta,
            		dir,
            		tween,
            		alignment,
            		w = parent.width(),
            		h = parent.height(),
            		left = (w - self.width) / 2,
            		top = (h - self.height) / 2;
            	
            	self.offset = (typeof d === 'number') ? d : self.offset;
            	self.center = Math.floor((self.offset + self.dim / 2) / self.dim);
            	delta = self.offset - self.center * self.dim;
            	dir = (delta < 0) ? 1 : -1;
            	tween = - dir * delta * 2 / self.dim;
            	
            	alignment = 'translateX(' + (w - self.width) / 2 + 'px)';
            	alignment += 'translateY(' + (h - self.height) / 2 + 'px) translateZ(0px)';
            	
            	//center
            	var elCoverCenter = self.covers[self.wrap(self.center)];
            	
            	elCoverCenter.css({
            		'zIndex': self.zIndex,
            		'opacity': 1
            	});
            	elCoverCenter.css(xform, alignment +
                    ' translateX(' + (-delta / 2) + 'px)' +
                    ' translateY(' + (dir * self.shift * tween) + 'px)' +
                    ' translateZ(' + (self.dist * tween) + 'px)' +
                    ' rotateY(' + (dir * self.angle * tween) + 'deg)'
                );
            	
            	half = self.total >> 1;
            	
            	for(var i = 1; i <= half; ++i) {
            		var elCoverRight = self.covers[self.wrap(self.center + i)];
            		elCoverRight.css(xform, alignment +
                        ' translateX(' + (self.shift + (self.dim * i - delta) / 2) + 'px)' +
                        ' translateZ(' + self.dist + 'px)' +
                        ' rotateY(' + self.angle + 'deg)'
                    );
            		elCoverRight.css({
                		'zIndex': self.zIndex - i,
                		'opacity': (i === half && delta < 0) ? 1 - tween : 1
                	});
            		
            		var elCoverLeft = self.covers[self.wrap(self.center - i)];
                    
            		elCoverLeft.css(xform, alignment +
                        ' translateX(' + (- self.shift + (- self.dim * i - delta) / 2) + 'px)' +
                        ' translateZ(' + self.dist + 'px)' +
                        ' rotateY(' + - self.angle + 'deg)'
                    );
            		elCoverLeft.css({
                		'zIndex': self.zIndex - i,
                		'opacity': (i === half && delta > 0) ? 1 - tween : 1
                	});
            	}
            	
            	//center
            	elCoverCenter.css({
            		'zIndex': self.zIndex,
            		'opacity': 1
            	});
            	elCoverCenter.css(xform, alignment +
                    ' translateX(' + (-delta / 2) + 'px)' +
                    ' translateY(' + (dir * self.shift * tween) + 'px)' +
                    ' translateZ(' + (self.dist * tween) + 'px)' +
                    ' rotateY(' + (dir * self.angle * tween) + 'deg)'
                );
            },
            wrap: function(x){
            	var self = this;
                return (x >= self.total) ? (x % self.total) : (x < 0) ? self.wrap(self.total + (x % self.total)) : x;
            }
        };
		
		self.coverflow = new Coverflow(o);
		self.append(self.coverflow.el);
   };
})(Zepto);