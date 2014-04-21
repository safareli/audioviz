require('./default');

function randomObject(obj) {
    // set data to returnObj
    for (var key in obj){
        if(obj.hasOwnProperty(key)){
            obj[key] = randomNumber.apply(null,obj[key]);
        }
    }

    return obj;
}


function randomColor(obj){
    return randomObject(({
        r:[0,255],
        g:[0,255],
        b:[0,255],
        a:[1,1]
    }).default(obj));
}

// random()            =>  float from 0 to  1; 0.1567417317
// random(10)          =>  int   from 0 to 10; 0, 5, 7, 9
// random(10,false)    =>  float from 0 to 10; 5.2486425527
// random(2,10)        =>  int   from 2 to 10; 2, 5, 7, 9
// random(2,10,false)  =>  float from 2 to 10; 7.4861754
function randomNumber(start,end,round){
    
    if(typeof end === "boolean"){
        start = 0;
        end = (1).default(start);
        round = end;
    }else if(typeof round === "boolean"){
        start = (0).default(start);
        end = (1).default(end);
    }else{
        start = (0).default(start);
        end = (1).default(end);
        round = (true).default(round);
    }
    var temp = Math.random() * (end - start);
    if (round) {
        temp = Math.floor(temp);
    }

    return temp + start;
}


module.exports.number = randomNumber;
module.exports.object = randomObject;
module.exports.color= randomColor;