var request = 
    HTMLHtmlElement.prototype.requestFullscreen || 
    HTMLHtmlElement.prototype.mozRequestFullscreen || 
    HTMLHtmlElement.prototype.webkitRequestFullscreen || 
    HTMLHtmlElement.prototype.msRequestFullscreen;
var cancel = 
    HTMLHtmlElement.prototype.cancelFullscreen || 
    HTMLHtmlElement.prototype.mozCancelFullScreen || 
    HTMLHtmlElement.prototype.webkitCancelFullscreen || 
    HTMLHtmlElement.prototype.msCancelFullscreen;
var exit = 
    document.exitFullscreen ||
    document.mozExitFullscreen ||
    document.webkitExitFullscreen ||
    document.msExitFullscreen;
module.exports = {
    enabled: function(){
        return document.fullscreenEnabled ||
            document.mozFullscreenEnabled ||
            document.webkitFullscreenEnabled ||
            document.msFullscreenEnabled;
    },
    is: function(){
        return document.fullscreenElement ||
            document.mozFullscreenElement ||
            document.webkitFullscreenElement ||
            document.msFullscreenElement;
    },
    request: function requestFullscreen(element){
        request.call(element || document.documentElement);
    },
    cancel: function cancelFullScreen(element){
        if(cancel)
            cancel.call(element || document.documentElement);
        else
            exit.call(document);
    }
};
