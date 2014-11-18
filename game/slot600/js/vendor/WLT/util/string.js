/*
 * @require wlt.util.js
 */
;(function(){
    String.prototype.reverse = function (){ 
        return this.split('').reverse().join('');
    }
})();