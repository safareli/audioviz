var math = function(operation, args){
    return new Numberer(function(){
        return args.reduce(function(p, c){
            var a = (p && p.get) ? p.get() : p;
            var b = (c && c.get) ? c.get() : c;
            switch(operation){
                case 'plus': return a + b;
                case 'minus': return a - b;
                case 'div': return a / b;
                case 'mult': return a * b;
                case 'mod': return a % b;
                default: throw TypeError('unknown operation '+operation);
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
Numberer.prototype.clone = function(){
    return new Numberer(this.__value);
};

['plus', 'minus', 'div', 'mult', 'mod'].forEach(function(name){
    Numberer.prototype[name] = function() {
        var args = [].slice.call(arguments);
        args.unshift(this.clone());
        this.__value = (math(name, args)).__value;
    };

    Numberer[name] = function() {
        return math(name,[].slice.call(arguments));
    };
});

module.exports = Numberer;