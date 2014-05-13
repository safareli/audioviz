var rgbaString = require('./rgbastring');
var N = require('numberer');
var random = require('./random');
var randomColor = random.color;
var randomObject = random.object;
var random = random.number;
var BURNING = 'BURNING';
var NORMAL = 'NORMAL';
module.exports = function(){
    var particle = Object.create(Particle);
    particle.init.apply(particle,arguments);
    return particle;
};
var Particle = {
    init: function(stage,mouse){
        this.stage = stage;
        this.mouse = mouse;
        this.remainingLife = new N(undefined);
        this.life = new N(undefined);
        this.alpha = N.div(this.remainingLife, this.life);
        this.birth();
    },
    birth: function(){
        this.radius = random(20,30);
        if (this.mouse.isIn && this.mouse.isUp) {
            this.life.set(random(15,22));
            this.velocity = randomObject({x:[-2.5,2.5],y:[-15,-5]});
            this.position = {
                x: this.mouse.position.x.get(), 
                y: this.mouse.position.y.get()
            };
            this.color = randomColor({r:[200,55],g:[50],b:[0]});
            this.toMouseK = 0;
            this.state = BURNING;
        }else{
            this.life.set(random(20,50));
            this.velocity = randomObject({
                x: [-2.5,2.5], 
                y: [-2.5,2.5]
            });
            this.position = randomObject({
                x: [this.stage.width.get()], 
                y: [this.stage.height.get()]
            });
            this.color = randomColor();
            this.toMouseK = 100;
            this.state = NORMAL;
        }
        this.remainingLife.set(this.life.get());
    },
    draw: function(ctx){
        ctx.beginPath();
        ctx.fillStyle = this.gradient(ctx);
        ctx.arc(this.position.x, this.position.y, this.radius, Math.PI*2 , 0, false);
        ctx.fill();
    },
    update: function(kFData){
        if(this.mouse.isIn){
            if (this.state === NORMAL && this.mouse.isDown) {
                this.position.x +=  Math.sin( this.velocity.x * kFData)*kFData;
                this.position.y += Math.cos( this.velocity.x * kFData)*kFData;
                this.toMouseK++;
            }else if (this.state === BURNING && this.mouse.isUp) {
                this.position.x +=  Math.sin( this.velocity.x * kFData)*kFData;
                this.position.y +=  this.velocity.y;
                this.remainingLife.minus(1);
                if (this.radius>10) {
                    this.radius*=0.99;
                }
            }else if (this.state === NORMAL && this.mouse.isUp) {
                this.position.x += ((this.mouse.position.x.get() - this.position.x))/Math.abs(this.velocity.x*this.toMouseK)*Math.abs(Math.sin(kFData));
                this.position.y += ((this.mouse.position.y.get() - this.position.y))/Math.abs(this.velocity.y*this.toMouseK)*Math.abs(Math.cos(kFData));
                if (this.toMouseK>1) { 
                    this.toMouseK--;
                }
            }else if (this.state === BURNING && this.mouse.isDown) {
                this.remainingLife.minus(0.5);
                if (this.radius>10) {
                    this.radius*=0.99;
                }
                this.position.x += this.velocity.x;
                this.position.y += this.velocity.y;
            }
        }else{
            this.position.x +=  Math.sin( this.velocity.x * kFData)*kFData;
            this.position.y +=  Math.cos( this.velocity.y * kFData)*kFData;
            this.remainingLife.minus(1/Math.abs(Math.sqrt(Math.pow(this.velocity.x,2) + Math.pow(this.velocity.y,2))));
        }
        

        this.withinBoundaries();
        if( this.isDead())
            this.birth(); 
    },
    isDead: function(){
        return this.alpha.get() < 0.01 || this.radius <= 0 || (this.toMouseK|0) === 1;
    },
    withinBoundaries: function(){
        if (this.position.x < -this.radius) {
            this.position.x = this.stage.width.get() + this.radius;
        } else if (this.position.x > this.stage.width.get() +this.radius) {
            this.position.x = -this.radius;
        }
        
        if (this.position.y < -this.radius) {
            this.position.y = this.stage.height.get() +this.radius;
        } else if (this.position.y > this.stage.height.get() +this.radius) {
            this.position.y = -this.radius;
        }
    },
    gradient : function (ctx) {
        if (this.alpha.get() <= 0) {
            return 'hsla(0,0,0,0)';
        }
    
        var gradient =  ctx.createRadialGradient(
            this.position.x,
            this.position.y, 0,
            this.position.x,
            this.position.y, this.radius
        );
    
        var ColorStop = random(0.5,0.8,false);
    
        
        this.color.a = this.alpha.get();
        gradient.addColorStop(0,rgbaString(this.color));
        gradient.addColorStop(ColorStop,rgbaString(this.color));
        
        this.color.a = 0;
        gradient.addColorStop(1,rgbaString(this.color));
    
        return gradient;
    }
};