var expect = require('chai').expect;
var random = require('../lib/random');
var timesGen = function(t,useArguuments){
    return function(callback,thisArg){
        return function(){
            for(var i = 0;i < t; i++){
                callback.apply(thisArg || null,(useArguuments) ? arguments : [i]);
            }
        };
    };
};
describe('random',function(){
    describe('number',function(){
        var times = timesGen(100, false);
        
        it('should return float from 0 to 1 with no arguments', times(function(){
            expect(random.number()).to.be.within(0,1);
        }));
        
        describe('should return a whole number if the round is true',function(){
            
            it('should return number within [0, arg1]', times(function(i){
                var n = random.number(i);
                expect(n).to.be.within(0,i);
                expect(n).to.be.equal(n|0);
            }));
            
            it('should return number within [arg1, arg2]', times(function(i){
                var n = random.number(i,i+10);
                expect(n).to.be.within(i,i+10);
                expect(n).to.be.equal(n|0);
            }));            
        });
        
        describe('should return a whole number if the round is false',function(){
            
            it('should return number within [0, arg1]', times(function(i){
                var n = random.number(i,false);
                expect(n).to.be.within(0,i);
            }));
            
            it('should return number within [arg1, arg2]', times(function(i){
                var n = random.number(i,i+10,false);
                expect(n).to.be.within(i,i+10);
            }));            
        });
    });
    describe('object',function(){
        it('should make random objcet with default keys');
    });
    describe('color',function(){
        it('should extend default keys and return color object');
    });
    
});