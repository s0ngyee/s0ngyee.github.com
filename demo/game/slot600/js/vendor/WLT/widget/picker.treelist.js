/**
 * WLT Treelist Picker Plugin
 * Dependency: MobiScroll (http://mobiscroll.com)
 */
;(function($){
	$.fn.treelist_picker = function(){
        var defaults = {
            label: 'label',
            text: 'text',
            key_name: 'name',
            value_name: 'value',
            default_object: ['default', 0],
            data_store: [],
            field: '',
            
            //mobiscroll input class
            theme: 'ios7',
            wheel_labels: ['col1', 'col2', 'col3'],
            inputClass: 'i-sel',
            required: false,
            onSelect: null
        };
        
        var a = arguments,
            o = a[0] || {},
            options = $.extend(defaults, o),
            self = this;
            
        var elLabel = $('<label></label>'),
        	elField = $('<input type="text" placeholder="' + options.text + '" name="' + options.field + '" readonly>'),
            elPicker = $('<ul></ul>');
        
        for(var i = 0; i < options.data_store.length; i++) {
        	var province = options.data_store[i],
        		citys = province.type == 1 ? province.sub : province,
        		elProvince = $('<li data-val="' + province.name + '">' + province.name + '</li>'),
        		elProvinceSub = $('<ul></ul>');
        	if(province.type) {
        		for(var j = 0; j < citys.length; j++) {
        			var city = citys[j],
        				areas = city.sub ? city.sub : [],
        				elCity = $('<li data-val="' + city.name + '">' + city.name + '</li>'),
        				elCitySub = $('<ul></ul>');
        			elProvinceSub.append(elCity);
        			for(var k = 0; k < areas.length; k++){
        				var area = areas[k],
        					elArea = $('<li data-val="' + area.name + '">' + area.name + '</li>');
        				elCitySub.append(elArea);
        			}
        			elCity.append(elCitySub);
        		}
        		elProvince.append(elProvinceSub);
        	} else {
        		var city = citys,
        			areas = city.sub ? city.sub : [],
        			elCity = $('<li data-val="' + city.name + '">' + city.name + '</li>'),
    				elCitySub = $('<ul></ul>');
        		elProvinceSub.append(elCity);

        		for(var k  = 0; k < areas.length; k++) {
    				var area = areas[k],
						elArea = $('<li data-val="' + area.name + '">' + area.name + '</li>');
    				elCitySub.append(elArea);
        		}
    			elCity.append(elCitySub);
        		elProvince.append(elProvinceSub);
        	}
        	elPicker.append(elProvince);        	
        }
        
        self.elVal = elField;
        
        var buildTree = function(){
        	
        }
        
        var init = function(){
            //label text
            elLabel.html(options.label);
            
            self.append(elLabel);
            self.append(elField);
            self.append(elPicker);
            
            //init mobiscroll treelist
            elPicker.mobiscroll().treelist({
                theme: options.theme,
                mode: 'scroller',
                lang: 'zh',
                display: 'bottom',
                animate: 'pop',
                inputClass: options.inputClass,
                fixedWidth: [120,120,120],
                labels: options.wheel_labels,
                onSelect: function(txt, inst){
                	elField.val(inst.getValue());
                    if(options.onSelect) {
                        options.onSelect.call(self);
                    }
                }
            });
            
            //element's tap event
            self.on('click', function(){
            	elPicker.mobiscroll('show'); 
            });
        }
        init();
        
        return self;
    }
})(Zepto);