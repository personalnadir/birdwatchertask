import {APP_STATE_FLOW} from './applicationconstants';
import {TASK_FLOW} from './taskconstants';
import {TRIAL_FLOW} from './trialconstants';
import {COLOURS} from '../constants';

const getApplicationState = state => APP_STATE_FLOW[state.application.appStateIndex];
const getTaskState = state => TASK_FLOW[state.task.taskPhaseIndex];
const getTrialState = state => TRIAL_FLOW[state.trial.trialPhaseIndex];
const isLastBlock = state => state.task.lastBlock;
const getCurrentBlock = state => {
	const {blocks, currentBlock, mode} = state.task;
	return blocks[mode][currentBlock];
};
const getCurrentTrial = state => state.trial.currentTrial;
const getCurrentTrialStimulus = state => state.trial.stimuli[getCurrentTrial(state)];
const getTrialColour = state => getCurrentTrialStimulus(state);
const currentTrialsExhausted = state => state.trial.stimuli.length === state.trial.currentTrial;
const getTrialsComplete = state => state.trial.complete;

export {
	getApplicationState,
	getTaskState,
	getTrialState,
	getTrialColour,
	getTrialsComplete,
	isLastBlock,
	getCurrentBlock,
	currentTrialsExhausted
};