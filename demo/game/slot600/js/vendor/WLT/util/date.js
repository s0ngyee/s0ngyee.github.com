/**
 * WLT date Plugin
 * @require wlt.util.js
 */
;(function($){
    WLT.util.date = {
        format: function (d, f) {
            var o = {
                'M+' : d.getMonth()+1,
                'd+' : d.getDate(),
                'h+' : d.getHours() % 12 == 0 ? 12 : d.getHours() % 12,
                'H+' : d.getHours(),
                'm+' : d.getMinutes(),
                's+' : d.getSeconds(),
                'q+' : Math.floor((d.getMonth() + 3) / 3),
                'S' : d.getMilliseconds()
            };
            var week = {
                '0' : '/u65e5',
                '1' : '/u4e00',
                '2' : '/u4e8c',
                '3' : '/u4e09',
                '4' : '/u56db',
                '5' : '/u4e94',
                '6' : '/u516d'
            };
            
            if(/(y+)/.test(f)){
                f = f.replace(RegExp.$1, (d.getFullYear() + '').substr(4 - RegExp.$1.length));
            }
            
            if(/(E+)/.test(f)){
                f = f.replace(RegExp.$1, ((RegExp.$1.length > 1) ? (RegExp.$1.length > 2 ? '/u661f/u671f' : '/u5468') : '') + week[d.getDay() + '']);
            }
            
            for(var k in o){
                if(new RegExp('(' + k + ')').test(f)){
                    f = f.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (('00'+ o[k]).substr((''+ o[k]).length)));
                }
            }
            return f;
        }
    };
})(Zepto);
