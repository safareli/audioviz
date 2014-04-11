var fromDefault = require('./fromdefault');
var extend = require('./extend');


function randomObject(obj) {
    // set data to returnObj
    for (var key in obj){
        obj[key] = random(obj[key]);
    }

    return obj;
}


function randomColor(obj){
    var defaults = {
        r:[0,255],
        g:[0,255],
        b:[0,255],
        a:[1,1]
    };
    obj = extend(obj,defaults);
    return randomObject(obj);
}

// random()            =>  float from 0 to  1; 0.1567417317
// random(10)          =>  int   from 0 to 10; 0, 5, 7, 9
// random(10,false)    =>  float from 0 to 10; 5.2486425527
// random(2,10)        =>  int   from 2 to 10; 2, 5, 7, 9
// random(2,10,false)  =>  float from 2 to 10; 7.4861754
function random(start,end,round){
    
    if(typeof end === "boolean"){
        start = 0;
        end = fromDefault(start,1);
        round = end;
    }else if(typeof round === "boolean"){
        start = fromDefault(start,0);
        end = fromDefault(end,1);
    }else{
        start = fromDefault(start,0);
        end = fromDefault(end,1);
        round = fromDefault(round,true);
    }
    var temp = Math.random() * (end - start);
    if (round) {
        temp = Math.floor(temp);
    }

    return temp + start;
}


module.exports.number = random;
module.exports.object = randomObject;
module.exports.color = randomColor;