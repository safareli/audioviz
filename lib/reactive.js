var privater = require('./privater');
var newer = require('newer');

var Reactive = (function(_){
    function Reactive(value){
        if(arguments.length > 1){
            return value.apply(null,[].slice.call(arguments,1));
        }else{
            _(this).value = value;
        }
    }
    
    Reactive.prototype.get = function(){
        var v = _(this).value;
        if(typeof v === "function") return v();
        else return v;
    };
    
    Reactive.prototype.set = function(value){
        _(this).value = value;
    };
    
    return Reactive;
}(privater()));

var reactive = newer(Reactive);
module.exports = reactive;

module.exports.plus = function plus(){
    return math(plus,arguments);
};

module.exports.minus = function minus(){
    return math(minus,arguments);
};

module.exports.div = function div(){
    return math(div,arguments);
};

module.exports.mult = function mult(){
    return math(mult,arguments);
};

var math = function(operation, args){
    return reactive(function(){
        return [].reduce.call(args,function(p, c){
            var a = (typeof p === "number") ? p : p.get();
            var b = (typeof c === "number") ? c : c.get();
            switch(operation.name){
                case 'plus': return a + b;
                case 'minus': return a - b;
                case 'div': return a / b;
                case 'mult': return a * b;
                default: throw TypeError('unknown operation '+operation.name);
            }
        });
    });
};
/*
var a = react(5);
var b = react(plus, a, 9, 6);
var c = plus(a,b);
console.log(c.get());*/