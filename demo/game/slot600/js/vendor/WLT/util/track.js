/**
 * WLT Track Plugin
 * @require wlt.util.js
 */
;(function($){
    WLT.util.track = function(memberId) {
        var TRACK_SITE = 'wlt',
        TRACK_DOMAIN = 'wanlitong.com';
        
        memberId = memberId ? memberId : '';

        var loginUserId = memberId;
     
        if (loginUserId == '') {
            loginUserId = '0';
        }
        
        var _paq = {
            site: TRACK_SITE,
            domain: TRACK_DOMAIN,
            userId: loginUserId,
            userType: 1
        };
        window._paq = _paq;
     
        var elScript = document.createElement('script');
        if(location.protocol.toLowerCase() == "http:"){
            elScript.setAttribute('src', '//h1.jkimg.net/webstat/pa_beacon_cdn.js');
        } else {
            elScript.setAttribute('src', '//webstat.wanlitong.com/js/pa_beacon_https.js');
        }
        document.body.appendChild(elScript);  
    };
})(Zepto);