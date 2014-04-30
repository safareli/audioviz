var N = require('numberer');
var on = require('./on')({
    element: document,
    on : ['mouse', 'touch'],
    before: { touch: function(e){
        e.preventDefault();
    }},
    after: { touch: function(){
        console.log(Date);
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
            var start = this.list[i].start;
            touch.start = start;
            this.list[i] = touch;
        },
        remove: function(touch){
            var i = this.getIndex(touch.identifier);
            this.list.splice(i,1);
        }
    }}
});

var fullscreen = {
    enabled: function(){
        return document.fullscreenEnabled ||
            document.mozFullscreenEnabled ||
            document.webkitFullscreenEnabled ||
            document.msFullscreenEnabled;
    },
    is: function(){
        return document.fullscreenElement ||
            document.mozFullscreenElement ||
            document.webkitFullscreenElement ||
            document.msFullscreenElement;
    },
    request: (function(){
        var request = 
            HTMLHtmlElement.prototype.requestFullscreen || 
            HTMLHtmlElement.prototype.mozRequestFullscreen || 
            HTMLHtmlElement.prototype.webkitRequestFullscreen || 
            HTMLHtmlElement.prototype.msRequestFullscreen;
        return function requestFullscreen(element){
            request.call(element || document.documentElement);
        };
    })(),
    cancel: (function(){
        var cancel = 
            HTMLHtmlElement.prototype.cancelFullscreen || 
            HTMLHtmlElement.prototype.mozCancelFullScreen || 
            HTMLHtmlElement.prototype.webkitCancelFullscreen || 
            HTMLHtmlElement.prototype.msCancelFullscreen;
        var exit = document.exitFullscreen ||
            document.mozExitFullscreen ||
            document.webkitExitFullscreen ||
            document.msExitFullscreen;
        return function cancelFullScreen(element){
            if(cancel)
                cancel.call(element || document.documentElement);
            else{
                exit.call(document);
            }
        };
    })()
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
    
    on.touch('start', function (event) {
        var touches = event.changedTouches;
        for (var i=0; i < touches.length; i++) {
            this.push(touches[i]);
        }
    });
    
    on.touch('move', function (event) {
        var touches = event.changedTouches;
        for (var i=0; i < touches.length; i++) {
            this.update(touches[i]);
        }
    });
    
    on.touch('cancel', function (event) {
        var touches = event.changedTouches;
        for (var i=0; i < touches.length; i++) {
            this.remove(touches[i]);
        }
    });
    
    on.touch(['end','leave'], function (event) {
        var i, touches = event.changedTouches;

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