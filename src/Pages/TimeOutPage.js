import React from 'react';
import { connect } from 'react-redux';
import {
	hideTimeOut,
} from '../redux/taskactions';

import {
	restartTrialOrGiveUp
} from '../redux/trialactions';

import KeyListener from '../Components/KeyListener';

class TimeOutPage extends React.Component {
	constructor (props) {
		super(props);
		this.handleKeyPress = this.handleKeyPress.bind(this);
	}

	handleKeyPress(keyCode) {
		this.props.restartBlock();
	}

	render() {
		return (
			<div className = "InstructionPage">
				<KeyListener onKeyEvent = {this.handleKeyPress} />
				<p><span className="TextEmphasis">Time out. Please respond faster.</span></p>
				<p>Press any key to continue</p>
			</div>
		);
	}
};


const mapStateToProps = (state, ownProps) => {
	return {
	};
};

const mapDispatchToProps = (dispatch, ownProps) => {
	return {
		restartBlock: () => {
			dispatch(restartTrialOrGiveUp());
			dispatch(hideTimeOut());
		}
	};
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(TimeOutPage);
