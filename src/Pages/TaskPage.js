import React from 'react';
import { connect } from 'react-redux';
import {goToNextApplicationState} from '../redux/applicationactions';

class TaskPage extends React.Component {
	constructor (props) {
		super(props);
		this.state = {
			showButton: true
		};

		this.handleButtonPress = this.handleButtonPress.bind(this);
	}

	handleButtonPress() {
		this.props.endTask();
	}

	render() {
		const button = this.state.showButton? <button onClick={this.handleButtonPress} className="ContinueButton">Continue</button>: null;

		return (
			<div className = "InstructionPage">
				<span className="TextEmphasis">TASK</span>
				{button}
			</div>
		);
	}
}

const mapDispatchToProps = dispatch => {
	return {
		endTask: () => {
			dispatch(goToNextApplicationState());
		}
	};
};

export default connect(
	null,
	mapDispatchToProps
)(TaskPage);;