var extend = require('./extend');
var random = require('./random');
//return rgba string
module.exports = function rgbaString(color) {
    if(typeof color !== "object" || color === null)
        throw new TypeError('color should be object');
    var c = extend(color, { r:0, g:0, b:0, a:1 });
    var r = typeof c.r == "number" ? c.r : c.r.get();
    var g = typeof c.g == "number" ? c.g : c.g.get();
    var b = typeof c.b == "number" ? c.b : c.b.get();
    var a = typeof c.a == "number" ? c.a : c.a.get(); 
    return 'rgba('+ (r|0) +','+ (g|0) +','+ (b|0) +','+ ((a*100000 |0)/100000) +')';
};