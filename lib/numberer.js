var math = function(operation, args){
    return new Numberer(function(){
        return [].reduce.call(args,function(p, c){
            var a = (typeof p === "number") ? p : p.get();
            var b = (typeof c === "number") ? c : c.get();
            switch(operation.name){
                case 'plus': return a + b;
                case 'minus': return a - b;
                case 'div': return a / b;
                case 'mult': return a * b;
                case 'mod': return a % b;
                default: throw TypeError('unknown operation '+operation.name);
            }
        });
    });
};

function Numberer(value){
    this.__value = value;
}

Numberer.prototype.get = function(){
    var v = this.__value;
    if(typeof v === "function") return v();
    else return v;
};

Numberer.prototype.set = function(value){
    this.__value = value;
};

Numberer.plus = function plus(){
    return math(plus,arguments);
};

Numberer.minus = function minus(){
    return math(minus,arguments);
};

Numberer.div = function div(){
    return math(div,arguments);
};

Numberer.mult = function mult(){
    return math(mult,arguments);
};
Numberer.mod = function mod(){
    return math(mod,arguments);
};
module.exports = Numberer;


/*
var a = react(5);
var b = react(plus, a, 9, 6);
var c = plus(a,b);
console.log(c.get());*/