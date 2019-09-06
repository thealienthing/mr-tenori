import React, { Component } from 'react';


class SliderComponent extends Component {
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
        name={this.props.id}
        onChange={this.updateParent}
        min={this.props.min}
        max={this.props.max}
        step={this.props.step}
        ></input>
        <label htmlFor={this.props.id}> {this.props.label} </label>
      </div>
    );
  }
}

class ButtonComponent extends Component {

  // updateParent(e) {
  //   this.props.passedFunction(e.target);
  // }

  render() {
    return (
      <div>
        <button
        id={this.props.id}
        name={this.props.id}
        onClick={this.props.passedFunction}
        >
        {this.props.label}
        </button>
      </div>
    );
  }
}

export {
  SliderComponent,
  ButtonComponent,
}
