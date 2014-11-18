/**
 * WLT Select Picker Plugin
 * Dependency: MobiScroll (http://mobiscroll.com)
 */
;(function($){
    $.fn.select_picker = function(){
        var defaults = {
            label: 'label',
            key_name: 'name',
            value_name: 'value',
            default_object: ['default', 0],
            data_store: [],
            hidden_field: '',
            
            //mobiscroll input class
            theme: 'ios7',
            inputClass: 'i-sel',
            required: false,
            onSelect: null
        };
        
        var a = arguments,
            o = a[0] || {},
            options = $.extend(defaults, o),
            self = this;
        
        var elLabel = $('<label></label>'),
            elPicker = $('<select></select>'),
            elHidden = $('<input type="hidden" value="" id="' +  options.hidden_field + '" name="' + options.hidden_field + '" />');
        
        self.elVal = elHidden;
        
        var init = function(){
            //label text
            elLabel.html(options.label);
            
            //append select default option
            elPicker.append('<option value="' + options.default_object[1] + '">' + opts.default_object[0] + '</option>');
            
            //append other options
            $.each(opts.ds, function(i, o){
                elPicker.append('<option value="' + o[options.value_name] + '">' + o[options.key_name] + '</option>');
            });
            
            self.append(elLabel);
            self.append(elPicker);
            self.append(elHidden);
            
            //init mobiscroll select
            elPicker.mobiscroll().select({
                theme: options.theme,
                mode: 'scroller',
                lang: 'zh',
                display: 'bottom',
                animate: 'pop',
                inputClass: options.inputClass,
                onSelect: function(txt, inst){
                    elHidden.val(inst.getValue());
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