var fromDefault = require('./fromdefault');
var extend = require('./extend');


function randomObject(obj) {
    // set data to returnObj
    for (var key in obj){
        obj[key] = random(obj[key]);
    }

    return obj;
}


function randColor(obj){
    var defaults = {
        r:[0,255],
        g:[0,255],
        b:[0,255],
        a:[1,1]
    };
    obj = extend(obj,defaults);
    return randomObject(obj);
}

// random()            =>  0.1567417317
// random(2)           =>  0  or 1
// random(2,false)     =>  float from 0 to 2; 1.2486425527
// random(2,10)        =>  5 or 6 , 7 , 8 ...
// random(2,10,false)  =>  float from 2 to 10; 7.4861754
// returns randome number
function random() {
    var args;
    if (Array.isArray(args[0])) {
        args = argumentsArray;
    }else{
        args = [].slice.call(arguments);
    }

    var end = 1,
        start = 0,
        round = true;
    switch(args.length) {
        case 0:
            round = false;
        break;

        case 1:
            end = fromDefault(args[0],end);
        break;

        case 2:
            if (typeof args[1] == "boolean") {
                end = fromDefault(args[0],end);
                round = fromDefault(args[1],round);
            }else{
                start = fromDefault(args[0],start);
                end = fromDefault(args[1],end);
            }
        break;

        case 3:
            start = fromDefault(args[0],start);
            end = fromDefault(args[1],end);
            round = fromDefault(args[2],round);
        break;
    }

    var result = Math.random() * (end - start);
    if (round) {
        result =   Math.floor(result);
    }
    result += start ;

    return result;
}


module.exports.number = random;
module.exports.object = randomObject;
module.exports.color = randomColor;