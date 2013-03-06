CanvasHelper.Bar = function Bar (){
    var $ = CanvasHelper;
    this.color = {};

    this.getColor = function (magnitude) {
        this.color.r = magnitude;
        this.color.g = magnitude%50 ;
        this.color.b = (255-magnitude)%75;
        this.color.a = 1;
        if (magnitude < 65) {
            return 'rgba(0,0,0,0)';
        }
        return $.rgba(this.color);
    };
};