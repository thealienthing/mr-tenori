import React, { Component } from 'react';
import Grid from './Grid.js';
import {SliderComponent, ButtonComponent} from './InputComponent';
import Tone from 'tone';

class SynthTrack {
  constructor(args) {
    this.env = new Tone.AmplitudeEnvelope({
    	"attack" : .70,
    	"decay" : 0.8,
    	"sustain" : 1,
    	"release" : 2.0,
    });
    this.transpose = 0;
    this.volume = -6;

    //Initialize the track fx here. Not safe to connect until track is initialized
    this.pingPong = new Tone.PingPongDelay("4n", 0.2);
    this.chorus = new Tone.Chorus(4, 2.5, 0.5);
    this.phaser = new Tone.Phaser(0.5, 3, 1000);
    this.filter = new Tone.Filter(200, 'lowpass');
    this.synth = new Tone.PolySynth(16, Tone.Synth);
    this.synth.volume.value = this.volume;

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
    this.setup = this.setup.bind(this);
  }



  updateSynth(element) {
    if(element.id === "delay") {
      this.pingPong.delayTime.value = element.value;
    }
    else if(element.id === "chorus") {
      this.chorus.depth = element.value;
    }
    else if(element.id === "phaser") {
      this.phaser.frequency.value = element.value;
    }
    else if(element.id === "filter") {
      this.filter.Q.value = 3; //Fix later - Q set high for easy hearing of filter sweep
      this.filter.frequency.value = element.value;
    }
    else if(element.id === "detuneDown") {
      this.transpose -= 1;
      this.synth.set("detune", (this.transpose * 100));
    }
    else if(element.id === "detuneUp") {
      this.transpose += 1;
      this.synth.set("detune", (this.transpose * 100));
    }
    else if(element.id === "volume") {
      this.volume = element.value;
      this.synth.volume.value = this.volume;
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
    //Consider this! Check to see if track is muted or not; if it is, just return
  }

  detune() { //definitely change this so that you can detune multiple times by half steps
    this.synth.set("detune", -500);
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
            <img src="GitHub-Mark-Light-64px.png" />
          </a>
        </header>
        <section className="appBody">
          <h1 className="maximumHeader">M R .&nbsp;&nbsp;&nbsp;T E N O R I</h1>
          <Grid
            numberOfColumns={16}
            numberOfRows={16}
            handleAddNote={this.track.addNote}
            handleRemoveNote={this.track.removeNote}
          />
          <div className="temporaryStuffHolder">
            <div className="synthUiControls">
              <SliderComponent passedFunction={this.track.updateSynth} step="0.01" min="0" max="10"    label="Delay"  id="delay" />
              <SliderComponent passedFunction={this.track.updateSynth} step="0.01" min="0" max="1.5"   label="Chorus" id="chorus"/>
              <SliderComponent passedFunction={this.track.updateSynth} step="0.01" min="0" max="5"     label="Phaser" id="phaser"/>
              <SliderComponent passedFunction={this.track.updateSynth} step="0.01" min="0" max="10000" label="Filter" id="filter"/>
	      <SliderComponent passedFunction={this.track.updateSynth} step="1" min="-48" max="0"      label="Volume" id="volume"/>
	      <ButtonComponent passedFunction={this.track.updateSynth} id="detuneUp" label="Detune Up"/>
	      <ButtonComponent passedFunction={this.track.updateSynth} id="detuneDown" label="Detune Down"/>
	                  </div>
            <div className="globalControls">
              <SliderComponent passedFunction={this.updateGlobalSettings} step="1" min="30" max="300" label="BPM" id="bpm"/>
              <ButtonComponent className="powerbutton btnGreen" passedFunction={() => {Tone.Transport.start("+0.1", "0:0:0")}} id="start" label="Start"/>
              <ButtonComponent className="powerbutton btnRed" passedFunction={() => {Tone.Transport.stop()}} id="stop" label="Stop"/>
            </div>
          </div>
        </section>
      </div>
    );
  }
}

export default Tenori
