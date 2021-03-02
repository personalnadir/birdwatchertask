
import React from 'react';
import { connect } from 'react-redux';
import { goToNextTaskState } from '../redux/taskactions';
import { getCurrentRuleText } from '../redux/selectors';

import {
	HUMAN_READABLE_COLOURS,
} from '../constants';


const colourRe = new RegExp(`(${Object.values(HUMAN_READABLE_COLOURS).join('|')})`, 'g');


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
