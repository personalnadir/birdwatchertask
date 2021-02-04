import {APP_STATE_FLOW} from './applicationconstants';
import {TASK_FLOW} from './taskconstants';
import {TRIAL_FLOW} from './trialconstants';

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
const getCurrentRuleConfig = state => getCurrentBlock(state).rules;
const getCurrentRule = state => getCurrentRuleConfig(state).rules;
const getStimuliForBlock = state => getCurrentBlock(state).trials;
const getCurrentRuleText = state => getCurrentRuleConfig(state).text;
const getLastInputWasCorrect = state => state.trial.correct;
const getTrialData = state => {
	const {currentBlock, mode} = state.task;
	const {currentTrial, stimuli, correctAction} = state.trial;
	const rule = getCurrentRuleConfig(state);
	return {
		block: currentBlock,
		mode,
		trial: currentTrial,
		stimuli: stimuli[currentTrial],
		correctAction: correctAction[currentTrial],
		rule: rule.name
	};
};
const getUserID = state => state.data.user;

export {
	getApplicationState,
	getTaskState,
	getTrialState,
	getTrialColour,
	getTrialsComplete,
	isLastBlock,
	getCurrentBlock,
	currentTrialsExhausted,
	getCurrentRuleText,
	getStimuliForBlock,
	getCurrentRule,
	getLastInputWasCorrect,
	getTrialData,
	getUserID
};