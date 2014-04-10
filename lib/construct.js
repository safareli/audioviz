module.exports =  function(constructorName){
    return function() {
        var instance = Object.create(constructorName.prototype);
        var result = constructorName.apply(instance, arguments);
        return typeof result === 'object' ? result : instance;
    }
};