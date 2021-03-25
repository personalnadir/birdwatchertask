import React from 'react';
import { connect } from 'react-redux';
import {
	registerInput,
	showFeedback,
	goToNextTrial,
	showITI,
	increaseAttempts,
	restartTrialOrGiveUp,
} from '../redux/trialactions';

import {
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
	getTaskPosition,
	getTaskMode,
	getTrialStimuliType,
	getTrialID,
	getAttempts,
	isTrialStoopVersion,
	getTrialDirection,
	getITI
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
import blueSpider from '../images/task/spider-blue.png';
import greenSpider from '../images/task/spider-green.png';
import redSpider from '../images/task/spider-red.png';
import yellowSpider from '../images/task/spider-yellow.png';

import {
	COLOUR_RED,
	COLOUR_BLUE,
	COLOUR_GREEN,
	COLOUR_YELLOW,
	KEYS,
	TIMEOUT_MILLIS,
	HUMAN_READABLE_COLOURS,
	LOOKING_LEFT,
	LOOKING_RIGHT
} from '../constants';

import {
	STIMULI_BIRD,
	STIMULI_SNAKE,
	STIMULI_SPIDER
} from '../redux/taskconstants';

import keyEncode from '../keyencode';
import _ from 'underscore';

const colToImg = {
	[LOOKING_LEFT] : {
		[STIMULI_BIRD]: {
			[COLOUR_RED]: (<img alt="Red Bird" className="stimuli" src={redBird} />),
			[COLOUR_BLUE]: (<img alt="Blue Bird" className="stimuli" src={blueBird} />),
			[COLOUR_GREEN]: (<img alt="Green Bird" className="stimuli" src={greenBird} />),
			[COLOUR_YELLOW]: (<img alt="Yellow Bird" className="stimuli" src={yellowBird} />)
		},
		[STIMULI_SNAKE]: {
			[COLOUR_RED]: (<img alt="Red Snake" className="scaleup" src={redSnake} />),
			[COLOUR_BLUE]: (<img alt="Blue Snake" className="scaleup" src={blueSnake} />),
			[COLOUR_GREEN]: (<img alt="Green Snake" className="scaleup" src={greenSnake} />),
			[COLOUR_YELLOW]: (<img alt="Yellow Snake" className="scaleup" src={yellowSnake} />)
		},
		[STIMULI_SPIDER]: {
			[COLOUR_RED]: (<img alt="Red Spider" className="scaleup" src={redSpider} />),
			[COLOUR_BLUE]: (<img alt="Blue Spider" className="scaleup" src={blueSpider} />),
			[COLOUR_GREEN]: (<img alt="Green Spider" className="scaleup" src={greenSpider} />),
			[COLOUR_YELLOW]: (<img alt="Yellow Spider" className="scaleup" src={yellowSpider} />)
		}
	},
	[LOOKING_RIGHT] : {
		[STIMULI_BIRD]: {
			[COLOUR_RED]: (<img alt="Red Bird" className="mirrored stimuli" src={redBird} />),
			[COLOUR_BLUE]: (<img alt="Blue Bird" className="mirrored stimuli" src={blueBird} />),
			[COLOUR_GREEN]: (<img alt="Green Bird" className="mirrored stimuli" src={greenBird} />),
			[COLOUR_YELLOW]: (<img alt="Yellow Bird" className="mirrored stimuli" src={yellowBird} />)
		},
		[STIMULI_SNAKE]: {
			[COLOUR_RED]: (<img alt="Red Snake" className="mirrored scaleup" src={redSnake} />),
			[COLOUR_BLUE]: (<img alt="Blue Snake" className="mirrored scaleup" src={blueSnake} />),
			[COLOUR_GREEN]: (<img alt="Green Snake" className="mirrored scaleup" src={greenSnake} />),
			[COLOUR_YELLOW]: (<img alt="Yellow Snake" className="mirrored scaleup" src={yellowSnake} />)
		},
		[STIMULI_SPIDER]: {
			[COLOUR_RED]: (<img alt="Red Spider" className="mirrored scaleup" src={redSpider} />),
			[COLOUR_BLUE]: (<img alt="Blue Spider" className="mirrored scaleup" src={blueSpider} />),
			[COLOUR_GREEN]: (<img alt="Green Spider" className="mirrored scaleup" src={greenSpider} />),
			[COLOUR_YELLOW]: (<img alt="Yellow Spider" className="mirrored scaleup" src={yellowSpider} />)
		}
	}
};


const validKeys = _.invert(KEYS);

const stroopAlternativeColours = {
	[COLOUR_RED]: [COLOUR_BLUE, COLOUR_GREEN, COLOUR_YELLOW],
	[COLOUR_BLUE]: [COLOUR_RED, COLOUR_GREEN, COLOUR_YELLOW],
	[COLOUR_GREEN]: [COLOUR_RED, COLOUR_BLUE, COLOUR_YELLOW],
	[COLOUR_YELLOW]: [COLOUR_RED, COLOUR_BLUE, COLOUR_GREEN],
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
	 	this.trialStart = Date.now();
    	if (!this.props.feedback) {
    		this.props.startTimeOutTimer(this.props.trialPos.block, this.props.trialPos.trial, this.props.trialID);
    		return;
    	}
    	this.props.startITITimer(this.props.iti, this.props.wasCorrect, this.props.mode, this.props.trialID);
   	}

  	componentDidUpdate(prevProps, prevState, snapshot) {
		if (!this.props.feedback || prevProps.feedback) {
    		this.props.startTimeOutTimer(this.props.trialPos.block, this.props.trialPos.trial, this.props.trialID);
			return;
    	}
    	this.props.startITITimer(this.props.iti, this.props.wasCorrect, this.props.mode, this.props.trialID);
  	}
	handleKeyPress(keyCode) {
		if (_.has(validKeys, keyCode)) {
			this.props.registerKeyPress(this.props.user, keyCode, this.trialStart, this.props.data, this.props.attempts);
		}
	}

	render() {
		const col = this.props.stroop? stroopAlternativeColours[this.props.trialColour][this.props.trialID % 3]: this.props.trialColour;
		const img = colToImg[this.props.facing][this.props.stimType][col];
		const feedback = this.props.feedback? <p>{this.props.wasCorrect? "Correct": "Wrong"}</p> : null;
		const feedbackText = <div className="centred">{feedback}</div>;
		const colour = HUMAN_READABLE_COLOURS[this.props.trialColour];
		const textColour = HUMAN_READABLE_COLOURS[col];
		const stroopText = !this.props.feedback && this.props.stroop? <div className={"centred " + textColour}>{colour}</div>: null;
		return (
			<div className="container">
				<KeyListener onKeyEvent = {this.handleKeyPress} />
				{img}
				{stroopText}
				{feedbackText}
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
	trialPos: getTaskPosition(state),
	trialID: getTrialID(state),
	mode: getTaskMode(state),
	attempts: getAttempts(state),
	stroop: isTrialStoopVersion(state),
	facing: getTrialDirection(state),
	iti: getITI(state)
});

const mapDispatchToProps = (dispatch, ownProps) => {
	return {
	    startITITimer: (iti, wasCorrect, mode, id) => dispatch(startTimeout(dispatch => {
	    	if (wasCorrect) {
		    	dispatch(showITI());
				dispatch(goToNextTrial());
	    	} else {
	    		dispatch(increaseAttempts(id));
	    		dispatch(restartTrialOrGiveUp());
	    	}
		}, iti)),
		 startTimeOutTimer: (block, trial, id) => dispatch(startTimeout(dispatch => {
		 	dispatch(showTimeOut(block, trial, id));
    		dispatch(increaseAttempts(id));
		},TIMEOUT_MILLIS)),
		registerKeyPress: (user, keyCode, startTime, data, attempts) => {
			if (ownProps.feedback) {
				return;
			} else {
				const keyAction = keyEncode(keyCode);
				const reactionTime = Date.now() - startTime;
				const dataAction = storeTrialData(keyAction, startTime, reactionTime, data, attempts);
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