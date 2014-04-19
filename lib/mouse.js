var N = require('./numberer');

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

module.exports = function(listen){
    listen('mouseout', function(){
        mouse.isDown  = false;
        mouse.isUp = true;
        mouse.isIn  = false;
        mouse.isOut  = true;
        mouse.position.x.set(undefined);
        mouse.position.y.set(undefined);
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