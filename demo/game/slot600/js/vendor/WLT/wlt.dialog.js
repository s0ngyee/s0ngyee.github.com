/**
 * WLT Dialog Plugin
 * @require wlt.js
 */
;(function($){
    var DIALOG_STYLE = {
        DEFAULT: 0,
        CONFIRM: 1
    };
    
    var REFERENCE_OBJECT = {
    	BODY: 0,
    	WINDOW: 1
    };
    
    WLT.dialog = function(){
        var defaults = {
                isModal: 1,
                zIndex: 1000,
                width: 240,
                message: '',
                style: DIALOG_STYLE.DEFAULT,
                txtConfirm: '确定',
                txtCancel: '取消',
                refobj: DIALOG_STYLE.BODY,
                onConfirm: null,
                onCancel: null
            };
            
        var a = arguments,
            o = a[0] || {},
            options = $.extend(defaults, o),
            self = this;
            
        var el = $('<div class="wlt-dialog"></div>'),
            elMsg = $('<p>' + options.message + '</p>'),
            elBtnPanel = $('<span></span>'),
            elBtnConfirm = $('<a class="btn" href="javascript:;">' + options.txtConfirm + '</a>'),
            elBtnCancel = $('<a class="btn" href="javascript:;">' + options.txtCancel + '</a>'),
            elMask = $('<div class="wlt-mask" style="background:black;opacity:0.4;position:absolute;left:0;top:0;width:100%;"></div>'),
            elBody = $(document.body);
        
        var init = function(){
            var ww, wh, w, h;
            
            if(options.refobj == DIALOG_STYLE.WINDOW) {
            	ww = document.body.clientWidth;
                wh = document.body.clientHeight; 
            } else {
            	ww = $(document.body).width();
                wh = $(document.body).height(); 
            }
            
            if(options.style != DIALOG_STYLE.CONFIRM) {
                elBtnPanel.append(elBtnCancel);
            }
            elBtnPanel.append(elBtnConfirm);
            el.append(elMsg);
            el.append(elBtnPanel);
            if(options.isModal) {
                elBody.append(elMask);
                elMask.height(wh);
                elMask.css({
                    zIndex: options.zIndex -1
                })
            }
            elBody.append(el);

            w = options.width;
            h = el.height();
            el.css({
                top: (wh / 2 - h / 2) + 'px',
                left: (ww / 2 - w / 2) + 'px',
                width: options.width + 'px',
                zIndex: options.zIndex
            });
            
            if(options.style != DIALOG_STYLE.CONFIRM) {
                elBtnCancel.on('click', function(e){
                    e.stopPropagation();
                    el.remove();
                    if(options.isModal) {
                        elMask.remove();
                    }
                    if(options.onCancel) {
                        options.onConfirm.call(self);
                    }
                });
            }
            
            elBtnConfirm.on('click', function(e){
                e.stopPropagation();
                el.remove();
                if(options.isModal) {
                    elMask.remove();
                }
                if(options.onConfirm) {
                    options.onConfirm.call(self);
                }
            });
        };
        
        init();
        return el;
    };
    
    WLT.dialog.DIALOG_STYLE = DIALOG_STYLE;
    WLT.dialog.REFERENCE_OBJECT = REFERENCE_OBJECT;
})(Zepto)