/**
 * WLT signature generator Plugin
 * @require wlt.util.js
 */
;(function($){
    WLT.util.sign.rym = function() {
        var PRIVATE_KEY = '09FB84B1-D90E-4C14-84DB-DEE924A87B51';
        
        var REQ_TIME = 'reqTime',
            ts;
    
        var a = arguments,
            o = a[0] || {},
            pk = a.length > 1 ? a[1] : PRIVATE_KEY,
            pks = [];
        
        for (var k in o) {
            if(k == REQ_TIME) {
                ts = o[k];
                continue;
            }
            pks.push(k);
        }
        pks.sort();
        
        var sign = '';
        for (var i in pks) {
            var k = pks[i],
                v = o[k];
            sign += v + ts;
        }
        sign += pk;
        
        var oSign = CryptoJS.SHA1(sign);
        return oSign.toString();
    }
})(Zepto);

