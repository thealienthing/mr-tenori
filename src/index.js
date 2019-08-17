import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';


class NoteBox extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: null,
    };
  }

  render() {
    return (
      <div
        className="square"
        onClick={() => this.setState({value: "X"})}>
        {this.state.value}
      </div>
    );
  }
}

class GridColumn extends React.Component {
  renderNoteBox() {
    return <NoteBox Value="X"/>
  }

  render() {
    return (
      <div className="GridColumn">
        <tr>
          <div class="trDiv">
          <td>{this.renderNoteBox()}</td>
          <td>{this.renderNoteBox()}</td>
          <td>{this.renderNoteBox()}</td>
          <td>{this.renderNoteBox()}</td>
          <td>{this.renderNoteBox()}</td>
          <td>{this.renderNoteBox()}</td>
          <td>{this.renderNoteBox()}</td>
          <td>{this.renderNoteBox()}</td>
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
