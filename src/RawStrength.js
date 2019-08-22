import React, { Component } from 'react';
import Tone from 'tone';

let synth = new Tone.Synth({oscillator: {type:"sine"}}).toMaster();

Tone.Transport.bpm.value = 140;

Tone.Transport.schedule(function(time){
	synth.triggerAttackRelease('C#6', '2n');
}, "0:0:0");
Tone.Transport.schedule(function(time){
	synth.triggerAttackRelease('A5', '2n');
}, "0:2:0");
Tone.Transport.schedule(function(time){
	synth.triggerAttackRelease('E5', '4n.'); 
}, "1:0:0");
Tone.Transport.schedule(function(time){
	synth.triggerAttackRelease('D5', '4n');
}, "1:1:2");
Tone.Transport.schedule(function(time){
	synth.triggerAttackRelease('C#5', '4n.');
}, "1:2:2");

Tone.Transport.schedule(function(time){
	synth.triggerAttackRelease('C#6', '2n');
}, "2:0:0");
Tone.Transport.schedule(function(time){
	synth.triggerAttackRelease('A5', '4n.');
}, "2:2:0");
Tone.Transport.schedule(function(time){
	synth.triggerAttackRelease('D5', '2n');
}, "2:3:2");

Tone.Transport.schedule(function(time){
	synth.triggerAttackRelease('B5', '8n');
}, "3:2:2");
Tone.Transport.schedule(function(time){
	synth.triggerAttackRelease('C#6', '8n');
}, "3:3:0");
Tone.Transport.schedule(function(time){
	synth.triggerAttackRelease('A5', '2n');
}, "3:3:2");

// Tone.Transport.schedule(function(time){
// 	synth.triggerAttackRelease('A5', '16n');
// }, "5:1:0");
Tone.Transport.schedule(function(time){
	synth.triggerAttackRelease('B5', '4n');
}, "5:1:0");
Tone.Transport.schedule(function(time){
	synth.triggerAttackRelease('B5', '8n');
}, "5:2:0");
Tone.Transport.schedule(function(time){
	synth.triggerAttackRelease('C#6', '4n');
}, "5:2:2");
Tone.Transport.schedule(function(time){
	synth.triggerAttackRelease('A5', '2n.');
}, "6:0:0");

class RawStrength extends Component {
  render() {
    return(
    	<div className="hey" onClick={this.toottoot}></div>
    );
  }

  toottoot() {
  	Tone.Transport.stop();
  	Tone.Transport.start("+0.1", "0:0:0");
  }
}

export default RawStrength;