/**
 * WLT touch Plugin
 * @require wlt.util.js
 */
;(function($){
    WLT.util.touch = {
		getOffset: function(e){
            if (e.targetTouches && (e.targetTouches.length >= 1)) {
                et = e.targetTouches[0];
                return {x: et.offsetX, y: et.offsetY};
            }
            
            if (e.offsetX && e.offsetY) {
                return {x: e.offsetX, y: e.offsetY};
            }
            
            var target,
                eventCoord,
                pageCoord,
                offsetCoord;
            
            target = e.target;
            eventCoord = {
                x: window.pageXOffset + e.clientX,
                y: window.pageYOffset + e.clientY
            };
            pageCoord = {x: 0, y: 0};
            
            while (target) {
                pageCoord.x += target.offsetLeft;
                pageCoord.y += target.offsetTop;
                target = target.offsetParent;
            }
            offsetCoord = {
                x: eventCoord.x - pageCoord.x,
                y: eventCoord.y - pageCoord.y
            };
            return offsetCoord;           
        }
    };
})(Zepto);
