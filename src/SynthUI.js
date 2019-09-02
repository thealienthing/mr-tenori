import React, { Component } from 'react';


class SynthUI extends Component {
  constructor(props) {
    super(props);
    this.updateParent = this.updateParent.bind(this);
  }

  updateParent(e) {
    this.props.passedFunction(e.target);
  }


  render() {
    return (
      <div>
        <input id={this.props.id}
        type="range"
        name="testLabel"
        onChange={this.updateParent}
        min={this.props.min}
        max={this.props.max}
        step={"0.01"}
        ></input>
        <label htmlFor={this.props.id}> {this.props.label} </label>
      </div>
    );
  }
}


export default SynthUI
