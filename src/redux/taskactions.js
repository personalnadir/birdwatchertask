import {
	isLastBlock,
	getCurrentBlock,
	getTrialsComplete,
	getTaskState
} from './selectors';
import {goToNextApplicationState} from './applicationactions';
import {setTrialStimuli} from './trialactions';
import {
	TASK_PROPER,
	TYPE_MAIN
} from './taskconstants';

export const NEXT_TASK_STATE = 'task/nextTaskState';
export const NEXT_BLOCK = 'task/nextBlock';
export const SWITCH_MODE = 'task/switchMode';

export const goToNextTaskState = () => {
	return (dispatch, getState) => {
		const state = getState();
		if (isLastBlock(state) && getTaskState(state) === TASK_PROPER) {
			dispatch(goToNextApplicationState());
			dispatch(switchMode(TYPE_MAIN));
			dispatch(setTrialStimuli(getCurrentBlock(getState())));
			return;
		}

		if (getTrialsComplete(state)) {
			dispatch(setTrialStimuli(getCurrentBlock(state)));
			dispatch(goToNextBlock());
		}

		dispatch({
			type: NEXT_TASK_STATE
		});
	};
};

export const goToNextBlock = ()=> ({
	type: NEXT_BLOCK
});

export const switchMode = (newMode)=> ({
	type: SWITCH_MODE,
	mode: newMode
});
