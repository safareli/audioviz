var N = require('numberer');
var fullscreen =  require('./fullscreen');
var on = require('./on')({
    element: document,
    on : ['mouse', 'touch'],
    before: { touch: function(event){
        event.preventDefault();
        return [event.changedTouches];
    }},
    after: { touch: function(){
        // console.log(Date);
    }},
    that: { mouse: {
        isDown : false,
        isUp : true,
        isIn : false,
        isOut : true,
        position : {
            x: new N(undefined),
            y: new N(undefined)
        }
    }, touch: {
        list: [],
        getIndex: function(identifier){
            for(var i = 0; i < this.list.length; i++){
                if( this.list[i].identifier == identifier)
                    return i;
            }
            return -1;
        },
        push: function(touch){
            touch.start = {
                pageX: touch.pageX, 
                pageY: touch.pageY
            };
            this.list.push(touch);
        },
        update: function(touch){
            var i = this.getIndex(touch.identifier);
            touch.start = this.list[i].start;
            this.list[i] = touch;
        },
        remove: function(touch){
            this.list.splice(this.getIndex(touch.identifier),1);
        }
    }}
});

var each = function(callback){
    return function(array){
        for(var i = 0;i < array.length; i++){
            var arg = [].slice.call(arguments);
            arg[0] = array[i];
            callback.apply(this,arg);
        }
    };
};

module.exports = function(){
    
    on.mouse('move', function (event) {
        this.position.x.set(event.pageX);
        this.position.y.set(event.pageY);
    });
    
    on.mouse('over',  function () {
        this.isIn = true;
        this.isOut = false;
    });
    
    on.mouse('down',  function () {
        this.isDown = true;
        this.isUp = false;
    });
    
    on.mouse('up',  function () {
        this.isDown = false;
        this.isUp = true;
    });

    on.mouse('out', function(){
        this.isDown  = false;
        this.isUp = true;
        this.isIn  = false;
        this.isOut  = true;
        this.position.x.set(undefined);
        this.position.y.set(undefined);
    });
    
    on.touch('start', each(function (touche) {
        this.push(touche);
    }));
    
    on.touch('move', each(function (touche) {
        this.update(touche);
    }));
    
    on.touch('cancel', each(function (touche) {
        this.remove(touche);
    }));
    
    on.touch(['end','leave'], function (touches) {
        var i;

        if(fullscreen.enabled() && this.list.length != 1){
            var startPerimeter = 0;
            var currentPerimeter = 0;
            for (i =0; i < this.list.length; i++) {
                var touch  = this.list[i],
                    touchNext = this.list[i+1] || this.list[0],
                    cdx = ~~(touchNext.pageX - touch.pageX),//currentDeltaX
                    cdy = ~~(touchNext.pageY - touch.pageY),//currentDeltaY
                    sdx = ~~(touchNext.start.pageX - touch.start.pageX),//startPerimeter
                    sdy = ~~(touchNext.start.pageY - touch.start.pageY);//startPerimeter
                
                currentPerimeter +=  Math.sqrt(cdx*cdx + cdy*cdy);
                startPerimeter +=  Math.sqrt(sdx*sdx + sdy*sdy);
            }
            if(fullscreen.is() && startPerimeter > currentPerimeter){
                fullscreen.cancel();
            }else if (!fullscreen.is() && startPerimeter < currentPerimeter){
                fullscreen.request();
            }
        }
        
        for (i=0; i < touches.length; i++) {
            this.remove(touches[i]);
        }
    });
    
    return on.that.mouse;
};