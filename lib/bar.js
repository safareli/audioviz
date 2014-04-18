var rgbaString = require('./rgbastring');
var colorFormMagnitude = function(magnitude){
    if (magnitude < 65) {
        return 'rgba(0,0,0,0)';
    }
    return rgbaString({
        r : magnitude,
        g : magnitude%50 ,
        b : (255-magnitude)%75,
        a : 1
    });
};
var barGen = {
    init:function(conf){
        this.center = conf.center;
        this.width = conf.width;
        this.color = {};
    },
    
    draw: function(ctx, magnitude){
        ctx.fillStyle = colorFormMagnitude(magnitude);
        var height = magnitude - 50;
        ctx.fillRect(
            this.center.x - this.width/2,
            this.center.y.val() - height/2,
            this.width,
            height
        );
    }
};

module.exports = function(){
    var bar = Object.create(barGen);
    bar.init.apply(bar,arguments);
    return bar;
};