import React, { Component } from 'react';
import Tone from 'tone';

let synth = new Tone.Synth().toMaster();

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
    synth.triggerAttack('C5');
  }

  stopBoop() {
    synth.triggerRelease();
  }

}

export default Button;
