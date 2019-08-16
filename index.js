var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

var NoteBox = function (_React$Component) {
  _inherits(NoteBox, _React$Component);

  function NoteBox(props) {
    _classCallCheck(this, NoteBox);

    var _this = _possibleConstructorReturn(this, (NoteBox.__proto__ || Object.getPrototypeOf(NoteBox)).call(this, props));

    _this.state = {
      value: null
    };
    return _this;
  }

  _createClass(NoteBox, [{
    key: 'render',
    value: function render() {
      var _this2 = this;

      return React.createElement(
        'div',
        {
          className: 'square',
          onClick: function onClick() {
            return _this2.setState({ value: "X" });
          } },
        this.state.value
      );
    }
  }]);

  return NoteBox;
}(React.Component);

var GridRow = function (_React$Component2) {
  _inherits(GridRow, _React$Component2);

  function GridRow() {
    _classCallCheck(this, GridRow);

    return _possibleConstructorReturn(this, (GridRow.__proto__ || Object.getPrototypeOf(GridRow)).apply(this, arguments));
  }

  _createClass(GridRow, [{
    key: 'renderNoteBox',
    value: function renderNoteBox() {
      return React.createElement(NoteBox, { Value: 'X' });
    }
  }, {
    key: 'render',
    value: function render() {
      return React.createElement(
        'div',
        { className: 'GridRow' },
        React.createElement(
          'tr',
          null,
          React.createElement(
            'div',
            { 'class': 'trDiv' },
            React.createElement(
              'td',
              null,
              this.renderNoteBox()
            ),
            React.createElement(
              'td',
              null,
              this.renderNoteBox()
            ),
            React.createElement(
              'td',
              null,
              this.renderNoteBox()
            ),
            React.createElement(
              'td',
              null,
              this.renderNoteBox()
            ),
            React.createElement(
              'td',
              null,
              this.renderNoteBox()
            ),
            React.createElement(
              'td',
              null,
              this.renderNoteBox()
            ),
            React.createElement(
              'td',
              null,
              this.renderNoteBox()
            ),
            React.createElement(
              'td',
              null,
              this.renderNoteBox()
            )
          )
        )
      );
    }
  }]);

  return GridRow;
}(React.Component);

var Grid = function (_React$Component3) {
  _inherits(Grid, _React$Component3);

  function Grid() {
    _classCallCheck(this, Grid);

    return _possibleConstructorReturn(this, (Grid.__proto__ || Object.getPrototypeOf(Grid)).apply(this, arguments));
  }

  _createClass(Grid, [{
    key: 'render',
    value: function render() {
      return React.createElement(
        'div',
        { className: 'Grid' },
        React.createElement(
          'table',
          null,
          React.createElement(GridRow, null),
          React.createElement(GridRow, null),
          React.createElement(GridRow, null),
          React.createElement(GridRow, null),
          React.createElement(GridRow, null),
          React.createElement(GridRow, null),
          React.createElement(GridRow, null),
          React.createElement(GridRow, null)
        )
      );
    }
  }]);

  return Grid;
}(React.Component);

ReactDOM.render(React.createElement(Grid, null), document.getElementById('test'));