var extend = require('./extend');
var random = require('./random');
//return rgba string
module.exports = function rgbaString(color) {
    if(typeof color !== "object" || color === null)
        throw new TypeError('color should be object');
    var c = extend(color, { r:0, g:0, b:0, a:1 });
    return 'rgba('+c.r+','+c.g+','+c.b+','+c.a+')';
};

