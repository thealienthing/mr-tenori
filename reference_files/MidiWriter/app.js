var MidiWriter = require('midi-writer-js');
var track = new MidiWriter.Track();

track.addEvent([
            new MidiWriter.NoteEvent({pitch: ['60','60', '58', '60'], duration: '8', sequential: 'true'}),
            new MidiWriter.NoteEvent({pitch: ['55'], wait: '8', duration: '8'}),
            new MidiWriter.NoteEvent({pitch: ['55'], wait: '8', duration: '8'}),
            new MidiWriter.NoteEvent({pitch: ['60','65', '64', '60'], duration: '8'}),
    ], function(event, index) {
      return{sequential: 'true'};
  }
);

var write = new MidiWriter.Writer(track);

//write.saveMIDI('test2')
var data = write.dataUri();
console.log(write.dataUri());

function srcToFile(src, fileName, mimeType){
    return (fetch(src)
        .then(function(res){return res.arrayBuffer();})
        .then(function(buf){return new File([buf], fileName, {type:mimeType});})
    );
}

srcToFile(
    data,
    'hello.mid',
    'audio/midi'
)
.then(function(file){
    console.log(file);
})
