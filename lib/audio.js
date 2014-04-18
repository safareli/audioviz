function stop (event){
    if (event.stopPropagation) {
        event.stopPropagation();
    }

    if (event.preventDefault) {
        event.preventDefault();
    }
}

function Audio (){
    this.audioContext = new webkitAudioContext();
    var self = this;
    this.analyser = this.audioContext.createAnalyser();
    this.analyser.smoothingTimeConstant = 0.6;
    this.frequencyData = new Uint8Array(this.analyser.frequencyBinCount);
    this.sourceIsLoded = false;//this - _
    


    document.addEventListener('drop', function (e) {
        stop(e);

        var droppedFiles = e.dataTransfer.files;
        var reader = new FileReader();

        reader.onload = function(fileEvent) {
            self.initAudio(fileEvent.target.result);
        };

        reader.readAsArrayBuffer(droppedFiles[0]);
    }, false);

    document.addEventListener('dragover', stop, false);
}

Audio.prototype.createAudio= function () {
    var processor = this.audioContext.createJavaScriptNode(2048 , 1 , 1 );

    this.source.connect(this.audioContext.destination);
    this.source.connect(this.analyser);

    this.analyser.connect(processor);
    processor.connect(this.audioContext.destination);

    this.source.noteOn(0);
    this.sourceIsLoded = true;//this - _
 
};

Audio.prototype.initAudio = function (data) {
    if (this.source) {
        this.source.noteOff(0);
    }
    this.source = this.audioContext.createBufferSource();
    this.source.loop = true;
    this.sourceIsLoded = false;//this - _
    
    var self = this;
    if(this.audioContext.decodeAudioData) {
        this.audioContext.decodeAudioData(data, function(buffer) {
            self.source.buffer = buffer;
            self.createAudio();
        }, function(e) {
            console.log(e);
            alert("cannot decode mp3");
        });
    } else {
        this.source.buffer = this.audioContext.createBuffer(data, false );
        this.createAudio();
    }
};

Audio.prototype.getFrequencyData = function() {
    this.analyser.getByteFrequencyData(this.frequencyData);
    return this.frequencyData;
};
Audio.prototype.generateFrequencyK = function() {
    var sum = 0 ;
    for (var i = 0; i < this.frequencyData.length; i++) {
        sum += this.frequencyData[i];
    }

    var kFData = ((sum / this.frequencyData.length) / 256) * 5 || 1; //256 the highest a level can be?
    kFData*= kFData;

    return kFData;
};
module.exports = require('newer')(Audio);