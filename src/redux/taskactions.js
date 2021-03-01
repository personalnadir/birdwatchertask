import {
	isLastBlock,
	getTrialsComplete,
	getTaskState,
	getStimuliForBlock,
	getCurrentRule,
	getTaskMode
} from './selectors';
import {goToNextApplicationState} from './applicationactions';
import {setTrialStimuli} from './trialactions';
import {
	TASK_PROPER,
	TYPE_RANDOMISED,
	TYPE_NONRANDOMISED
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
			dispatch(switchMode(getTaskMode(state) === TYPE_RANDOMISED? TYPE_NONRANDOMISED : TYPE_RANDOMISED));
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
