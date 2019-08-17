import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

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
        onClick={this.handleClick.bind(this)}>
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
    return <NoteBox index={number}/>
  }

  render() {
    let noteBoxArray = [];
    for(var i = 16; i > 0; i--) {
      noteBoxArray.push(<td>{this.renderNoteBox(i)}</td>);
    }
    return (
      <div className="GridColumn">
        <tr>
          <div class="trDiv">
            {noteBoxArray}
          </div>
        </tr>
      </div>
    );
  }
}

class Grid extends React.Component {

  render() {
    let gridColumnArray = [];
    for(var i = 16; i > 0; i--) {
      gridColumnArray.push(<GridColumn />);
    }
    return (
      <div className="Grid">
        <table>
          {gridColumnArray}
        </table>
      </div>
    );
  }
}

ReactDOM.render(
  <Grid />,
  document.getElementById('test')
);
