import React, { Component } from 'react';
import Grid from './Grid.js';
import Tone from 'tone';

class SynthTrack {
  constructor(args) {
    var pingPong = new Tone.PingPongDelay("4n", 0.2).toMaster();
    this.synth = new Tone.PolySynth(16, Tone.Synth).connect(pingPong);

    this.activeFrequencies = [];
    this.activeMidiNotes = [];
    for(let i = 0; i < 16; i++){
      this.activeFrequencies.push([]);
      this.activeMidiNotes.push([]);
    }

    this.midiScale = [69, 71, 73, 76, 78, 81, 83, 85, 88, 90, 93, 95, 97, 100, 102, 104];
    // for(let i = 69; i < 85; i++){
    //   this.midiScale.push(i);
    // }

    this.freqScale = this.midiScale.map(number => Tone.Midi(number).toFrequency());

    this.addNote = this.addNote.bind(this);
    this.removeNote = this.removeNote.bind(this);
  }

  addNote(beat, note) {
    this.activeFrequencies[beat].push(this.freqScale[note]);
    this.activeMidiNotes[beat].push(this.midiScale[note]);
    //console.log(this.activeFrequencies);
  }

  removeNote(beat, note) {
    this.activeFrequencies[beat] = this.activeFrequencies[beat].filter(noteToRemove => noteToRemove !== this.freqScale[note]);
    this.activeMidiNotes[beat] = this.activeMidiNotes[beat].filter(noteToRemove => noteToRemove !== this.midiScale[note]);
    //console.log(this.activeFrequencies);
  }

  playTick(tick) {
    this.synth.triggerAttackRelease(this.activeFrequencies[tick], "16n");
  }

  playBoop() {
    this.synth.triggerAttackRelease('C4', '8n');
  }
}

class Tenori extends Component {
  constructor(props) {
    super(props)
    this.useSynth = this.useSynth.bind(this);
    this.track = new SynthTrack();

    this.setupTransport();
  }

  setupTransport() {
    let numberOfBeats = 16;
    for(let i = 0; i < numberOfBeats; i++) {
      Tone.Transport.schedule((time) => { this.track.playTick(i); }, this.ticksToMeasures(i));
    }

    Tone.Transport.loop = true;
    Tone.Transport.loopStart = this.ticksToMeasures(0);
    Tone.Transport.loopEnd = this.ticksToMeasures(16);
  }

  kickItOff() {
    Tone.Transport.stop();
    Tone.Transport.start("+0.1", "0:0:0");
  }

  ticksToMeasures(ticks) {
    let beats = Math.floor(ticks / 4) % 4;
    let measures = Math.floor(ticks / 16);
    let sixteenths = ticks % 4;
    return measures + ":" + beats + ":" + sixteenths;
  }

  useSynth(){
    console.log(this.track.activeFrequencies);
    this.track.addNote(3, 4);
    console.log(this.track.activeFrequencies);
  }

  render() {
    return (
      <div id="tenori">
        <button onClick={() => this.track.addNote(6,0) }>Add</button>
        <button onClick={() => this.track.removeNote(6,0) }>Remove</button>
        <button onClick={() => console.log(this.track.activeFrequencies[6])}>Show Notes</button>
        <button onClick={this.kickItOff}>GOGGOGOOGOOOGOGOOGOGOG</button>
        <Grid
          numberOfBeats={16}
          numberOfNotes={16}
          handleAddNote={this.track.addNote}
          handleRemoveNote={this.track.removeNote}
        />
      </div>
    );
  }
}

export default Tenori
