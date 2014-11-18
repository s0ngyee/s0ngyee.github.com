/**
 * WLT textRoll Plugin
 * @require wlt.widget.js
 */
;(function($){

   	WLT.widget.textRoll = function(){
   		
        var defaults = {
        	container: '.line',  // 配置默认容器
        	delay: 2000 // 配置默认延迟时间
        };
        
        var a = arguments,
            o = a[0] || {},
            options = $.extend(defaults, o),
            self = this;
        
        var _wrap=$(options.container);

        setInterval(function(){

            var _field=_wrap.find('li').first();//此变量不可放置于函数起始处,li:first取值是变化的

            var _h=_field.height();//取得每次滚动高度(多行滚动情况下,此变量不可置于开始处,否则会有间隔时长延时)

            _field.animate({marginTop:-_h+'px'},600,function(){//通过取负margin值,隐藏第一行

                _field.css('marginTop',0).appendTo(_wrap);//隐藏后,将该行的margin值置零,并插入到最后,实现无缝滚动
                
            })
        },options.delay)

   	}
})(Zepto)