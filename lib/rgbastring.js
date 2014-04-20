var extend = require('./extend');
var random = require('./random');
//return rgba string
module.exports = function rgbaString(color) {
    if(typeof color !== "object" || color === null)
        throw new TypeError('color should be object');
    var c = extend(color, { r:0, g:0, b:0, a:1 });
    var r = c.r.get ? c.r.get() : c.r;
    var g = c.g.get ? c.g.get() : c.g;
    var b = c.b.get ? c.b.get() : c.b;
    var a = c.a.get ? c.a.get() : c.a;
    return 'rgba('+ (r|0) +','+ (g|0) +','+ (b|0) +','+ ((a*100000 |0)/100000) +')';
};