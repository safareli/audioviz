var expect = require('chai').expect;
var N = require('../lib/numberer');

describe('numberer',function(){

    describe('set',function(){
        it('should change objects value',function(){
            var num = new N(25);
            expect(num.get()).to.equal(25);
            num.set(20);
            expect(num.get()).to.equal(20);
        });
    });
    
    describe('clone',function(){
        it('should return new object with same value',function(){
            var num = new N(25), bar = num.clone();
            expect(bar).not.to.equal(num);
            expect(bar).to.deep.equal(num);
        });
    });

    describe('get',function(){
        it('should returne its value if not a function',function(){
            expect(new N(null).get()).to.equal(null);
            expect(new N(undefined).get()).to.equal(undefined);
            expect(new N('somestring').get()).to.equal('somestring');
            expect(new N(25).get()).to.equal(25);
            expect(new N(false).get()).to.equal(false);
            expect(new N(NaN).get()).not.to.equal(NaN);
        });

        it('shuld call value if it is function and return its result',function(){
            var a = 9,num = new N(function(){return a + 1;});
            expect(num.get()).to.be.equal(a + 1);
            a = 10;
            expect(num.get()).to.be.equal(a + 1);
        });
    });
    
    describe('math',[].forEach.bind([
        { name: 'plus', args: { v1: 10, v2: 20, v3: 5, iq: 35, v1n: 5, v2n: 10, iqn: 20 } },
        { name: 'minus', args: { v1: 30, v2: 20, v3: 5, iq: 5, v1n: 15, v2n: 10, iqn: 0 } },
        { name: 'div', args: { v1: 1024, v2: 8, v3: 16, iq: 8, v1n: 512, v2n: 4, iqn: 8 } },
        { name: 'mult', args: { v1: 2, v2: 2, v3: 2, iq: 8, v1n: 1, v2n: 1, iqn: 2 } },
        { name: 'mod', args: { v1: 5679, v2: 4315, v3: 798, iq: 566, v1n: 9123, v2n: 995, iqn: 168 } }
    ], function(value){
        var name = value.name;
        var arg = value.args;
        describe(name, function(){
            it('should return numberer',function(){
                var num = N[name](arg.v1, arg.v2, arg.v3);
                expect(num).to.instanceOf(N);
            });

            it('value should be iqual to sum of all arguments',function(){
                var num = N[name](arg.v1, arg.v2, arg.v3);
                expect(num.get()).to.equal(arg.iq);
            });
            
            it('value should work with Numberer arguments',function(){
                var baz = new N(arg.v1), foo = new N(arg.v2);
                var num = N[name](baz, foo, arg.v3);
                expect(num.get()).to.equal(arg.iq);
                baz.set(arg.v1n);
                foo.set(arg.v2n);
                expect(num.get()).to.equal(arg.iqn);
            });
        });
    }));
});