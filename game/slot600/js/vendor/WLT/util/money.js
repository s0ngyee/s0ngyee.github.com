/**
 * WLT money Plugin
 * @require wlt.util.js
 */
;(function($){
    WLT.util.money = {
        format: function (s, n) {  
            n = n >= 0 && n <= 20 ? n : 2;
            s = parseFloat((s + "").replace(/[^\d\.-]/g, "")).toFixed(n) + "";
            if(n) {
                s = s.toFixed(n);
            }
            var l = s.split(".")[0].split("").reverse(), r = s.split(".")[1];
            t = "";  
            for (var i = 0; i < l.length; i++) {  
                t += l[i] + ((i + 1) % 3 == 0 && (i + 1) != l.length ? "," : "");  
            }  
            return t.split("").reverse().join("") + (r ? ( "." + r) : "");  
        },
        parse: function (s) {  
            return parseFloat(s.replace(/[^\d\.-]/g, ""));  
        }  
    };
})(Zepto);
