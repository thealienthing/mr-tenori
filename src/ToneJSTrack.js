import Tone from 'tone';
import Track from './Track';

class ToneJSTrack extends Track {
  constructor(args) {
    super(args);
    this.synthSettings = {
      delayTime: 2,
      chorusDepth: .5,
      phaserFreqency: 0.2,
      filterCutoff: 5000,
    }

    //Initialize the track fx here. Not safe to connect until track is initialized
    this.pingPong = new Tone.PingPongDelay(this.synthSettings.delayTime, 0.2);
    this.chorus = new Tone.Chorus(1.5, 2.5, this.synthSettings.chorusDepth);
    this.phaser = new Tone.Phaser(this.synthSettings.phaserFreqency, 1, 1000);
    this.filter = new Tone.Filter(this.synthSettings.filterCutoff, 'lowpass');
    this.synth = new Tone.PolySynth(16, Tone.Synth);
    this.synth.volume.value = this.volume;

    //Here is where the active notes live that the synth is playing
    this.activeFrequencies = []; //Tone.js likes to work with frequencies, not midi numbers; For playback purposes
    this.frequencyTable = [];    //

    for(let i = 0; i < 16; i++) { //MAGIC NUMBER
      this.activeFrequencies.push([]);
    }

    this.setScale();

    //Bind functions here:
    this.addNote = this.addNote.bind(this);
    this.removeNote = this.removeNote.bind(this);
    this.updateSynth = this.updateSynth.bind(this); //For updating settings to fx
    this.setup = this.setup.bind(this);
    this.setScale = this.setScale.bind(this);
    this.setRootNote = this.setRootNote.bind(this);
  }

  advancedUpdateScale() {
    this.frequencyTable = this.midiTable.map(number => Tone.Midi(number).toFrequency());

    let self = this;
    this.activeNoteSquares.forEach(function(activeNotes, beatIndex) {
      self.activeFrequencies[beatIndex] = activeNotes.map((note) => self.frequencyTable[note]);
    });
  }

  updateSynth(element) {
    //Ugly wall of if statements. Convert to switch later
    if(element.id === "delay") {
      this.synthSettings.delayTime = element.value;
      this.pingPong.delayTime.value = this.synthSettings.delayTime;
    }
    else if(element.id === "chorus") {
      this.synthSettings.chorusDepth = element.value;
      this.chorus.depth = element.value;
    }
    else if(element.id === "phaser") {
      this.synthSettings.phaserFreqency = element.value;
      this.phaser.frequency.value = element.value;
    }
    else if(element.id === "filter") {
      this.filter.Q.value = 3; //Fix later - Q set high for easy hearing of filter sweep
      this.synthSettings.filterCutoff = element.value;
      this.filter.frequency.value = element.value;
    }
    else if(element.id === "volume") {
      this.volume = element.value;
      this.synth.volume.value = this.volume;
    }
  }

  advancedAddNote(beat, note) {
    this.activeFrequencies[beat].push(this.frequencyTable[note]);
  }

  advancedRemoveNote(beat, note) {
    this.activeFrequencies[beat] = this.activeFrequencies[beat].filter(noteToRemove => noteToRemove !== this.frequencyTable[note]);
  }

  playTick(tick) {
    this.synth.triggerAttackRelease(this.activeFrequencies[tick], "16n");
    //Consider this! Check to see if track is muted or not; if it is, just return
  }

  setup() {
    this.synth.chain(this.filter, this.phaser, this.chorus, this.pingPong, Tone.Master);
  }
}

export default ToneJSTrack
