function beforeAfterify(array, prefix, that, args){
    if(array[prefix]){
        return array[prefix].apply(that[prefix],args);
    }
}

function listen(element,prefix, before, after, that, event, callback){
    var listener = function(){
        var args = beforeAfterify(before, prefix, that, arguments);
        callback.apply(that[prefix],args || arguments);
        beforeAfterify(after, prefix, that, arguments);
    };
    event = (Array.isArray(event)) ? event : [event];
    for(var i = 0; i < event.length; i++){
        element.addEventListener(prefix + event[i], listener, false);
    }
}

module.exports = function(opt){
    var element = opt.element,
        before = opt.before || {},
        after = opt.after || {},
        that = opt.that || {},
        on = opt.on;

    var result = listen.bind(undefined, element, '', before, after, that);
    for(var i = 0; i < on.length; i++){
        var prefix = on[i];
        result[prefix] = listen.bind(undefined, element, prefix, before, after, that);
    }
    result.that = that;
    return result;
};