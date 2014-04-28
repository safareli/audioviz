var N = require('numberer');

var mouse = {
    isDown : false,
    isUp : true,
    isIn : false,
    isOut : true,
    position : {
        x: new N(undefined),
        y: new N(undefined)
    }
};

var Touches = {
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
            identifier: touch.identifier, 
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
};

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
    function listen(event,callback){
        if(!Array.isArray(event))
            event = [event];
        for(var i = 0; i < event.length; i++)
            document.addEventListener(event[i], callback, false);
    }
    listen('mouseout', function(){
        mouse.isDown  = false;
        mouse.isUp = true;
        mouse.isIn  = false;
        mouse.isOut  = true;
        mouse.position.x.set(undefined);
        mouse.position.y.set(undefined);
    });
    
    listen('touchstart', function (event) {
        event.preventDefault();
            
        var touches = event.changedTouches;
        for (var i=0; i < touches.length; i++) {
            Touches.push(touches[i]);
        }
    });
    
    listen('touchmove', function (event) {
        event.preventDefault();
        
        var touches = event.changedTouches;
        for (var i=0; i < touches.length; i++) {
            Touches.update(touches[i]);
        }
    });
    
    listen('touchcancel', function (event) {
        event.preventDefault();
        
        var touches = event.changedTouches;
        for (var i=0; i < touches.length; i++) {
            Touches.remove(touches[i]);
        }
        
    });
    listen(['touchend','touchleave'], function (event) {
        event.preventDefault();
        var i, touches = event.changedTouches;

        if(fullscreen.enabled() && Touches.list.length != 1){
            var startPerimeter = 0;
            var currentPerimeter = 0;
            for (i =0; i < Touches.list.length; i++) {
                var touch  = Touches.list[i],
                    touchNext = Touches.list[i+1] || Touches.list[0],
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
            Touches.remove(touches[i]);
        }
    });
    
    listen('mousemove', function (event) {
        mouse.position.x.set(event.pageX);
        mouse.position.y.set(event.pageY);
    });
    
    
    listen('mouseover',  function () {
        mouse.isIn = true;
        mouse.isOut = false;
    });
    
    listen('mousedown',  function () {
        mouse.isDown = true;
        mouse.isUp = false;
    });
    
    listen('mouseup',  function () {
        mouse.isDown = false;
        mouse.isUp = true;
    });
    
    return mouse;
};