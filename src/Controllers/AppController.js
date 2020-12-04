import React from 'react';
import * as app from '../redux/applicationconstants';
import {getApplicationState} from '../redux/selectors';
import {connect} from 'react-redux';
import LoginPage from '../Pages/LoginPage';
import InstructionsPage from '../Pages/InstructionsPage';
import TaskPage from './TaskPage';
import {EndPage} from '../Pages/EndPage';

function AppController({appState}) {
	switch (appState) {
		case app.LOGIN_PAGE:
			return <LoginPage />;
		case app.INSTRUCTIONS:
			return <InstructionsPage />;
		case app.TASK:
			return <TaskPage />;
		case app.END:
			return <EndPage />;
		default:
			return null;
	}
}

const mapStateToProps = state => {
	return {
		appState: getApplicationState(state)
	};
};

export default connect(
	mapStateToProps,
)(AppController);