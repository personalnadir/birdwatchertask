import React from 'react';
import { connect } from 'react-redux';
import {
	registerInput,
	showFeedback,
	goToNextTrial,
	showITI
} from '../redux/trialactions';
import {startTimeout} from '../redux/timeactions';
import {getTrialColour} from '../redux/selectors';
import KeyListener from '../Components/KeyListener';
import blueBird from '../images/task/bird-blue.png';
import greenBird from '../images/task/bird-green.png';
import redBird from '../images/task/bird-red.png';
import yellowBird from '../images/task/bird-yellow.png';
import {
	COLOUR_RED,
	COLOUR_BLUE,
	COLOUR_GREEN,
	COLOUR_YELLOW
} from '../constants';

const colToImg = {
	[COLOUR_RED]: (<img alt="Red Bird" src={redBird} />),
	[COLOUR_BLUE]: (<img alt="Blue Bird" src={blueBird} />),
	[COLOUR_GREEN]: (<img alt="Green Bird" src={greenBird} />),
	[COLOUR_YELLOW]: (<img alt="Yellow Bird" src={yellowBird} />)
};

class StimuliPage extends React.Component {
	constructor (props) {
		super(props);
		this.state = {
			showButton: true
		};

		this.handleKeyPress = this.handleKeyPress.bind(this);
	}

	componentDidMount() {
    	if (!this.props.feedback) {
    		return;
    	}
    	this.props.startTimeout();
  	}

  	componentDidUpdate(prevProps, prevState, snapshot) {
		if (!this.props.feedback || prevProps.feedback) {
    		return;
    	}
    	this.props.startTimeout();
  	}
	handleKeyPress(keyCode) {
		this.props.registerKeyPress(keyCode);
	}

	render() {
		const img = colToImg[this.props.trialColour];
		const feedback = this.props.feedback? <p>Feedback</p> : null;
		return (
			<div>
				<KeyListener onKeyEvent = {this.handleKeyPress} />
				{feedback}
				{img}
			</div>
		);
	}
}

const mapStateToProps = state => ({
	trialColour: getTrialColour(state)
});

const mapDispatchToProps = (dispatch, ownProps) => {
	return {
	    startTimeout: () => dispatch(startTimeout(dispatch => {
	    	dispatch(showITI());
			dispatch(goToNextTrial());
		},1000)),
		registerKeyPress: (keyCode) => {
			if (ownProps.feedback) {
				return;
			} else {
				dispatch(registerInput(keyCode));
				dispatch(showFeedback());
			}
		}
	};
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(StimuliPage);;