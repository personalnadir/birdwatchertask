import React from 'react';
import { connect } from 'react-redux';
import {goToNextTaskState} from '../redux/taskactions';
import {getTaskState} from '../redux/selectors';
import { TASK_RULE, TASK_PROPER } from '../redux/taskconstants';
import TrialController from './TrialController';
import RulePage from '../Pages/RulePage';

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
		switch (this.props.taskState) {
			case TASK_RULE:
				return <RulePage />;
			case TASK_PROPER:
				return <TrialController />;
			default:
				return null;
		};
	}
}

const mapStateToProps = state => ({
	taskState: getTaskState(state)
});

const mapDispatchToProps = dispatch => {
	return {
		endTask: () => {
			dispatch(goToNextTaskState());
		}
	};
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(TaskPage);;