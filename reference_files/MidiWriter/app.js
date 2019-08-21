var MidiWriter = require('midi-writer-js');
const fs = require('fs');
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

write.saveMIDI('test2')
console.log(write.dataUri());
