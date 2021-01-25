import {
	isLastBlock,
	getTrialsComplete,
	getTaskState,
	getStimuliForBlock,
	getCurrentRule
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
		const inTask = getTaskState(state) === TASK_PROPER;
		if (isLastBlock(state) && inTask) {
			dispatch(goToNextApplicationState());
			dispatch(switchMode(TYPE_MAIN));
			dispatch(
				setTrialStimuli(
					getStimuliForBlock(getState()),
					getCurrentRule(getState())
				)
			);
			return;
		}

		dispatch({
			type: NEXT_TASK_STATE
		});

		if (getTrialsComplete(state)) {
			if (inTask) {
				dispatch(goToNextBlock());
			}
			dispatch(
				setTrialStimuli(
					getStimuliForBlock(getState()),
					getCurrentRule(getState())
				)
			);
		}
	};
};

export const goToNextBlock = ()=> ({
	type: NEXT_BLOCK
});

export const switchMode = (newMode)=> ({
	type: SWITCH_MODE,
	mode: newMode
});
