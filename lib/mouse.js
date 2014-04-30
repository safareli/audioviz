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
        queue: [],
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
            if(i < 0) return;
            touch.start = this.list[i].start;
            this.list[i] = touch;
        },
        remove: function(touch){
            var i = this.getIndex(touch.identifier);
            if(i < 0) return;
            this.list.splice(i,1);
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
        if(this.queue.length === 0)
            this.push(touche);
    }));
    
    on.touch('move', each(function (touche) {
        this.update(touche);
    }));
    
    on.touch('cancel', each(function (touche) {
        this.remove(touche);
    }));
    
    on.touch(['end','leave'], function (touches) {
        for (var j=0; j < touches.length; j++) {
            var touch = touches[j];
            this.update(touch);
            touch.end = new Date().getTime();
            this.queue.push(touch);
            this.remove(touch);
        }
        if(this.list.length === 0 && fullscreen.enabled()){
            var lastTime = this.queue[this.queue.length - 1].end;
            for (var i = this.queue.length - 1; i >= 0; i--) {
                if(lastTime > this.queue[i].end + 200)
                    this.queue.splice(i,1);
                else
                    lastTime = this.queue[i].end;
            }

            if(this.queue.length > 2){
                var sp = 0/*startPerimeter*/, cp = 0/*currentPerimeter*/;
                for (var k =0; k < this.queue.length; k++) {
                    var tc  = this.queue[k], //touchCurrent
                        tn = this.queue[k+1] || this.queue[0],//touchNext
                        cdx = ~~(tn.pageX - tc.pageX),//currentDeltaX
                        cdy = ~~(tn.pageY - tc.pageY),//currentDeltaY
                        sdx = ~~(tn.start.pageX - tc.start.pageX),//nextDeltaX
                        sdy = ~~(tn.start.pageY - tc.start.pageY);//nextDeltaY
                    cp +=  Math.sqrt(cdx*cdx + cdy*cdy);
                    sp +=  Math.sqrt(sdx*sdx + sdy*sdy);
                }
                if(fullscreen.is() && sp-cp > 200 ){
                    fullscreen.cancel();
                }else if (!fullscreen.is() && cp - sp > 200 ){
                    fullscreen.request();
                }
            }
            this.queue = [];
        }

    });
    
    return on.that.mouse;
};