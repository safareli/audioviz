var random = require('./random');
var randomColor = random.color;
var randomObject = random.object;
var random = random.number;
var rgbaString = require('./rgbastring');



function Particle(_) {
    this.reset(false,_);
}

Particle.prototype.reset = function (center,_) {
    this.alpha = 1;
    this.center = center || false;
    this.radius = random(20,30);
    if (this.center) {
        this.life = random(15,22);
        this.velocity= randomObject({x:[-2.5,2.5],y:[-15,-5]});
        this.position = {x:_.mouse.x,y:_.mouse.y};
        this.color = randomColor({r:[200,55],g:[50],b:[0]});
        this.toMouseK = 0;
    }else{
        this.life = random(20,50);
        this.toMouseK = 100;
        this.color = randomColor();
        this.velocity= randomObject({x:[-2.5,2.5],y:[-2.5,2.5]});
        this.position= randomObject({x:[_.anim.getWidth()],y:[_.anim.getHeight()]});
    }
    this.remaining_life = this.life;
};


Particle.prototype.gradient = function (ctx) {//Gradient
    if (this.alpha <= 0) {
        return 'hsla(0,0,0,0)';
    }

    var gradient =  ctx.createRadialGradient(
        this.position.x,
        this.position.y, 0,
        this.position.x,
        this.position.y, this.radius
    );

    var ColorStop = random(0.5,0.8,false);

    
    this.color.a = this.alpha;
    gradient.addColorStop(0,rgbaString(this.color));
    gradient.addColorStop(ColorStop,rgbaString(this.color));
    
    this.color.a = 0;
    gradient.addColorStop(1,rgbaString(this.color));

    return gradient;
};

module.exports = require('./construct')(Particle);