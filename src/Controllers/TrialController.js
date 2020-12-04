import React from 'react';
import { connect } from 'react-redux';
import {getTrialState} from '../redux/selectors';
import {
	TRIAL_ITI,
	TRIAL_STIMULUS,
	TRIAL_FEEDBACK
} from '../redux/trialconstants';
import StimuliPage from '../Pages/StimuliPage';
import ITIPage from '../Pages/ITIPage';

class TrialController extends React.Component {
	constructor (props) {
		super(props);
		this.state = {
			showButton: true
		};
	}

	render() {
		switch (this.props.trialState) {
			case TRIAL_ITI:
				return <ITIPage />;
			case TRIAL_STIMULUS:
				return <StimuliPage />;
			case TRIAL_FEEDBACK:
				return <StimuliPage feedback={true} />;
			default:
				return null;
		};
	}
}

const mapStateToProps = state => ({
	trialState: getTrialState(state)
});

export default connect(
	mapStateToProps,
)(TrialController);;