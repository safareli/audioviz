// checks if typeof toCheck is undefined
// and if is, returns default value
// if not, returns toCheck
module.exports = function fromDefault(toCheck,defaultValue){
    return (typeof toCheck !== 'undefined' && toCheck !== null) ? toCheck : defaultValue;
};

