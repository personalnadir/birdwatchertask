import React from 'react';
import { connect } from 'react-redux';
import {
	registerInput,
	showFeedback,
	goToNextTrial,
	showITI,
} from '../redux/trialactions';
import {storeTrialData} from '../redux/dataactions';
import {storeData} from '../database/db';
import {startTimeout} from '../redux/timeactions';
import {
	getTrialColour,
	getLastInputWasCorrect,
	getTrialData,
	getUserID
} from '../redux/selectors';
import KeyListener from '../Components/KeyListener';
import blueBird from '../images/task/bird-blue.png';
import greenBird from '../images/task/bird-green.png';
import redBird from '../images/task/bird-red.png';
import yellowBird from '../images/task/bird-yellow.png';
import {
	COLOUR_RED,
	COLOUR_BLUE,
	COLOUR_GREEN,
	COLOUR_YELLOW,
	KEYS
} from '../constants';
import keyEncode from '../keyencode';
import _ from 'underscore';

const colToImg = {
	[COLOUR_RED]: (<img alt="Red Bird" src={redBird} />),
	[COLOUR_BLUE]: (<img alt="Blue Bird" src={blueBird} />),
	[COLOUR_GREEN]: (<img alt="Green Bird" src={greenBird} />),
	[COLOUR_YELLOW]: (<img alt="Yellow Bird" src={yellowBird} />)
};

const validKeys = _.invert(KEYS);

class StimuliPage extends React.Component {
	constructor (props) {
		super(props);
		this.state = {
			showButton: true
		};

		this.handleKeyPress = this.handleKeyPress.bind(this);
	}

	componentDidMount() {
	 	this.trialStart = Date.now();
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
		if (_.has(validKeys, keyCode)) {
			this.props.registerKeyPress(this.props.user, keyCode, this.trialStart, this.props.data);
		}
	}

	render() {
		const img = colToImg[this.props.trialColour];
		const feedback = this.props.feedback? <p>{this.props.wasCorrect? "Correct": "Wrong"}</p> : null;
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
	trialColour: getTrialColour(state),
	data: getTrialData(state),
	wasCorrect: getLastInputWasCorrect(state),
	user: getUserID(state)
});

const mapDispatchToProps = (dispatch, ownProps) => {
	return {
	    startTimeout: () => dispatch(startTimeout(dispatch => {
	    	dispatch(showITI());
			dispatch(goToNextTrial());
		},1000)),
		registerKeyPress: (user, keyCode, startTime, data) => {
			if (ownProps.feedback) {
				return;
			} else {
				const keyAction = keyEncode(keyCode);
				const reactionTime = Date.now() - startTime;
				const dataAction = storeTrialData(keyAction, startTime, reactionTime, data);
				dispatch(dataAction);
				storeData(user, dataAction);
				dispatch(registerInput(keyAction));
				dispatch(showFeedback());
			}
		}
	};
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(StimuliPage);;