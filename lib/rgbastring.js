var fromDefault = require('./fromdefault');
var random = require('./random');
//return rgba string
module.exports = function rgbaString(color) {
    color = color || random.color();
    color.a = fromDefault(color.a, 1);
    return 'rgba('+color.r+','+color.g+','+color.b+','+color.a+')';
};

