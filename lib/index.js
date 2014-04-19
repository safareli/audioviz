"use strict";

var stats = require('./stats');
var particleGen = require('./particle');
var barGen = require('./bar');
var audio = require('./audio');
var mouse = require('./mouse')(function(event,callback){
    document.addEventListener(event,callback,false);
});
var N = require('./numberer');
var franim = require('franim');

var insertCss = require('insert-css');
var css = require('../css/style.css');
insertCss(css);


document.aud = franim('canvas',{
    config:{ fullSize: true },
    particles: [],
    createParticles:function(){
        var newLength = Math.round(this.anim.getWidth()/20 + this.anim.getHeight()/20);
        
        while(this.particles.length != newLength){
            if (this.particles.length > newLength) {
                this.particles.pop();
            }else{
                this.particles.push(particleGen(this.stage,this.mouse));
            }
        }
    },
    CONST:{
        BAR_OFFSET: 150,
        BAR_SPACING: 10,
        BAR_WIDTH: 5
    },
    bars: [],
    createBars:function(){
        var spacing = this.CONST.BAR_SPACING;
        var width = this.CONST.BAR_WIDTH;
        var newLength = (this.anim.getWidth()/width)|0 + 1;
        while(this.bars.length != newLength){
            if (this.bars.length > newLength) {
                this.bars.pop();
            }else{
                var i  = this.bars.length - 1;
                this.bars.push(barGen({
                    center:{
                        x: i*spacing + width ,
                        y: this.barY
                    },
                    width: width,
                    magnitude: new N(0)
                }));
            }
        }
    },
    setup:function(ctx){
        this.stage = {
            width: new N(this.anim.getWidth),
            height: new N(this.anim.getHeight)
        };
        this.barY = N.minus(this.stage.height, this.CONST.BAR_OFFSET);
        
        this.stats = stats();
        document.body.appendChild(this.stats.domElement);
        this.mouse = mouse;
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
        
        var FData = this.audio.getFrequencyData();
        if (this.audio.sourceIsLoded) {
            for (var i = 0; i < this.bars.length; i++) {
                this.bars[i].magnitude.set(FData[i + this.CONST.BAR_SPACING]);
            }
        }
        var kFData = this.audio.generateFrequencyK();
        for (var k = 0; k < this.particles.length; k++) {
            this.particles[k].update(kFData);
        }
    },
    draw: function(ctx){
        ctx.globalCompositeOperation = "source-over";
        ctx.fillStyle = 'rgba(0,0,0,.3)';
        ctx.fillRect(0,0,this.anim.getWidth(),this.anim.getHeight());
        ctx.globalCompositeOperation = "lighter";

        if (this.audio.sourceIsLoded) {
            for (var i = 0; i < this.bars.length; i++) {
                this.bars[i].draw(ctx);
            }
        }
        
        for (var k = 0; k < this.particles.length; k++) {
            this.particles[k].draw(ctx);
        }
        this.stats.end();
    }
});
 