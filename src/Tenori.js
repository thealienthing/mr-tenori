import React, { Component } from 'react';
import Grid from './Grid.js';
import Tone from 'tone';

class SynthTrack {
  constructor(args) {
    this.synth = new Tone.Synth().toMaster()

    this.activeFrequencies = [];
    this.activeMidiNotes = [];
    for(let i = 0; i < 16; i++){
      this.activeFrequencies.push([]);
      this.activeMidiNotes.push([]);
    }

    this.midiScale = [];
    for(let i = 69; i < 85; i++){
      this.midiScale.push(i);
    }

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

  playBoop() {
    this.synth.triggerAttackRelease('C4', '8n');
  }
}

class Tenori extends Component {
  constructor(props) {
    super(props)
    this.useSynth = this.useSynth.bind(this);
    this.track = new SynthTrack();
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
        <Grid
          id='grid'
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
