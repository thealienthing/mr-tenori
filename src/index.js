import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Button from './Button';


class NoteBox extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: this.props.value,
      index: this.props.index,
    };
  }

  render() {
    return (
      <div
        className="square"
        onClick={this.handleClick.bind(this)}
      >
        {this.state.value}
      </div>
    );
  }

  handleClick(){
    return this.setState({
      value: this.props.index,
    })
  }
}

class GridColumn extends React.Component {
  renderNoteBox(number) {
    return <NoteBox key={number} index={number}/>
  }

  render() {
    let noteBoxArray = [];
    for(var i = 16; i > 0; i--) {
      noteBoxArray.push(<td key={i}>{this.renderNoteBox(i)}</td>);
    }
    return (
        <tr className="GridColumn">
            {noteBoxArray}
        </tr>
    );
  }
}

class Grid extends React.Component {

  render() {
    let gridColumnArray = [];
    for(var i = 16; i > 0; i--) {
      gridColumnArray.push(<GridColumn key={i}/>);
    }
    return (
      <div className="Grid">
        <Button />
        <table>
          <tbody>
            {gridColumnArray}
          </tbody>
        </table>
      </div>
    );
  }
}

ReactDOM.render(
  <Grid id='grid'/>,
  document.getElementById('test')
);
