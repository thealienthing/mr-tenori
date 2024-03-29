import React, { Component } from 'react';


class SliderComponent extends Component {
  constructor(props) {
    super(props);
    this.updateParent = this.updateParent.bind(this);
    this.state = {
      value: this.props.value,
    }
  }

  updateParent(e) {
    this.setState({
      value: e.target.value,
    })
    this.props.passedFunction(e.target);
  }

  render() {
    return (
      <div className="sliderContainer">
        <label htmlFor={this.props.id}> {this.props.label} </label>
        <input id={this.props.id}
          type="range"
          name={this.props.id}
          onChange={this.updateParent}
          min={this.props.min}
          max={this.props.max}
          step={this.props.step}
          value={this.state.value}
        ></input>
      </div>
    );
  }
}

class ButtonComponent extends Component {
  constructor(props) {
    super(props);
    this.updateParent = this.updateParent.bind(this);
  }

  updateParent(e) {
    this.props.passedFunction(e.target);
  }

  render() {
    let icon = "";
    let labelText = this.props.label;
    if(this.props.icon) {
      let classText = "fas fa-" + this.props.icon;
      icon = <i className={classText}></i>
      // \xa0 is a nonbreaking space
      labelText = "\xa0" + labelText;
    }

    return (
      <button
        className={this.props.className}
        id={this.props.id}
        name={this.props.id}
        onClick={this.updateParent}
      >
        {icon}{labelText}
      </button>
    );
  }
}

class DropDownComponent extends Component {
  constructor(props) {
    super(props);
    this.updateParent = this.updateParent.bind(this);
  }

  updateParent(e) {
    this.props.passedFunction(e.target.value);
  }

  render() {
    console.log(this.props.options);
    let options = [];
    // for(let i = 0; i<this.props.options.length; i++) {
    //   options.push(<option key={i} value={this.props.options[i]}>{this.props.options[i]}</option>);
    // }
    for(let opt in this.props.options) {
      options.push(<option key={this.props.options[opt]} value={this.props.options[opt]}>{opt}</option>);
    }
    return (
      <select
        className={this.props.className}
        id={this.props.id}
        name={this.props.id}
        onChange={this.updateParent}
      >
        {options}
      </select>
    )
  }
}

export {
  SliderComponent,
  ButtonComponent,
  DropDownComponent
}
