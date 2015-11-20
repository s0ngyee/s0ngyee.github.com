/**
 * WLT Stepper Plugin
 * @require wlt.widget.js
 */
;(function($){
	
	WLT.widget.stepper = $.fn.stepper = function(){
        var el = this;
        
		function Stepper() {
	        var defaults = {
	        	step: 1,
	        	max: 10,
	        	min: 0,
	        	value: 0,
	        	onChange: null
	        };

	        var a = arguments,
	            o = a[0] || {},
	    	    options = $.extend(defaults, o),
	            self = this;
	            
	        var id = el.attr('id');
	            
	        self.step = 1;
	        self.max = options.max;
	        self.min = options.min;
	        self.value = options.value;
	        self.onChange = options.onChange;
	        
	        self.el = el;
	        self.elLeft = $('<a class="l" href="javascript:void(0);">-</a>');
	        self.elRight = $('<a class="r" href="javascript:void(0);">+</a>');
	        self.elMiddle = $('<em></em>');
	        self.elValue = $('<input type="text" name="stepper_' + id + '" id="stepper_' + id + '" value="' + options.value + '" />');
            
	        var init = function(){
	        	
	        	self.el.addClass('stepper');
	        	self.elMiddle.append(self.elValue);
	        	self.el.append(self.elLeft);
	        	self.el.append(self.elMiddle);
	        	self.el.append(self.elRight);
	        	
	        	self.elValue.on('change', function(){
	        		self.value = self.elValue.val();
	        		self.change();
	        	});
	        	
	        	self.elLeft.on('click', function(){
	        		self.decrease();
	        	});
	        	
	        	self.elRight.on('click', function(){
	        		self.increase();
	        	});
	        }
	        init();
		}
		
		Stepper.prototype = {
			increase: function(){
	            var self = this;
	            self.value = self.value + self.step;
				self.value = self.value > self.max ? self.max : self.value;
				self.change();
			},
			decrease: function(){
	            var self = this;
	            self.value = self.value - self.step;
				self.value = self.value < self.min ? self.min : self.value;
				self.change();
			},
			change: function(){
        		var self = this;
        		self.elValue.val(self.value);
				if(self.value > self.min && self.value <= self.max) {
					self.el.removeClass('left');
					self.el.removeClass('right');
					self.el.addClass('on');
				}
				
				if(self.value <= self.min) {
					self.el.removeClass('left');
					self.el.removeClass('on');
					self.el.addClass('right');
				}
				if(self.value >= self.max) {
					self.el.removeClass('right');
					self.el.removeClass('on');
					self.el.addClass('left');
				}
				if(self.onChange){
					self.onChange.call(self);
				}
			}
		}

        var a = arguments,
            o = a[0] || {};
            
        el.stepper = new Stepper(o);
        return this;
   	}
})(Zepto);