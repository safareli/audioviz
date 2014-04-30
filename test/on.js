var chai = require('chai'),
    expect = chai.expect,
    spies = require('chai-spies'),
    On = require('../lib/on');
chai.use(spies);

var element =  {
    events: {},
    addEventListener: function(name,callback){
        this.events[name] = this.events[name] || [];
        this.events[name].push(callback);
    },
    fire: function(name,args){
        var listeners = this.events[name];
        for(var i = 0; i < listeners.length; i++){
            listeners[i].apply(undefined, args);
        }
    }
};
  
describe('on',function(){
    var opts = {
        element: element,
        on : ['mouse'],
        before: { mouse: chai.spy(function(){
            this.beforeCalled = true;
        })},
        after: { mouse: chai.spy(function(){
            this.afterCalled = true;
        })},
        that: { mouse: {}}
    }, on =  On(opts);
    

    describe('click',function(){
        var onclickListener = chai.spy();
        
        it('should add listener',function(){
            on('click',onclickListener);
            expect(element.events.click[0]).to.be.instanceof(Function);
        });
        
        it('should be called',function(){
            element.fire('click');
            expect(onclickListener).to.have.been.called.once;
        });

    });

    describe('mouse',function(){
        var onMouseMoveListener = chai.spy(function(){
            this.onCalled = true;
        });
        
        it('should add listeners with prefix mouse',function(){
            on.mouse('move', onMouseMoveListener);
            expect(element.events.mousemove[0]).to.be.instanceof(Function);
        });
        
        it('should be called',function(){
            element.fire('mousemove');
            expect(onMouseMoveListener).to.have.been.called.once;
        });
        
        it('should has access to that',function(){
            expect(on.that.mouse.onCalled).to.be.ok;
        });
        
        describe('before',function(){
            
            it('should be called once',function(){
                expect(opts.before.mouse).to.have.been.called.once;
            });
            
            it('should has access to that',function(){
                expect(on.that.mouse.beforeCalled).to.be.ok;
            });
        });
        
        describe('after',function(){
            
            it('should be called once',function(){
                expect(opts.after.mouse).to.have.been.called.once;
            });
            
            it('should has access to that',function(){
                expect(on.that.mouse.afterCalled).to.be.ok;
            });
        });
    });
});