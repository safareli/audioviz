
function CH (){
    // Canvase Helper for generating
    // random numbers and colors
    // author irakli saparishvili
    // url http://safareli.github.com
}

CH.requestAnimFrame = function(){
  return  window.requestAnimationFrame       ||
          window.webkitRequestAnimationFrame ||
          window.mozRequestAnimationFrame    ||
          window.oRequestAnimationFrame      ||
          window.msRequestAnimationFrame     ||
          function(/* function */ callback, /* DOMElement */ element){
            window.setTimeout(callback, 1000/60);
          };
};

CH.roundNumber = function (num, length) {
    var newnumber = Math.round(num*Math.pow(10,length))/Math.pow(10,length);
    return parseFloat(newnumber);
};

CH.extend = function(object,defaults){

    if (typeof object === "undefined") {
        object = {};
    }

    for (key in defaults){
        object[key] = CH.def(object[key],defaults[key]);
    }
    return object;
};

CH.def = function(toCheck,defaultValue){
    return (typeof toCheck !== 'undefined') ? toCheck : defaultValue;
};

CH.rand = function  (length,start,round) {
    start = CH.def(start,0);
    round = CH.def(round,true);
    if (round){
        return  Math.floor(Math.random() * length) + start ;
    } else{
        return  Math.random() * length + start ;
    }
};

CH.randXY = function (obj) {
    var defaults = {
        //xl *  //  xLength
        //yl *  //  yLength
        xs:0,   //  xStart
        ys:0    //  yStart
    };
    // * required
    obj = this.extend(obj,defaults);

    var position = {
        x : this.rand(obj.xl,obj.xs),
        y : this.rand(obj.yl,obj.ys)
    };
    return position;
};

CH.randColor = function (obj){
    var defaults = {
        rl:255, //  redLength
        rs:0,   //  redStart
        gl:255, //  greenLength
        gs:0,   //  greenStart
        bl:255, //  blueLength
        bs:0,   //  blueStart
        al:0,   //  alphaLength
        as:1   //  alphaStart
    };

    obj = this.extend(obj,defaults);
    
    var color = {
        r: this.rand(obj.rl,obj.rs),
        g: this.rand(obj.gl,obj.gs),
        b: this.rand(obj.bl,obj.bs),
        a: this.rand(obj.al,obj.as,false)
    };
    return color;
};

CH.rgba = function (color) {
    color = color || this.randColor();
    return 'rgba('+color.r+','+color.g+','+color.b+','+color.a+')';
};

CH.Particle = function Particle() {
    this.g = function () {//Gradient
        if (this.alpha <= 0) {
            return 'hsla(0,0,0,0)';
        }

        var gradient = context.createRadialGradient(this.position.x, this.position.y, 0,
                this.position.x, this.position.y, this.radius);

        var ColorStop = CH.rand(0.5,0.3,false);

        gradient.addColorStop(0,CH.rgba({
            r:this.colorMiddle.r,
            g:this.colorMiddle.g,
            b:this.colorMiddle.b,
            a:this.alpha
        }));
        // console.log(ColorStop);
        gradient.addColorStop(ColorStop,CH.rgba({
            r:this.colorMiddle.r,
            g:this.colorMiddle.g,
            b:this.colorMiddle.b,
            a:this.alpha
        }));

        gradient.addColorStop(1,CH.rgba({
            r:this.colorMiddle.r,
            g:this.colorMiddle.g,
            b:this.colorMiddle.b,
            a:0
        }));
        return gradient;
    };
 
    this.reset = function (center) {
        this.alpha = 1;
        this.center = center || false;
        this.radius = CH.rand(20, 10);
        if (this.center) {
            this.life = CH.rand(15,7);
            this.velocity= CH.randXY({xl:5,xs:-2.5,yl:10,ys:-15});
            this.position = {x:mouse.x,y:mouse.y};
            this.colorMiddle = CH.randColor({rs:200,rl:55,bl:0,gl:50,gs:0});
            this.toMouseK = 0;
        }else{
            this.life = CH.rand(20,30);
            this.toMouseK = 100;
            this.colorMiddle = CH.randColor();
            this.velocity= CH.randXY({xl:5,xs:-2.5,yl:5,ys:-2.5});
            this.position = CH.randXY({xl:W,yl:H});
        }
        this.remaining_life = this.life;
    };
    this.reset();
};

CH.Bar = function Bar (){
    this.color = {};

    this.getColor = function (magnitude) {
        if (mouse.isIn) {
            this.color.r = magnitude;
            this.color.g = magnitude%50 ;
        }else{
            this.color.r = magnitude%100;
            this.color.g = magnitude ;
        }
        this.color.b = (255-magnitude)%75;
        this.color.a = 1;
        if (magnitude < 65) {
            return 'rgba(0,0,0,0)';
        }
        return CH.rgba(this.color);
    };
};
CH.Mouse = function Mouse(canvas){
    this.isDown = false;
    this.isIn = false;
    this.x = undefined;
    this.y = undefined;
    this.reset = function(){
        this.isDown = false;
        this.isIn = false;
        this.x = undefined;
        this.y = undefined;
    };

    var self = this;
    

    canvas.addEventListener('mousemove', function (event) {
        self.x = event.pageX;
        self.y = event.pageY;
    },false);

    canvas.addEventListener('mouseout',  function () {
        self.reset();
    },false);

    canvas.addEventListener('mouseover',  function () {
        self.isIn = true;
    },false);

    canvas.addEventListener('mousedown',  function () {
        self.isDown = true;
    },false);

    canvas.addEventListener('mouseup',  function () {
        self.isDown = false;
    },false);

}
