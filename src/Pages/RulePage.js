
import React from 'react';
import { connect } from 'react-redux';
import { goToNextTaskState } from '../redux/taskactions';
import { setReadingTime } from '../redux/dataactions';
import {
	getCurrentRuleText,
	getTrialStimuliType,
	getInputsSwapped
} from '../redux/selectors';

import {
	HUMAN_READABLE_COLOURS,
	USER_INPUT_SKIP,
	USER_INPUT_PHOTO,
	HUMAN_READABLE_KEYS
} from '../constants';

import {
	HUMAN_READABLE_STIMULI
} from '../redux/taskconstants';

const colourRe = new RegExp(`(${Object.values(HUMAN_READABLE_COLOURS).join('|')})`, 'g');


class RulePage extends React.Component{
	componentDidUpdate() {
		window.scrollTo(0, 0);
	}

	componentDidMount() {
		this.textAppeared = Date.now();
	}

	render() {
		let photoKey;
		let skipKey;
		if (this.props.swapInputs) {
			photoKey = HUMAN_READABLE_KEYS[USER_INPUT_SKIP];
			skipKey = HUMAN_READABLE_KEYS[USER_INPUT_PHOTO];
		} else {
			photoKey = HUMAN_READABLE_KEYS[USER_INPUT_PHOTO];
			skipKey = HUMAN_READABLE_KEYS[USER_INPUT_SKIP];
		}

		const keyInstruction = (<div><p>Instructions:</p><p>Press <b>'{photoKey}'</b> to take a picture, and press <b>'{skipKey}'</b> to skip this {HUMAN_READABLE_STIMULI[this.props.stimType].singular}</p></div>);
		const text = (<p>
			{this.props.ruleText.split(colourRe).map((t,i) => t.match(colourRe)? <span key={i} className={t}>{t}</span>:<span key={i}>{t}</span>)}
		</p>);
		return (
			<div>
				{this.props.swapInputs? <p className="warning">The buttons you must press have been switched!</p>: null}
				{keyInstruction}
				{text}
				<button onClick={() => this.props.nextPage(this.textAppeared)} className="ContinueButton">Continue</button>
			</div>
		);
	}
}

const mapStateToProps = state => ({
	ruleText: getCurrentRuleText(state),
	stimType: getTrialStimuliType(state),
	swapInputs: getInputsSwapped(state)
});

const mapDispatchToProps = dispatch => {
	return {
		nextPage: startReading => {
			const readingTime = Date.now() - startReading;
			dispatch(setReadingTime(readingTime));
			dispatch(goToNextTaskState());
		}
	};
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(RulePage);
