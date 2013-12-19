CanvasHelper.Particle = function Particle() {
    var $ = CanvasHelper;
    var _ = CanvasHelper._;
    var color = {};
    this.g = function () {//Gradient
        if (this.alpha <= 0) {
            return 'hsla(0,0,0,0)';
        }

        var gradient =  _.canvasContext.createRadialGradient(
            this.position.x,
            this.position.y, 0,
            this.position.x,
            this.position.y, this.radius
        );

        var ColorStop = $.rand(0.5,0.8,false);

        
        color.a = this.alpha;
        gradient.addColorStop(0,$.rgba(color));
        gradient.addColorStop(ColorStop,$.rgba(color));
        
        color.a = 0;
        gradient.addColorStop(1,$.rgba(color));

        return gradient;
    };
 
    this.reset = function (center) {
        this.alpha = 1;
        this.center = center || false;
        this.radius = $.rand(20,30);
        if (this.center) {
            this.life = $.rand(15,22);
            this.velocity= $.randObj({x:[-2.5,2.5],y:[-15,-5]});
            this.position = {x:_.mouse.x,y:_.mouse.y};
            color = $.randColor({r:[200,55],g:[50],b:[0]});
            this.toMouseK = 0;
        }else{
            this.life = $.rand(20,50);
            this.toMouseK = 100;
            color = $.randColor();
            this.velocity= $.randObj({x:[-2.5,2.5],y:[-2.5,2.5]});
            this.position= $.randObj({x:[_.canvas.width],y:[_.canvas.height]});
        }
        this.remaining_life = this.life;
    };
    this.reset();
};