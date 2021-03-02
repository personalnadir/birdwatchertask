
import React from 'react';
import { connect } from 'react-redux';
import { goToNextTaskState } from '../redux/taskactions';
import { getCurrentRuleText } from '../redux/selectors';

import {
	HUMAN_READABLE_COLOURS,
	USER_INPUT_SKIP,
	USER_INPUT_PHOTO,
	HUMAN_READABLE_KEYS
} from '../constants';


const colourRe = new RegExp(`(${Object.values(HUMAN_READABLE_COLOURS).join('|')})`, 'g');

const keyInstruction = (<div><p>Instructions:</p><p>Press '{HUMAN_READABLE_KEYS[USER_INPUT_PHOTO]}' to take a picture, and press '{HUMAN_READABLE_KEYS[USER_INPUT_SKIP]}' to skip this bird</p></div>);

class RulePage extends React.Component{
	componentDidUpdate() {
		window.scrollTo(0, 0);
	}

	render() {
		const text = (<p>
			{this.props.ruleText.split(colourRe).map((t,i) => t.match(colourRe)? <span key={i} className={t}>{t}</span>:<span key={i}>{t}</span>)}
		</p>);
		return (
			<div>
				{keyInstruction}
				{text}
				<button onClick={this.props.nextPage} className="ContinueButton">Continue</button>
			</div>
		);
	}
}

const mapStateToProps = state => ({
	ruleText: getCurrentRuleText(state)
});

const mapDispatchToProps = dispatch => {
	return {
		nextPage: () => {
			dispatch(goToNextTaskState());
		}
	};
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(RulePage);
