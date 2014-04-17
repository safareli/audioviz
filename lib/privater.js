module.exports = (function(){
    function randString(length){
        var text = "", rangStart = 48, ranglength = 122 - rangStart;//0
        for( var i=0; i < length; i++ )
            text += String.fromCharCode(~~(Math.random() *ranglength + rangStart));
        return text;
    }
    
    return function(){
        var privareStore= {};
        return function(that){
            that.__id = that.__id || randString(32);
            privareStore[that.__id] = privareStore[that.__id] || {};
            return privareStore[that.__id];
        };
    };
})();