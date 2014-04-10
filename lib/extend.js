// looping for ech key in defaults
// and using fromDefault function sets value
// object wich will be returned
var fromDefault = require('./fromdefault');
module.exports = function extend(object,defaults){
    if (typeof object === "undefined") {
        object = {};
    }

    for (var key in defaults){
        object[key] = fromDefault(object[key],defaults[key]);
    }

    return object;
};

