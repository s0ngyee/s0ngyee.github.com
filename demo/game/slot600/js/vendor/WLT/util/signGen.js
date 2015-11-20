/**
 * WLT signature generator Plugin
 * @require wlt.util.js
 */
;(function($){

	var AUTH_TYPE = {
        SHA1: 0,
        MD5: 1 
   	};
	
    WLT.util.signGen = function() {
        var PRIVATE_KEY = '09FB84B1-D90E-4C14-84DB-DEE924A87B51';
    
        var a = arguments,
            o = a[0] || {},
            t = a.length > 1 ? a[1] : AUTH_TYPE.SHA1,
            pk = a.length > 2 ? a[2] : PRIVATE_KEY,
            pks = [];
        for (var k in o) {
            pks.push(k);
        }
        pks.sort();
        
        var sign = '';
        for (var i in pks) {
            var k = pks[i],
                v = o[k];
            sign += k + v;
        }
        sign += pk;
        var oSign;
        switch(t) {
    		case AUTH_TYPE.MD5:
                console.log('md5');
    			oSign = CryptoJS.MD5(sign);
    			break;
        	case AUTH_TYPE.SHA1:
        	default:
                console.log('shai')
    			oSign = CryptoJS.SHA1(sign);
        		break;
        }

        return oSign.toString();

    }
    WLT.util.signGen.AUTH_TYPE = AUTH_TYPE;
})(Zepto);
