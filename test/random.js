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
    var times = timesGen(100, false);
    describe('number',function(){
        var number = random.number;
        
        it('should return float from 0 to 1 with no arguments', times(function(){
            expect(number()).to.be.within(0,1);
        }));
        
        describe('should return a whole number if the round is true',function(){
            
            it('should return number within [0, arg1]', times(function(i){
                var n = number(i);
                expect(n).to.be.within(0,i);
                expect(n).to.be.equal(n|0);
            }));
            
            it('should return number within [arg1, arg2]', times(function(i){
                var n = number(i,i+10);
                expect(n).to.be.within(i,i+10);
                expect(n).to.be.equal(n|0);
            }));            
        });
        
        describe('should return number if the round is false',function(){
            
            it('should return number within [0, arg1]', times(function(i){
                var n = number(i,false);
                expect(n).to.be.within(0,i);
            }));
            
            it('should return number within [arg1, arg2]', times(function(i){
                var n = number(i,i+10,false);
                expect(n).to.be.within(i,i+10);
            }));            
        });
    });
    describe('object',function(){
        var object = random.object;
        
        it('should make random object with default keys', times(function(i){
            var position = object({
                x: [-50*i, 50*i],
                y: [-20*i, 20*i]
            });
            expect(position.x).to.be.within(-50*i, 50*i);
            expect(position.y).to.be.within(-20*i, 20*i);
        }));
    });
    describe('color',function(){
        var color = random.color;
        
        it('should make random rgba color with no arguments', times(function(i){
            var background = color();

            expect(background.r).to.be.within(0,255);
            expect(background.r).to.be.equal(background.r|0);
            
            expect(background.g).to.be.within(0,255);
            expect(background.g).to.be.equal(background.g|0);
            
            expect(background.b).to.be.within(0,255);
            expect(background.b).to.be.equal(background.b|0);
            
            expect(background.a).to.be.within(0,1);
        }));
    });
    
});