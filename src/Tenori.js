import React, { Component } from 'react';
import Grid from './Grid.js';
import {SliderComponent, ButtonComponent, DropDownComponent} from './InputComponent';
import Tone from 'tone';
import ToneJSTrack from './ToneJSTrack.js';

class Tenori extends Component {
  constructor(props) {
    super(props)
    this.track = new ToneJSTrack({numTicks: 16,});
    this.tracksList = [];
    this.tracksList.push(new ToneJSTrack({numTicks: 16,}));
    // this.tracksList.push(new ToneJSTrack);
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
          <h1 className="incrediblyPotentHeaderText">Gay. TENORI</h1>
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
