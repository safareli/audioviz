"use strict";

var stats = require('./stats');
var particle = require('./particle');
var bar = require('./bar');
var audio = require('./audio');
var mouse = require('./mouse');
var franim = require('franim');

var insertCss = require('insert-css');
var css = require('../css/style.css');
insertCss(css);


var SPACING = 10; // Spacing between the individual bars

franim('canvas',{
    config:{ fullSize: true },
    particles: [],
    createParticles:function(){
        var newLength = Math.round(this.anim.getWidth()/20 + this.anim.getHeight()/20);

        while(this.particles.length != newLength){
            if (this.particles.length > newLength) {
                this.particles.pop();
            }else{
                this.particles.push(particle(this));
            }
        }
    },
    bars: [],
    createBars:function(){
        var newLength = (this.anim.getWidth()/SPACING)|0 + 1;
        while(this.bars.length != newLength){
            if (this.bars.length > newLength) {
                this.bars.pop();
            }else{
                this.bars.push(bar());
            }
        }
    },
    setup:function(ctx){
        this.stats = stats();
        document.body.appendChild(this.stats.domElement);
        this.mouse = mouse();
        window.addEventListener('resize', function() {
            this.createBars();
            this.createParticles();
        }.bind(this), true);
        this.audio = audio();
        this.createBars();
        this.createParticles();
    },
    update:function(time){
        this.stats.update();
    },
    draw: function(ctx){
        var FData = this.audio.getFrequencyData();
        var kFData = this.audio.generateFrequencyK();
        //draw bagrounde
        ctx.globalCompositeOperation = "source-over";
        ctx.fillStyle = 'rgba(0,0,0,.3)';
        ctx.fillRect(0,0,this.anim.getWidth(),this.anim.getHeight());
        ctx.globalCompositeOperation = "lighter";


        if (this.audio.sourceIsLoded) {
            for (var i = 0; i < this.bars.length; i++) {
                var bar = this.bars[i];

                var magnitude = FData[i + SPACING];
                ctx.fillStyle =   bar.getColor(magnitude);

                magnitude-= 50;
                ctx.fillRect(i * SPACING, this.anim.getHeight() -150 - magnitude/2, SPACING / 2, magnitude);

            }
        }
        
        for (var k = 0; k < this.particles.length; k++) {
            var p = this.particles[k];

            
            ctx.beginPath();
            p.alpha = p.remaining_life/p.life;
            ctx.fillStyle = p.gradient(ctx);
            ctx.arc(p.position.x, p.position.y, p.radius, Math.PI*2,0, false);
            ctx.fill();

            if(this.mouse.isIn){
                if (!p.center && this.mouse.isDown) {
                    p.position.x +=  Math.sin( p.velocity.x * kFData)*kFData;
                    p.position.y += Math.cos( p.velocity.x * kFData)*kFData;
                    p.toMouseK++;
                }else if (p.center && !this.mouse.isDown) {
                    p.position.x +=  Math.sin( p.velocity.x * kFData)*kFData;
                    p.position.y +=  p.velocity.y;
                    p.remaining_life--;
                    if (p.radius>10) {
                        p.radius*=0.99;
                    }
                }else if (!p.center && !this.mouse.isDown) {
                    p.position.x += ((this.mouse.x - p.position.x))/Math.abs(p.velocity.x*p.toMouseK)*Math.abs(Math.sin(kFData));
                    p.position.y += ((this.mouse.y - p.position.y))/Math.abs(p.velocity.y*p.toMouseK)*Math.abs(Math.cos(kFData));
                    if (p.toMouseK>1) {
                        p.toMouseK--;
                    }
                }else if (p.center && this.mouse.isDown) {
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

                if (this.mouse.isDown || !this.mouse.isIn) {
                    p.reset(false,this);
                } else{
                    p.reset(true,this);
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
 