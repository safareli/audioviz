var expect = require('chai').expect;
var rgbaString = require('../lib/rgbastring');

describe('rgbaString',function(){
    var rgbaRegex = /^rgba\((0|[1-9]\d?|1\d\d?|2[0-4]\d|25[0-5]),(0|[1-9]\d?|1\d\d?|2[0-4]\d|25[0-5]),(0|[1-9]\d?|1\d\d?|2[0-4]\d|25[0-5]),((0.[1-9])|[01])\)$/;
    var chanel = function(value){
        return {
            get: function(){
                return value;
            }
        };
    };
    it('should throw arror with no arguments',function(){
        expect(function () { rgbaString(); }).to.throw(TypeError);
        expect(rgbaString.bind(null)).to.throw(TypeError);
    });
    
    it('should throw arror if color is not object',function(){
        expect(rgbaString.bind(null,"asdad")).to.throw(TypeError);
        expect(rgbaString.bind(null,643548)).to.throw(TypeError);
        expect(rgbaString.bind(null,null)).to.throw(TypeError);
    });
    
    it('should throw arror if color is undefined',function(){
        expect(rgbaString.bind(null,undefined)).to.throw(TypeError);
    });
    
    it('should return valid rgba string',function(){
        expect(rgbaString({r:255})).to.match(rgbaRegex);
    });

    it('should return 0 as default for red, green or blue',function(){
        expect(rgbaString({r:255})).to.equal("rgba(255,0,0,1)");
        expect(rgbaString({g:255})).to.equal("rgba(0,255,0,1)");
        expect(rgbaString({b:255})).to.equal("rgba(0,0,255,1)");
    });

    it('should call `get` if `r`, `g`, `b` or `a` has it as a key and use its result',function(){
        expect(rgbaString({r:chanel(200)})).to.equal("rgba(200,0,0,1)");
        expect(rgbaString({g:chanel(250)})).to.equal("rgba(0,250,0,1)");
        expect(rgbaString({b:chanel(205)})).to.equal("rgba(0,0,205,1)");
    });
});