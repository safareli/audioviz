CanvasHelper.Mouse = function Mouse(domObj){
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
    

    domObj.addEventListener('mousemove', function (event) {
        self.x = event.pageX;
        self.y = event.pageY;
    },false);

    domObj.addEventListener('mouseout',  function () {
        self.reset();
    },false);

    domObj.addEventListener('mouseover',  function () {
        self.isIn = true;
    },false);

    domObj.addEventListener('mousedown',  function () {
        self.isDown = true;
    },false);

    domObj.addEventListener('mouseup',  function () {
        self.isDown = false;
    },false);
};