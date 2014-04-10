var rgbaString = require('./rgbastring');
CanvasHelper.Bar = function Bar (){
    this.color = {};
};
Bar.prototype.getColor = function (magnitude) {
        if (magnitude < 65) {
            return 'rgba(0,0,0,0)';
        }
        this.color.r = magnitude;
        this.color.g = magnitude%50 ;
        this.color.b = (255-magnitude)%75;
        this.color.a = 1;
        return rgbaString(this.color);
    };
module.exports = require('./construct')(Bar);