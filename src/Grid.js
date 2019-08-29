import React from 'react'

class Grid extends React.Component {
	constructor(props) {
		super(props);

		// this.handleClick = this.handleClick.bind(this);
		this.handleMouseDown = this.handleMouseDown.bind(this);
		this.handleMouseMove = this.handleMouseMove.bind(this);
		this.handleMouseUp = this.handleMouseUp.bind(this);
		this.handleMouseOut = this.handleMouseOut.bind(this);

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

	handleMouseDown(ev) {
		// User is clicking down! Set state.clicking.
		this.freeAndIndpendentState.clicking = true;

		// state.adding means we are adding notes (rather than removing).
		// Set state.adding to false if the user clicks on an active square
		// Set state.adding to true if the user cliks on an inactive square
		// If the user clicks on a non-square, data-active will be null, so state.adding will be set to true
		this.freeAndIndpendentState.adding = !ev.target.getAttribute('data-active');
		
		// The mouse move handler can take it from here
		this.handleMouseMove(ev);
	}

	handleMouseUp(ev) {
		// Reset state.clicking
		this.freeAndIndpendentState.clicking = false;
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

		// Get note index; bail if null (because it means user is not clicking on a square)
		let note = ev.target.getAttribute('data-noteindex');
		if(note === null) return;

		// Get column index and isActive
		let col = ev.target.parentNode.getAttribute('data-columnindex');
		let active = ev.target.getAttribute('data-active');
		// Returns as a string
		if(active === "false") active = false;

		// Adding state: Add square if it's not already active
		if(this.freeAndIndpendentState.adding && !active) {
			ev.target.setAttribute('data-active', true);
			this.signalNoteOn(col, note);
		}
		// Not adding state: Remove square if it's active
		else if(!this.freeAndIndpendentState.adding && active) {
			ev.target.setAttribute('data-active', false);
			this.signalNoteOff(col, note);
		}
	}

	signalNoteOn(beat, note) {
		console.log("Note ON: beat=" + beat + ", note=" + note);
	}

	signalNoteOff(beat, note) {
		console.log("Note OFF: beat=" + beat + ", note=" + note);
	}

	generateColumnSquares() {
		let noteSquares = [];
		for(let i = this.props.numberOfNotes-1; i >= 0; i--) {
			noteSquares.push(<NoteSquare key={i} idx={i} />);
		}
		return noteSquares;
	}

	render() {
		let columns = [];
		for(let i = 0; i < this.props.numberOfBeats; i++) {
			columns.push(
				<div key={i} className="gridColumn" data-columnindex={i}>
					{this.generateColumnSquares()}
				</div>
			);
		}

		console.log("GRID BE RUNDERING");

		return (
			<div 
				id="grid" 
				onMouseDown={this.handleMouseDown}
				onMouseUp={this.handleMouseUp}
				onMouseOut={this.handleMouseOut}
				onMouseMove={this.handleMouseMove}
			>
				{columns}
			</div>
		);
	}
}


// function GridColumn(props) {
// 	let noteSquares = [];
// 	for(let i = props.numberOfNotes-1; i >= 0; i--) {
// 		noteSquares.push(<NoteSquare key={i} idx={i} />);
// 	}

// 	return(
// 		<div className="gridColumn" data-columnindex={props.idx}>
// 			{noteSquares}
// 		</div>
// 	);
// }

function NoteSquare(props) {
	console.log("SQUR BE RRANDRING");
	return <div data-noteindex={props.idx} data-active={props.active}></div>
}

export default Grid;