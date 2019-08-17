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
    return (
      <div className="GridColumn">
        <tr>
          <div class="trDiv">
          <td>{this.renderNoteBox(8)}</td>
          <td>{this.renderNoteBox(7)}</td>
          <td>{this.renderNoteBox(6)}</td>
          <td>{this.renderNoteBox(5)}</td>
          <td>{this.renderNoteBox(4)}</td>
          <td>{this.renderNoteBox(3)}</td>
          <td>{this.renderNoteBox(2)}</td>
          <td>{this.renderNoteBox(1)}</td>
          </div>
        </tr>
      </div>
    );
  }
}

class Grid extends React.Component {

  render() {
    return (
      <div className="Grid">
        <table>
          <GridColumn />
          <GridColumn />
          <GridColumn />
          <GridColumn />
          <GridColumn />
          <GridColumn />
          <GridColumn />
          <GridColumn />
        </table>
      </div>
    );
  }
}

ReactDOM.render(
  <Grid />,
  document.getElementById('test')
);
