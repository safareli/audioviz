var Stats = require('./stats');
var Particle = require('./particle');
var Bar = require('./bar');
var franim = require('franim');

franim('canvas',{
    particles: [],
    createParticles:function(){
        var newLength = Math.round(this.anim.getWidth()/20 + this.anim.getHeight()/20);
        
        while(this.particles.length != newLength){
            if (this.particles.length > newLength) {
                this.particles.pop();
            }else{
                this.particles.push(Particle());
            }
        }
    },
    bars: [],
    createBars:function(){
        // Spacing between the individual bars
        SPACING = 10;
        var newLength = this.anim.getWidth()/SPACING + 1;
        while(this.bars.length != newLength){
            if (this.bars.length > newLength) {
                this.bars.pop();
            }else{
                this.bars.push(Bar());
            }
        }
    },
    init:function(ctx){
        this.audio = Audio();
        this.mouse = Mouse();
        this.createBars();
        this.createParticles();
        this.stats = Stats();
        document.body.appendChild(this.stats.domElement);

        window.addEventListener('resize', function() {
            this.createBars();
            this.createParticles();
        }, true);
    },
    update:function(time){
        this.stats.begin();
    },
    draw: function(ctx){
        var FData = audio.getFrequencyData();
        var kFData = audio.generateFrequencyK();
        //draw bagrounde
        ctx.globalCompositeOperation = "source-over";
        ctx.fillStyle = 'rgba(0,0,0,.3)';
        ctx.fillRect(0,0,this.anim.getWidth(),this.anim.getHeight());
        ctx.globalCompositeOperation = "lighter";


        if (audio.sourceIsLoded) {
            for (var i = 0; i < bars.length; i++) {
                var bar = bars[i];

                var magnitude = FData[i + SPACING];
                ctx.fillStyle =   bar.getColor(magnitude);

                magnitude-= 50;
                ctx.fillRect(i * SPACING, this.anim.getHeight() -150 - magnitude/2, SPACING / 2, magnitude);

            }
        }
        
        for (var k = 0; k < particles.length; k++) {
            var p = particles[k];

            
            ctx.beginPath();
            p.alpha = $.roundN(p.remaining_life/p.life, 3);
            ctx.fillStyle = p.g();
            ctx.arc(p.position.x, p.position.y, p.radius, Math.PI*2,0, false);
            ctx.fill();

            if(mouse.isIn){
                if (!p.center && mouse.isDown) {
                    p.position.x +=  Math.sin( p.velocity.x * kFData)*kFData;
                    p.position.y += Math.cos( p.velocity.x * kFData)*kFData;
                    p.toMouseK++;
                }else if (p.center && !mouse.isDown) {
                    p.position.x +=  Math.sin( p.velocity.x * kFData)*kFData;
                    p.position.y +=  p.velocity.y;
                    p.remaining_life--;
                    if (p.radius>10) {
                        p.radius*=0.99;
                    }
                }else if (!p.center && !mouse.isDown) {
                    p.position.x += ((mouse.x - p.position.x))/Math.abs(p.velocity.x*p.toMouseK)*Math.abs(Math.sin(kFData));
                    p.position.y += ((mouse.y - p.position.y))/Math.abs(p.velocity.y*p.toMouseK)*Math.abs(Math.cos(kFData));
                    if (p.toMouseK>1) {
                        p.toMouseK--;
                    }
                }else if (p.center && mouse.isDown) {
                    p.remaining_life-=0.5;
                    if (p.radius>10) {
                        p.radius*=0.99;
                    }
                    p.position.x += p.velocity.x;
                    p.position.y += p.velocity.y;
                }
            }else{
                var time = new Date().getTime() * 0.002;
                p.position.x +=  Math.sin( p.velocity.x * kFData)*kFData;
                p.position.y +=  Math.cos( p.velocity.y * kFData)*kFData;
                p.remaining_life-=1/Math.abs(Math.sqrt(Math.pow(p.velocity.x,2) + Math.pow(p.velocity.y,2)));
            }
            

            if(p.alpha<0.01 || p.radius<=0 || p.toMouseK==1){

                if (mouse.isDown || !mouse.isIn) {
                    p.reset(false);
                } else{
                    p.reset(true);
                }
            }


            if (p.position.x < -50) {
                p.position.x = this.anim.getWidth()+50;
            }
            
            if (p.position.y < -50) {
                p.position.y = this.anim.getHeight()+50;
            }

            if (p.position.x > this.anim.getWidth()+50) {
                p.position.x = -50;
            }

            if (p.position.y > this.anim.getHeight()+50) {
                p.position.y = -50;
            }
        }
        this.stats.end();
    }
});
 