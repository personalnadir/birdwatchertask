
import React from 'react';
import { connect } from 'react-redux';
import { goToNextTaskState } from '../redux/taskactions';
import { getCurrentRuleText } from '../redux/selectors';

class RulePage extends React.Component{
	componentDidUpdate() {
		window.scrollTo(0, 0);
	}

	render() {
		return (
			<div>
				<p>{this.props.ruleText}</p>
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
