var expect = require('chai').expect;
var construct = require('../lib/construct');
describe('construct', function(){
    it('should return function',function(){
        expect(construct({})).to.be.instanceof(Function);
    });
    describe('Animal', function(){
        function Animal(name,age){
            this.name = name;
            this.age = age;
        }
        
        Animal.prototype.getName = function(){
            return this.name;
        };
        
        Animal.prototype.getAge = function(){
            return this.name;
        };
        var animal = construct(Animal);
        
        it('should create new instance of Animal',function(){
            expect(animal('tony',2)).to.instanceof(Animal);
        });
        
        it('created object should be equal to one created with "new"',function(){
            expect(animal('jim',4)).to.deep.equal(new Animal('jim',4));
        });
    });
});