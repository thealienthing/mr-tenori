import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Button from './Button';
import RawStrength from './RawStrength.js';
import Grid from './Grid.js';

function AppContainer(props) {
	return (
		<React.Fragment>
			<Button />
			<RawStrength />
			<Grid id='grid' numberOfBeats={16} numberOfNotes={16} />
		</React.Fragment>
	);
}

ReactDOM.render(
  <AppContainer />,
  document.getElementById('test')
);
