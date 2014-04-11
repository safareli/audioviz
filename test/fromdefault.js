var expect = require('chai').expect;
var fromDefault = require('../lib/fromdefault');
describe('fromDefault',function(){
    var name = "tony", defaultName = "nick";
        
    it('should return second argument if first one is undefined',function(){
        expect(fromDefault(undefined,defaultName)).to.equal(defaultName);
    });
    
    it('should return second argument if first one is null',function(){
        expect(fromDefault(null,defaultName)).to.equal(defaultName);
    });
    
    it('should return first argument if it is defined',function(){
        expect(fromDefault(name,defaultName)).to.equal(name);
    });
    
});