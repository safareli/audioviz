var expect = require('chai').expect;
var extend = require('../lib/extend');
describe('extend',function(){
    var always = [
        [null,null],
        [5,"asdasd"],
        [54354,undefined],
        [undefined,54354],
        ['asdasd',[]]
    ];

    it('should always return an object',function(){
        always.forEach(function(element, index, array){
            var extended = extend.apply(null,element);
            var title = 'always[' + index + ']';
            expect(extended, title).to.be.an.instanceof(Object);
            expect(extended, title).to.be.empty;
        });
    });

    it('should extend the first argument with second arguments keys',function(){
        var user = {
            userName:'jhon555',
            gender:'male'
        };
        
        var userDefaults = {
            gender:'ather',
            type:'free'
        };
        
        var userExtended = extend(user,userDefaults);
        
        expect(userExtended).to.have.keys(['userName', 'gender', 'type']);
        expect(userExtended.gender).to.equal(user.gender);
        expect(userExtended.gender).not.to.equal(userDefaults.gender);
        expect(userExtended.userName).to.equal(user.userName);
        expect(userExtended.type).to.equal(userDefaults.type);

    });
});