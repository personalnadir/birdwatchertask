import {APP_STATE_FLOW} from './applicationconstants';
import {TASK_FLOW, TASK_TIMEOUT} from './taskconstants';
import {TRIAL_FLOW} from './trialconstants';

const getApplicationState = state => APP_STATE_FLOW[state.application.appStateIndex];
const getTaskState = state => state.task.timeout? TASK_TIMEOUT: TASK_FLOW[state.task.taskPhaseIndex];
const getTrialState = state => TRIAL_FLOW[state.trial.trialPhaseIndex];
const isLastBlock = state => state.task.lastBlock;
const getCurrentBlock = state => {
	const {blocks, currentBlock, mode} = state.task;
	return blocks[mode][currentBlock];
};
const getCurrentTrial = state => state.trial.currentTrial;
const getCurrentTrialStimulus = state => state.trial.stimuli[getCurrentTrial(state)];
const getTrialColour = state => getCurrentTrialStimulus(state).col;
const getTrialDirection = state => getCurrentTrialStimulus(state).face;
const currentTrialsExhausted = state => state.trial.stimuli.length === state.trial.currentTrial;
const getTrialsComplete = state => state.trial.complete;
const getCurrentRuleConfig = state => getCurrentBlock(state).rules;
const getCurrentRule = state => getCurrentRuleConfig(state).rules;
const getTrialStimuliType = state => getCurrentRuleConfig(state).stimuli;
const getStimuliMirroring = state => getCurrentRuleConfig(state).stimuliMirroring;
const isTrialStoopVersion = state => getCurrentRuleConfig(state).stroop;
const getInputsSwapped = state =>getCurrentRuleConfig(state).swapInputs;

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
const getTaskMode = state => state.task.mode;
const getInstructionsPage = state => state.application.instructionPage;
const getTaskPosition = state => ({block: state.task.currentBlock, trial: state.trial.currentTrial});
const getAttempts = state => state.trial.attempts;
const getTrialID = state => state.trial.id;

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
	getTaskMode,
	getUserID,
	getInstructionsPage,
	getTaskPosition,
	getTrialStimuliType,
	getAttempts,
	getTrialID,
	isTrialStoopVersion,
	getInputsSwapped,
	getTrialDirection,
	getStimuliMirroring
};