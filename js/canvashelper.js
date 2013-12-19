(function (_) {// _  is global

    function CanvasHelper () {
        // Canvas Helper for generating
        // random numbers and colors and ect
        // author irakli saparishvili
        // url http://safareli.github.com
    }


    // round number to specific length after coma
    // if number = 0.123456789 nd length = 5
    // function will return 0.12346
    CanvasHelper.roundN = function(number, length) {
        var newnumber = Math.round(number*Math.pow(10,length))/Math.pow(10,length);
        return parseFloat(newnumber);
    };


    // checks if typeof toCheck is undefined
    // and if is returns default value
    // if not returns toCheck
    CanvasHelper.def = function(toCheck,defaultValue){
        return (typeof toCheck !== 'undefined') ? toCheck : defaultValue;
    };


    // looping for ech key in defaults
    // and using CanvasHelper.def function sets value
    // object wich will be returned
    CanvasHelper.extend = function(object,defaults){
        if (typeof object === "undefined") {
            object = {};
        }

        for (var key in defaults){
            object[key] = this.def(object[key],defaults[key]);
        }

        return object;
    };


    // returns randome number
    // CanvasHelper.rand()            =>  0.1567417317
    // CanvasHelper.rand(2)           =>  0  or 1
    // CanvasHelper.rand(2,false)     =>  float from 0 to 2; 1.2486425527
    // CanvasHelper.rand(2,10)        =>  5 or 6 , 7 , 8 ...
    // CanvasHelper.rand(2,10,false)  =>  float from 2 to 10; 7.4861754
    CanvasHelper.rand = function (argumentsArray) {
         var _arguments = arguments;
        if (Object.prototype.toString.call(argumentsArray) === "[object Array]") {
            _arguments = argumentsArray;
        }

        var end = 1,
            start = 0,
            round = true;
        switch(_arguments.length) {
            case 0:
                round = false;
            break;

            case 1:
                end = this.def(_arguments[0],end);
            break;

            case 2:
                if (typeof _arguments[1] == "boolean") {
                    end = this.def(_arguments[0],end);
                    round = this.def(_arguments[1],round);
                }else{
                    start = this.def(_arguments[0],start);
                    end = this.def(_arguments[1],end);
                }
            break;

            case 3:
                start = this.def(_arguments[0],start);
                end = this.def(_arguments[1],end);
                round = this.def(_arguments[2],round);
            break;
        }

        if (round){
            return  Math.floor(Math.random() * (end - start)) + start ;
        } else{
            return  Math.random() * (end - start) + start ;
        }
    };


    CanvasHelper.randObj = function (obj) {
        // set data to returnObj
        for (var key in obj){
            obj[key] = this.rand(obj[key]);
        }

        return obj;
    };

    CanvasHelper.randColor = function (obj){
        var defaults = {
            r:[0,255],
            g:[0,255],
            b:[0,255],
            a:[1,1]
        };
        obj = this.extend(obj,defaults);
        return this.randObj(obj);
    };


    //return rgba string
    CanvasHelper.rgba = function (color) {
        color = color || this.randColor();
        color.a = this.def(color.a, 1);
        return 'rgba('+color.r+','+color.g+','+color.b+','+color.a+')';
    };

    CanvasHelper._ = {};//data exchange for moduls

    // make CanvasHelper publicly exsible
    _.CanvasHelper = CanvasHelper;



    // copies vender requestAnimationFrame
    // to normal none vender one and will
    // bicome publicly exesible
    _.requestAnimationFrame = (function(){
        return window.requestAnimationFrame    ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame    ||
            window.oRequestAnimationFrame      ||
            window.msRequestAnimationFrame     ||
            function(/* function */ callback, /* DOMElement */ element){
                window.setTimeout(callback, 1000/60);
            };
    })();

    _.onload =  function () {
        var canvas = _.document.getElementById("canvas");
        var head = _.document.getElementsByTagName("head")[0] || _.document.documentElement;
        var dependences = canvas.dataset.dependences.trim().toLowerCase().split(' ');
        for (var i = 0; i < dependences.length; i++) {
            dependences[i]='canvashelper/'+dependences[i]+'.js';
        }
        dependences.push(canvas.id+'.js');
        includeJsFiles(dependences);
        function includeJsFiles (jsFiles) {
            if (jsFiles.length === 0) {
                // obj.onload();
                return false;
            }

            var script = _.document.createElement("script");
            script.src = "/js/"+jsFiles[0];
            head.appendChild(script);
            script.onload = function  () {
                head.removeChild( script );
                includeJsFiles(jsFiles.slice(1));
            };
        }
        _.onload = null;
    };

})(this);