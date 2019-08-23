import React, { Component } from 'react';
import Tone from 'tone';

var noteArray = [
  [69],
  [],
  [73],
  [],
  [69],
  [],
  [76],
  [],
  [69, 73],
  [71, 74],
  [73, 76],
  [74, 77],
  [76, 79],
  [77, 80],
  [79, 96],
  [81, 69, 73, 92, 55]
];

var synth = new Tone.PolySynth(8, Tone.Synth).toMaster();
synth.set("detune", -1200);


var seq = new Tone.Sequence(function(time, index){
	// console.log(noteArray[index]);
  synth.triggerAttackRelease(noteArray[index].map(note => Tone.Midi(note).toFrequency()), "8n");
//subdivisions are given as subarrays
}, [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15]).start(0);

class Button extends Component {
  render() {
    return(
      <button
	onMouseDown={this.makeBoop}
	onMouseUp={this.stopBoop}
      >Test (hold down to test harder)</button>
    );
  }
  createTone(){
    //create a synth and connect it to the master output (your speakers)
    var synth = new Tone.Synth().toMaster();

    //play a middle 'C' for the duration of an 8th note
    synth.triggerAttackRelease('C4', '8n');
  }

  makeBoop() {
    // Tone.Transport.stop();
    // Tone.Transport.start("+0.0", "0:0:0");
    Tone.Transport.start();
  }

  stopBoop() {
    Tone.Transport.stop();
  }

}

export default Button;
