// looping for ech key in defaults
// and using fromDefault function sets value
// object wich will be returned
var fromDefault = require('./fromdefault');
module.exports = function extend(object,defaults){
    if (typeof object !== "object" || object === null) {
        object = {};
    }

    if (typeof defaults !== "object" || defaults === null) {
        defaults = {};
    }

    for (var key in defaults){
        object[key] = fromDefault(object[key],defaults[key]);
    }

    return object;
}; 