function Mouse(){
    this.isDown = false;
    this.isIn = false;
    this.x = undefined;
    this.y = undefined;
    var self = this;
    
    document.addEventListener('mousemove', function (event) {
        self.x = event.pageX;
        self.y = event.pageY;
    },false);

    document.addEventListener('mouseout',  function () {
        self.reset();
    },false);

    document.addEventListener('mouseover',  function () {
        self.isIn = true;
    },false);

    document.addEventListener('mousedown',  function () {
        self.isDown = true;
    },false);

    document.addEventListener('mouseup',  function () {
        self.isDown = false;
    },false);
}
Mouse.prototype.reset = function(){
    this.isDown = false;
    this.isIn = false;
    this.x = undefined;
    this.y = undefined;
};

module.exports = require('./construct')(Mouse);