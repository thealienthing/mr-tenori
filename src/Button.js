import React, { Component } from 'react';
import Tone from 'tone';

class Button extends Component {
  render() {
    return(
      <button onClick={this.createTone}>Test</button>
    );
  }
  createTone(){
    //create a synth and connect it to the master output (your speakers)
    var synth = new Tone.Synth().toMaster();

    //play a middle 'C' for the duration of an 8th note
    synth.triggerAttackRelease('C4', '8n');
  }

}

export default Button;
