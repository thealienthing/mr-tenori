import React, { Component } from 'react';


class SynthUI extends Component {
  constructor(props) {
    super(props);
    this.updateParent = this.updateParent.bind(this);
  }

  updateParent(e) {
    this.props.passedFunction(e.target.value);
  }


  render() {
    return (
      <div>
        <input id="test"
        type="range"
        onChange={this.updateParent}
        min="0.0"
        max="1.0"
        step="0.01"
        >
        </input>
        <label for="test">
          Test Slider
        </label>
      </div>
    );
  }
}


export default SynthUI
