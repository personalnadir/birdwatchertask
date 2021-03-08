import React from 'react';
import { connect } from 'react-redux';
import {
	registerInput,
	showFeedback,
	goToNextTrial,
	showITI,
	endCurrentTrials
} from '../redux/trialactions';

import {
	goToNextTaskState,
	showTimeOut
} from '../redux/taskactions';
import {storeTrialData} from '../redux/dataactions';
import {storeData} from '../database/db';
import {startTimeout} from '../redux/timeactions';
import {
	getTrialColour,
	getLastInputWasCorrect,
	getTrialData,
	getUserID,
	getTrialPositon,
	getTaskMode,
	getTrialStimuliType
} from '../redux/selectors';
import KeyListener from '../Components/KeyListener';
import blueBird from '../images/task/bird-blue.png';
import greenBird from '../images/task/bird-green.png';
import redBird from '../images/task/bird-red.png';
import yellowBird from '../images/task/bird-yellow.png';
import blueSnake from '../images/task/snake-blue.png';
import greenSnake from '../images/task/snake-green.png';
import redSnake from '../images/task/snake-red.png';
import yellowSnake from '../images/task/snake-yellow.png';
import {
	COLOUR_RED,
	COLOUR_BLUE,
	COLOUR_GREEN,
	COLOUR_YELLOW,
	KEYS,
	TIMEOUT_MILLIS
} from '../constants';

import {
	MODE_STIMULI,
	STIMULI_BIRD,
	STIMULI_SNAKE,
	MODE_ITI
} from '../redux/taskconstants';

import keyEncode from '../keyencode';
import _ from 'underscore';

const colToImg = {
	[STIMULI_BIRD]: {
		[COLOUR_RED]: (<img alt="Red Bird" src={redBird} />),
		[COLOUR_BLUE]: (<img alt="Blue Bird" src={blueBird} />),
		[COLOUR_GREEN]: (<img alt="Green Bird" src={greenBird} />),
		[COLOUR_YELLOW]: (<img alt="Yellow Bird" src={yellowBird} />)
	},
	[STIMULI_SNAKE]: {
		[COLOUR_RED]: (<img alt="Red Snake" className="scaleup" src={redSnake} />),
		[COLOUR_BLUE]: (<img alt="Blue Snake" className="scaleup" src={blueSnake} />),
		[COLOUR_GREEN]: (<img alt="Green Snake" className="scaleup" src={greenSnake} />),
		[COLOUR_YELLOW]: (<img alt="Yellow Snake" className="scaleup" src={yellowSnake} />)
	}
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
    		this.props.startTimeOutTimer(this.props.trialPos.block, this.props.trialPos.trial);
    		return;
    	}
    	this.props.startITITimer(this.props.wasCorrect, this.props.mode);
   	}

  	componentDidUpdate(prevProps, prevState, snapshot) {
		if (!this.props.feedback || prevProps.feedback) {
    		this.props.startTimeOutTimer(this.props.trialPos.block, this.props.trialPos.trial);
			return;
    	}
    	this.props.startITITimer(this.props.wasCorrect, this.props.mode);
  	}
	handleKeyPress(keyCode) {
		if (_.has(validKeys, keyCode)) {
			this.props.registerKeyPress(this.props.user, keyCode, this.trialStart, this.props.data);
		}
	}

	render() {
		const img = colToImg[this.props.stimType][this.props.trialColour];
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
	stimType: getTrialStimuliType(state),
	trialColour: getTrialColour(state),
	data: getTrialData(state),
	wasCorrect: getLastInputWasCorrect(state),
	user: getUserID(state),
	trialPos: getTrialPositon(state),
	mode: getTaskMode(state)
});

const mapDispatchToProps = (dispatch, ownProps) => {
	return {
	    startITITimer: (wasCorrect,mode) => dispatch(startTimeout(dispatch => {
	    	if (wasCorrect) {
		    	dispatch(showITI());
				dispatch(goToNextTrial());
	    	} else {
	    		dispatch(endCurrentTrials());
	    		dispatch(goToNextTaskState());
	    	}
		},MODE_ITI[mode])),
		 startTimeOutTimer: (block, trial) => dispatch(startTimeout(dispatch => {
		 	console.log('TIMEOUT');
		 	dispatch(showTimeOut(block, trial));
		},TIMEOUT_MILLIS)),
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