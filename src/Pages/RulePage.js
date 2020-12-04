import React from 'react';
import { connect } from 'react-redux';
import { goToNextTaskState } from '../redux/taskactions';

class RulePage extends React.Component{
	componentDidUpdate() {
		window.scrollTo(0, 0);
	}

	render() {
		return (
			<div>
				<p>A rule to follow</p>
				<button onClick={this.props.nextPage} className="ContinueButton">Continue</button>
			</div>
		);
	}
}

const mapDispatchToProps = dispatch => {
	return {
		nextPage: () => {
			dispatch(goToNextTaskState());
		}
	};
};

export default connect(
	null,
	mapDispatchToProps
)(RulePage);
