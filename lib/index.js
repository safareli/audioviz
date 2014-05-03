"use strict";

var stats = require('./stats');
var particleGen = require('./particle');
var barGen = require('./bar');
var audio = require('./audio');
var mouse = require('./mouse');
var N = require('numberer');
var franim = require('franim');

var insertCss = require('insert-css');
var css = require('../css/style.css');
insertCss(css);


document.aud = franim('canvas',{
    config:{ fullSize: true },
    particles: [],
    bars: [],
    CONST:{
        BAR_OFFSET: 150,
        BAR_SPACING: 10,
        BAR_WIDTH: 5
    },
    create: function(array,length,generator){
        var newLength = Math.round(length.get());
        while(array.length != newLength){
            if (array.length > newLength) {
                array.pop();
            }else{
                array.push(generator());
            }
        }
    },
    setup:function(ctx){
        this.stage = {
            width: new N(this.anim.getWidth),
            height: new N(this.anim.getHeight)
        };
        this.stats = stats();
        document.body.appendChild(this.stats.domElement);
        this.mouse = mouse();
        this.audio = audio();
        window.addEventListener('resize', (function resize() {
            this.create( 
                this.particles,
                N.div(this.stage.width,20).plus(N.div(this.stage.height,20)),
                particleGen.bind(undefined,this.stage,this.mouse)
            );
            this.create( 
                this.bars,
                N.div(this.stage.width,this.CONST.BAR_WIDTH).plus(1),
                (function(){
                    var barY = N.minus(this.stage.height, this.CONST.BAR_OFFSET);
                    var spacing = this.CONST.BAR_SPACING;
                    var width = this.CONST.BAR_WIDTH;
                    return function(){
                        var i = this.bars.length - 1;
                        return barGen({
                            center:{
                                x: i*spacing + width ,
                                y: barY
                            },
                            width: width,
                            magnitude: new N(0)
                        });
                    }.bind(this);
                }.bind(this)())
            );
            return resize;
        }.bind(this))(), true);
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
 