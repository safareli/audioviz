(function(_,$){ // $ is CanvasHelper
                // _ is object to be send to ather moduls
    var stats;
    (function initStats () {
            stats = new $.Stats();
            document.body.appendChild(stats.domElement);
    })();
    


    var canvas,
        context,
        mouse,
        particles=[],
        bars=[],
        audio;

    (function init() {
        audio = new $.Audio(document);
        canvas = document.getElementById('canvas');
        mouse = new $.Mouse(canvas);
        context = canvas.getContext( '2d' );

        _.canvas = canvas;
        _.canvasContext = context;
        _.mouse = mouse;
        _.particles = particles;
        _.bars = bars;

        var Psize;
        var setSize = function() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            var newPsize = Math.round(canvas.width/20 + canvas.height/20);
            Psize = $.def(Psize,newPsize);
            while(Psize != newPsize){
                if (Psize > newPsize) {
                    particles.pop();
                    Psize--;
                }else{
                    particles.push(new $.Particle());
                    Psize++;
                }
            }
        };
        setSize();
        window.onresize = setSize;

        


     

        for (var i = 0; i < Psize; i++) {
            particles.push(new $.Particle());
        }

        // Spacing between the individual bars
        SPACING = 10;
        for (var k = 0; k < canvas.width/SPACING + 1; k++){
            bars.push(new $.Bar());
        }
 
        animate();

    })();


    function animate() {
        requestAnimationFrame(animate);
        stats.begin();
        draw();
        stats.end();
    }

    function draw() {

        var FData = audio.getFrequencyData();
        var kFData = audio.generateFrequencyK();
        //draw bagrounde
        context.globalCompositeOperation = "source-over";
        context.fillStyle = 'rgba(0,0,0,.3)';
        context.fillRect(0,0,canvas.width,canvas.height);
        context.globalCompositeOperation = "lighter";
 

        if (audio.sourceIsLoded) {
            for (var i = 0; i < bars.length; i++) {
                var bar = bars[i];

                var magnitude = FData[i + SPACING];
                context.fillStyle =   bar.getColor(magnitude);

                magnitude-= 50;
                context.fillRect(i * SPACING, canvas.height -150 - magnitude/2, SPACING / 2, magnitude);

            }
        }
        
        for (var k = 0; k < particles.length; k++) {
            var p = particles[k];

            
            context.beginPath();
            p.alpha = $.roundN(p.remaining_life/p.life, 3);
            context.fillStyle = p.g();
            context.arc(p.position.x, p.position.y, p.radius, Math.PI*2,0, false);
            context.fill();

            if(mouse.isIn){
                if (!p.center && mouse.isDown) {
                    p.position.x +=  Math.sin( p.velocity.x * kFData)*kFData;
                    p.position.y += Math.cos( p.velocity.x * kFData)*kFData;
                    p.toMouseK++;
                }else if (p.center && !mouse.isDown) {
                    p.position.x +=  Math.sin( p.velocity.x * kFData)*kFData;
                    p.position.y +=  p.velocity.y;
                    p.remaining_life--;
                    if (p.radius>10) {
                        p.radius*=0.99;
                    }
                }else if (!p.center && !mouse.isDown) {
                    p.position.x += ((mouse.x - p.position.x))/Math.abs(p.velocity.x*p.toMouseK)*Math.abs(Math.sin(kFData));
                    p.position.y += ((mouse.y - p.position.y))/Math.abs(p.velocity.y*p.toMouseK)*Math.abs(Math.cos(kFData));
                    if (p.toMouseK>1) {
                        p.toMouseK--;
                    }
                }else if (p.center && mouse.isDown) {
                    p.remaining_life-=0.5;
                    if (p.radius>10) {
                        p.radius*=0.99;
                    }
                    p.position.x += p.velocity.x;
                    p.position.y += p.velocity.y;
                }
            }else{
                var time = new Date().getTime() * 0.002;
                p.position.x +=  Math.sin( p.velocity.x * kFData)*kFData;
                p.position.y +=  Math.cos( p.velocity.y * kFData)*kFData;
                p.remaining_life-=1/Math.abs(Math.sqrt(Math.pow(p.velocity.x,2) + Math.pow(p.velocity.y,2)));
            }
            

            if(p.alpha<0.01 || p.radius<=0 || p.toMouseK==1){

                if (mouse.isDown || !mouse.isIn) {
                    p.reset(false);
                } else{
                    p.reset(true);
                }
            }


            if (p.position.x < -50) {
                p.position.x = canvas.width+50;
            }
            
            if (p.position.y < -50) {
                p.position.y = canvas.height+50;
            }

            if (p.position.x > canvas.width+50) {
                p.position.x = -50;
            }

            if (p.position.y > canvas.height+50) {
                p.position.y = -50;
            }
        }
    }
})(CanvasHelper._,CanvasHelper);