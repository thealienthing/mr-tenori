import React from 'react'

/*
 * Grid
 *	This Component implements the UI for the clickable grid. This guy should be the
 * 	fella in charge of detecting user interaction.
 *
 *
 * Expected props:
 *	- numberOfColumns: Integer, number of columns
 *	- numberOfRows: Integer, number of rows (i.e. click)
 *	- handleAddNote: function(columnIndex, rowIndex), function to be called to add a
 *		note for the given column/row position.
 *	- handleRemoveNote: function(columnIndex, rowIndex), same deal, but to remove a note.
 *
 */
class Grid extends React.Component {
	constructor(props) {
		super(props);

		// this.handleClick = this.handleClick.bind(this);
		this.handleMouseDown = this.handleMouseDown.bind(this);
		this.handleMouseMove = this.handleMouseMove.bind(this);
		this.handleMouseUp = this.handleMouseUp.bind(this);
		this.handleMouseOut = this.handleMouseOut.bind(this);
		this.handleTouchStart = this.handleTouchStart.bind(this);
		this.handleTouchMove = this.handleTouchMove.bind(this);

		// Using this.state (as in React Component state) will trigger a rerender
		//  when the state changes. We need to track some state independently of that,
		//  since we don't want to constantly rerender the grid.
		//
		// So, stick your non-state state variables in here!
		this.freeAndIndpendentState = {
			// true if mouse is being held down, false otherwise
			clicking: false,
			// true if we're adding notes while clicking, false if removing
			adding: true
		}
	}


	//
	//	Mouse/touch event handlers
	//

	handleMouseDown(ev) {
		// User is clicking down! Set state.clicking.
		this.freeAndIndpendentState.clicking = true;

		// state.adding means we are adding notes (rather than removing).
		// Set state.adding to false if the user clicks on an active square
		// Set state.adding to true if the user cliks on an inactive square
		// If the user clicks on a non-square, data-active will be null, so state.adding will be set to true
		this.freeAndIndpendentState.adding = ev.target.getAttribute('data-active') !== "true";

		// The mouse move handler can take it from here
		this.handleMouseMove(ev);
	}

	handleMouseUp(ev) {
		// Reset state.clicking
		this.freeAndIndpendentState.clicking = false;
		ev.preventDefault();
	}

	handleMouseOut(ev) {
		// We only want to handle a mouseOut if the mouse leaves the grid entirely
		// Because this event will trigger each time the mouse leaves a square
		if(ev.target.id === 'grid') {
			// Reset state.clicking
			this.freeAndIndpendentState.clicking = false;
		}
	}

	handleMouseMove(ev) {
		// this.state.clicking indicates user is pressing down. If they're not, we don't give a shoot
		if(!this.freeAndIndpendentState.clicking) return;

		this.dealWithSquareEvent(ev.target);
	}

	handleTouchStart(ev) {
		ev.preventDefault();
		// Only support single touches for now
		if(ev.touches.length !== 1) return;
		// Set state.adding; assume we're just using the first touch.
		this.freeAndIndpendentState.adding = ev.targetTouches[0].target.getAttribute('data-active') !== "true";
		// Helper function can take it from here, thanks
		this.dealWithSquareEvent(ev.targetTouches[0].target);
	}

	handleTouchMove(ev) {
		ev.preventDefault();

		// Only support single touches for now
		if(ev.touches.length !== 1){
			return;
		}

		// Find the element the user is actually touching by using the X/Y value of the touch
		// Because the event target for touchMove events is always the element you touched first
		this.dealWithSquareEvent(
			document.elementFromPoint(
				ev.targetTouches[0].pageX, ev.targetTouches[0].pageY));
	}

	eventKiller(ev) {
		// console.log(ev.type);
		ev.preventDefault();
	}



	//
	//	Everything else
	//

	dealWithSquareEvent(domNode) {
		// Get note index; bail if null (because it means user is not clicking on a square)
		let note = domNode.getAttribute('data-noteindex');
		if(note === null) return;

		// Get column index and isActive
		let col = domNode.parentNode.getAttribute('data-columnindex');
		let active = domNode.getAttribute('data-active') === "true";

		// Adding state: Add square if it's not already active
		if(this.freeAndIndpendentState.adding && !active) {
			domNode.setAttribute('data-active', true);
			this.signalNoteOn(col, note);
		}
		// Not adding state: Remove square if it's active
		else if(!this.freeAndIndpendentState.adding && active) {
			domNode.setAttribute('data-active', false);
			this.signalNoteOff(col, note);
		}
	}

	signalNoteOn(beat, note) {
		this.props.handleAddNote(beat, note);
	}

	signalNoteOff(beat, note) {
		this.props.handleRemoveNote(beat, note);
	}

	generateColumnSquares() {
		let noteSquares = [];
		for(let i = this.props.numberOfRows-1; i >= 0; i--) {
			noteSquares.push(<NoteSquare key={i} idx={i} />);
		}
		return noteSquares;
	}

	render() {
		let columns = [];
		for(let i = 0; i < this.props.numberOfColumns; i++) {
			columns.push(
				<div key={i} className="gridColumn" data-columnindex={i}>
					{this.generateColumnSquares()}
				</div>
			);
		}

		return (
			<div>
				<div
					id="grid"
					onMouseDown={this.handleMouseDown}
					onMouseUp={this.handleMouseUp}
					onMouseOut={this.handleMouseOut}
					onMouseMove={this.handleMouseMove}
					onDragStart={this.eventKiller}
					onDrop={this.eventKiller}
					onTouchStart={this.handleTouchStart}
					onTouchMove={this.handleTouchMove}
					onTouchEnd={this.eventKiller}
					onTouchCancel={this.eventKiller}
				>
					{columns}
				</div>
			</div>
		);
	}
}


function NoteSquare(props) {
	return <div data-noteindex={props.idx} data-active={props.active}></div>
}

export default Grid;
