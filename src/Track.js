class Track {
  constructor(args) {
    //Constants
    this.scaleOptions = {
      pentatonicMajor: [0, 2, 4, 7, 9, 12, 14, 16, 19, 21, 24, 26, 28, 31, 33, 36],
      pentatonicMinor: [0, 3, 5, 7, 10,12, 15, 17, 19, 22, 24, 27, 29, 31, 34, 36],
      diatonicMajor:   [0, 2, 4, 5, 7, 9, 11, 12, 14, 16, 17, 19, 21, 23, 24, 26, 28, 29, 31, 33, 35, 36],
      naturalMinor:    [0, 2, 4, 5, 7, 9, 11, 12, 14, 16, 17, 19, 21, 23, 24, 26, 28, 29, 31, 33, 35, 36], // this isn't right
    }

    this.rootNoteOptions = {
      "A4": 69, "C4": 72, "D4": 74, "G4": 79,
    }

    //Data members
    this.rootNote = 69;
    this.scaleName = "pentatonicMajor";
    this.volume = -6;

    //Here is where the active notes live that the synth is playing
    //this.activeFrequencies = []; //Tone.js likes to work with frequencies, not midi numbers; For playback purposes ****TONEJSTRACK specific
    this.activeMidiNotes = [];   //We want to eventually export the midi, so we will hold on to the notes
    this.activeNoteSquares = []; //We need to know which note boxes are selected so we can quickly change them when we need to
    this.midiTable = [];         //
    //this.frequencyTable = [];    //****TONEJSTRACK specific

    this.numTicks = args.numTicks;
    this.updateNumTicks(this.numTicks);

    this.numPitches = this.scaleOptions[this.scaleName].length;

    //Bind functions here:
    this.addNote = this.addNote.bind(this);
    this.removeNote = this.removeNote.bind(this);
    this.updateSynth = this.updateSynth.bind(this); //For updating settings to fx
    this.setup = this.setup.bind(this);
    this.setScale = this.setScale.bind(this);
    this.setRootNote = this.setRootNote.bind(this);
  }

  updateNumTicks(numTicks) {
    this.numTicks = numTicks;
    if (this.numTicks > this.activeMidiNotes.length) { //We want more ticks than we already have so we gonna grow our array
      for (var i = this.activeMidiNotes.length; i < this.numTicks; i++) {
        this.activeMidiNotes.push([]);
        this.activeNoteSquares.push([]);
      }
    }
    this.advancedUpdateNumTicks(this.numTicks);
  }

  advancedUpdateNumTicks(numTicks) {
    console.log("This is an optional abstract callback");
  }

  setScale(scale) {
    if(scale in this.scaleOptions){
      this.scaleName = scale;
    }
    else {
      this.scaleName = "pentatonicMajor";
    }
    this.updateScale();
  }

  updateScale() {
    let newScale = this.scaleOptions[this.scaleName];
    newScale = newScale.map((note) => note + this.rootNote);

    this.midiTable = newScale;
    // this.frequencyTable = this.midiTable.map(number => Tone.Midi(number).toFrequency());

    let self = this;
    this.activeNoteSquares.forEach(function(activeNotes, beatIndex) {
      self.activeMidiNotes[beatIndex] = activeNotes.map((note) => self.midiTable[note]);
      //self.activeFrequencies[beatIndex] = activeNotes.map((note) => self.frequencyTable[note]);
    });
    this.advancedUpdateScale()
  }

  advancedScaleSetup() {
    console.log("This is an optional abstract callback");
  }

  setRootNote(rootNote) {
    let parsed = parseInt(rootNote, 10);
    if(isNaN(parsed)) {
      console.log("WHY IS THIS HAPPENING");
      return;
    }
    if(parsed < 0 || parsed > 91){
      console.log("THATS OUT OF RANGE, MAN");
      return;
    }
    this.rootNote = parsed;
    this.updateScale();
  }

  addNote(beat, note) {
    this.activeNoteSquares[beat].push(note);
    this.activeMidiNotes[beat].push(this.midiTable[note]);
    //this.activeFrequencies[beat].push(this.frequencyTable[note]);
    this.advancedAddNote(beat, note);
  }

  advancedAddNote(beat, note) {
    console.log("This is an optional abstract callback");
  }

  removeNote(beat, note) {
    this.activeNoteSquares[beat] = this.activeNoteSquares[beat].filter(noteToRemove => noteToRemove !== note);
    this.activeMidiNotes[beat] = this.activeMidiNotes[beat].filter(noteToRemove => noteToRemove !== this.midiTable[note]);
    // this.activeFrequencies[beat] = this.activeFrequencies[beat].filter(noteToRemove => noteToRemove !== this.frequencyTable[note]);
    this.advancedRemoveNote(beat, note);
  }

  advancedRemoveNote(beat, note) {
    console.log("This is an optional abstract callback");
  }

  playTick(tick) {
    console.log("This is a mandatory abstract callback");
  }
}

export default Track
