var rgbaString = require('./rgbastring');
var N = require('./numberer');
var Bar = {
    init:function(conf){
        this.center = conf.center;
        this.width = conf.width;
        this.magnitude = conf.magnitude;
        this.color = {
            b: new N(this.magnitude),
            g: N.mod(this.magnitude,50),
            r: N.mod(N.minus(255,this.magnitude),75),
            a: 1
        };
        this.height = N.minus(this.magnitude,50);
    },

    draw: function(ctx){
        var w = this.width,
            h = this.height.get(),
            x = this.center.x - w/2,
            y = this.center.y.get() - h/2;
        if (this.magnitude.get() < 65) {
            ctx.fillStyle = 'rgba(0,0,0,0)';
        }else{
            ctx.fillStyle = rgbaString(this.color);
        }
        
        ctx.fillRect(x,y,w,h);
    }
};

module.exports = function(){
    var bar = Object.create(Bar);
    bar.init.apply(bar,arguments);
    return bar;
};