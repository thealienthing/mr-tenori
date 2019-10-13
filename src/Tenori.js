import React, { Component } from 'react';
import Grid from './Grid.js';
import {SliderComponent, ButtonComponent, DropDownComponent} from './InputComponent';
import Tone from 'tone';

class SynthTrack {
  constructor(args) {
    this.rootNote = 69;
    this.scaleName = "pentatonicMajor";
    this.volume = -6;

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



    //Here is the current limited midi scale. This needs to be expanded for other scales
    this.scaleOptions = {
      pentatonicMajor: [0, 2, 4, 7, 9, 12, 14, 16, 19, 21, 24, 26, 28, 31, 33, 36],
      pentatonicMinor: [0, 3, 5, 7, 10,12, 15, 17, 19, 22, 24, 27, 29, 31, 34, 36],
      //diatonicMajor:   [0, 2, 4, 7, 9, 12, 14, 16, 19, 21, 24, 26, 28, 31, 33, 36],
      //naturalMinor:    [0, 2, 4, 7, 9, 12, 14, 16, 19, 21, 24, 26, 28, 31, 33, 36],
    }

    this.rootNoteOptions = {
      "A4": 69, "C4": 72, "D4": 74, "G4": 79,
    }

    //Here is where the active notes live that the synth is playing
    this.activeFrequencies = []; //Tone.js likes to work with frequencies, not midi numbers; For playback purposes
    this.activeMidiNotes = [];   //We want to eventually export the midi, so we will hold on to the notes
    this.activeNoteSquares = []; //We need to know which note boxes are selected so we can quickly change them when we need to
    this.midiTable = [];         //
    this.frequencyTable = [];    //

    for(let i = 0; i < 16; i++){
      this.activeFrequencies.push([]);
      this.activeMidiNotes.push([]);
      this.activeNoteSquares.push([]);
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
    this.frequencyTable = this.midiTable.map(number => Tone.Midi(number).toFrequency());

    let self = this;
    this.activeNoteSquares.forEach(function(activeNotes, beatIndex) {
      self.activeMidiNotes[beatIndex] = activeNotes.map((note) => self.midiTable[note]);
      self.activeFrequencies[beatIndex] = activeNotes.map((note) => self.frequencyTable[note]);
    });
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

  addNote(beat, note) {
    this.activeNoteSquares[beat].push(note);
    this.activeFrequencies[beat].push(this.frequencyTable[note]);
    this.activeMidiNotes[beat].push(this.midiTable[note]);
  }

  removeNote(beat, note) {
    this.activeNoteSquares[beat] = this.activeNoteSquares[beat].filter(noteToRemove => noteToRemove !== note);
    this.activeFrequencies[beat] = this.activeFrequencies[beat].filter(noteToRemove => noteToRemove !== this.frequencyTable[note]);
    this.activeMidiNotes[beat] = this.activeMidiNotes[beat].filter(noteToRemove => noteToRemove !== this.midiTable[note]);
  }

  playTick(tick) {
    this.synth.triggerAttackRelease(this.activeFrequencies[tick], "16n");
    console.log(this.activeFrequencies[tick]);
    //Consider this! Check to see if track is muted or not; if it is, just return
  }

  setup() {
    this.synth.chain(this.filter, this.phaser, this.chorus, this.pingPong, Tone.Master);
  }
}

class Tenori extends Component {
  constructor(props) {
    super(props)
    this.track = new SynthTrack();
    this.setup();

    this.globalSettings = {
      bpm: 120,
      numberOfTicks: 16,
    }

    this.updateGlobalSettings = this.updateGlobalSettings.bind(this);
  }

  setup() {
    let numberOfBeats = 16;
    for(let i = 0; i < numberOfBeats; i++) {
      Tone.Transport.schedule((time) => { this.track.playTick(i); }, this.ticksToMeasures(i));
    }

    Tone.Transport.loop = true;
    Tone.Transport.loopStart = this.ticksToMeasures(0);
    Tone.Transport.loopEnd = this.ticksToMeasures(16);
    this.track.setup();
  }

  updateGlobalSettings(element) {
    if(element.id === 'bpm'){
      this.globalSettings.bpm = element.value;
      Tone.Transport.bpm.value = this.globalSettings.bpm;
    }
  }

  ticksToMeasures(ticks) {
    let beats = Math.floor(ticks / 4) % 4;
    let measures = Math.floor(ticks / 16);
    let sixteenths = ticks % 4;
    return measures + ":" + beats + ":" + sixteenths;
  }

  render() {
    return (
      <div id="tenori">
        <header>
          <a href="https://github.com/thealienthing/tenori-on">
            <img src="GitHub-Mark-Light-64px.png" alt="GitHub-Mark-Light-64px.png"/>
          </a>
        </header>

        <section className="appBody">
          <h1 className="incrediblyPotentHeaderText">MR. TENORI</h1>
          <Grid
            numberOfColumns={16}
            numberOfRows={16}
            handleAddNote={this.track.addNote}
            handleRemoveNote={this.track.removeNote}
          />

          <div className="controlsContainer">
            <div className="controlsRow">
              <div>
                <ButtonComponent className="turboButton btnBlue" passedFunction={() => {Tone.Transport.start("+0.1", "0:0:0")}} id="start" label="Start" icon="play"/>
                <ButtonComponent className="turboButton btnOrange" passedFunction={() => {Tone.Transport.stop()}} id="stop" label="Stop" icon="stop"/>
              </div>
              <SliderComponent passedFunction={this.track.updateSynth} value={this.track.volume} step="1" min="-48" max="0" label="Volume" id="volume"/>
            </div>

            <div className="controlsRow">
              <div>
                <DropDownComponent passedFunction={this.track.setScale} options={{"Pentatonic Major": "pentatonicMajor", "Pentatonic Minor": "pentatonicMinor"}} />
                <DropDownComponent passedFunction={this.track.setRootNote} options={this.track.rootNoteOptions} />
              </div>
              <SliderComponent passedFunction={this.updateGlobalSettings} value={this.globalSettings.bpm} step="1" min="30" max="300" label="BPM" id="bpm"/>
            </div>

            <div className="controlsRow">
              <SliderComponent passedFunction={this.track.updateSynth} value={this.track.synthSettings.delayTime} step="0.01" min="0" max="10"    label="Delay"  id="delay" />
              <SliderComponent passedFunction={this.track.updateSynth} value={this.track.synthSettings.chorusDepth} step="0.01" min="0" max="1.0"   label="Chorus" id="chorus"/>
            </div>

            <div className="controlsRow">
              <SliderComponent passedFunction={this.track.updateSynth} value={this.track.synthSettings.phaserFreqency} step="0.01" min="0" max="30"     label="Phaser" id="phaser"/>
              <SliderComponent passedFunction={this.track.updateSynth} value={this.track.synthSettings.filterCutoff} step="0.01" min="0" max="10000" label="Filter" id="filter"/>
            </div>

          </div>
        </section>
      </div>
    );
  }
}

export default Tenori
