import {
	isLastBlock,
	getTrialsComplete,
	getTaskState,
	getStimuliForBlock,
	getCurrentRule,
	getTaskMode,
	getTaskPosition,
	getTrialID,
	getStimuliMirroring
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
export const SHOW_TIMEOUT = 'task/showTimeout';
export const HIDE_TIMEOUT = 'task/hideTimeout';
export const REGENERATE_BLOCK = 'task/regenBlock';
export const COUNTER_BALACE = 'task/counterBalance';

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
					getCurrentRule(getState()),
					getStimuliMirroring(getState())
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
					getCurrentRule(getState()),
					getStimuliMirroring(getState())
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

export const showTimeOut = (block, trial, id) => {
	return (dispatch, getState) => {
		const state = getState();
		const pos = getTaskPosition(state);

		if (pos.block !== block || pos.trial !== trial) {
			return;
		}
		if (id !== getTrialID(state)) {
			return;
		}
		dispatch({
			type: SHOW_TIMEOUT,
			block,
			trial
		});
	};
};

export const hideTimeOut = () => ({
	type: HIDE_TIMEOUT
});

export const regenerateBlocks = () => ({
	type: REGENERATE_BLOCK
});

export const restartBlock = () => {
	return (dispatch, getState) => {
		dispatch({
			type: NEXT_TASK_STATE
		});
		dispatch(
			setTrialStimuli(
				getStimuliForBlock(getState()),
				getCurrentRule(getState()),
				getStimuliMirroring(getState())
			)
		);
	};
};

export const counterBalanceTrials = id => ({
	type: COUNTER_BALACE,
	counterBalanceA: id % 2 === 0
});