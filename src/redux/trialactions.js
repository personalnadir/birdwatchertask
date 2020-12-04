import {getTrialsComplete} from './selectors';
import {goToNextTaskState} from './taskactions';
export const SHOW_ITI = 'trial/showITI';
export const SHOW_STIMULUS = 'trial/showStimulus';
export const SHOW_FEEDBACK = 'trial/showFeeback';
export const NEXT_TRIAL = 'trial/nextTrial';
export const SET_TRIAL_STIMULI = 'trial/setTrialStimuli';
export const REGISTER_INPUT = 'trial/registerInput';

export const showITI = ()=> ({
	type: SHOW_ITI
});

export const showStimulus = ()=> ({
	type: SHOW_STIMULUS
});

export const showFeedback = () => ({
	type: SHOW_FEEDBACK
});

export const goToNextTrial = () => {
	return (dispatch, getState) => {
		if (getTrialsComplete(getState())) {
			dispatch(goToNextTaskState());
			return;
		}
		dispatch({
			type: NEXT_TRIAL
		});
	};
};

export const setTrialStimuli = (stimuli) => ({
	type: SET_TRIAL_STIMULI,
	stimuli
});

export const registerInput = (optionSelected) => ({
	type: REGISTER_INPUT,
	time: Date.now(),
	optionSelected,
});

