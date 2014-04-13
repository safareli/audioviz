var expect = require('chai').expect;
var rgbaString = require('../lib/rgbastring');

describe('rgbaString',function(){
    var rgbRegex = /^rgba\((\d+),\s*(\d+),\s*(\d+),\s*(\d+)\)$/;
    
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
    
    it('should return valid rgba string');
});