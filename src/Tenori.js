import React, { Component } from 'react';
import Grid from './Grid.js';
import SynthUI from './SynthUI';
import Tone from 'tone';

class SynthTrack {
  constructor(args) {
    this.env = new Tone.AmplitudeEnvelope({
    	"attack" : .70,
    	"decay" : 0.8,
    	"sustain" : 1,
    	"release" : 2.0,
    });


    //Initialize the track fx here. Not safe to connect until track is initialized
    this.pingPong = new Tone.PingPongDelay("4n", 0.2);
    this.chorus = new Tone.Chorus(4, 2.5, 0.5);
    this.phaser = new Tone.Phaser(0.5, 3, 1000);
    this.filter = new Tone.Filter(200, 'lowpass');
    this.synth = new Tone.PolySynth(16, Tone.Synth);

    //Here is where the active notes live that the synth is playing
    this.activeFrequencies = [];
    this.activeMidiNotes = [];
    for(let i = 0; i < 16; i++){
      this.activeFrequencies.push([]);
      this.activeMidiNotes.push([]);
    }

    //Here is the current limited midi scale. This needs to be expanded for other scales
    this.midiScale = [69, 71, 73, 76, 78, 81, 83, 85, 88, 90, 93, 95, 97, 100, 102, 104];
    this.freqScale = this.midiScale.map(number => Tone.Midi(number).toFrequency());

    //Bind functions here:
    this.addNote = this.addNote.bind(this);
    this.removeNote = this.removeNote.bind(this);
    this.detune = this.detune.bind(this); //Needs to be adjusted
    this.updateSynth = this.updateSynth.bind(this); //For updating settings to fx
    this.config = this.config.bind(this); //Fix
  }

  config() {
    //Nothing here yet. Probably remove if not used in future
  }

  updateSynth(e) {
    if(e.id === "delay") {
      this.pingPong.delayTime.value = e.value;
    }
    else if(e.id === "chorus") {
      this.chorus.depth = e.value;
    }
    else if(e.id === "phaser") {
      this.phaser.frequency.value = e.value;
    }
    else if(e.id === "filter") {
      this.filter.Q.value = 20; //Fix later - Q set high for easy hearing of filter sweep
      this.filter.frequency.value = e.value;
    }
  }

  addNote(beat, note) {
    this.activeFrequencies[beat].push(this.freqScale[note]);
    this.activeMidiNotes[beat].push(this.midiScale[note]);
  }

  removeNote(beat, note) {
    this.activeFrequencies[beat] = this.activeFrequencies[beat].filter(noteToRemove => noteToRemove !== this.freqScale[note]);
    this.activeMidiNotes[beat] = this.activeMidiNotes[beat].filter(noteToRemove => noteToRemove !== this.midiScale[note]);
  }

  playTick(tick) {
    this.synth.triggerAttackRelease(this.activeFrequencies[tick], "16n");
    this.env.triggerAttack("8n");

  }

  detune() { //definitely change this so that you can detune multiple times by half steps
    this.synth.set("detune", -500);
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
    console.log(this.track.pingPong);
    this.track.synth.chain(this.track.filter, this.track.phaser, this.track.chorus, this.track.pingPong, Tone.Master);
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
        <button onClick={this.kickItOff}>Start</button>
        <button onClick={() => this.track.detune()}>Detune</button>
        <Grid
          numberOfColumns={16}
          numberOfRows={16}
          handleAddNote={this.track.addNote}
          handleRemoveNote={this.track.removeNote}
        />
        <SynthUI passedFunction={this.track.updateSynth} min="0" max="10" label="Delay" id="delay"/>
        <SynthUI passedFunction={this.track.updateSynth} min="0" max="1.5" label="Chorus" id="chorus"/>
        <SynthUI passedFunction={this.track.updateSynth} min="0" max="5" label="Phaser" id="phaser"/>
        <SynthUI passedFunction={this.track.updateSynth} min="0" max="10000" label="Filter" id="filter"/>
      </div>
    );
  }
}

export default Tenori
