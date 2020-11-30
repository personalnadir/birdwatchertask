import {APP_STATE_FLOW} from './applicationconstants';

const getApplicationState = state => APP_STATE_FLOW[state.application.appStateIndex];

export {
	getApplicationState
};