export const SET_USER_ID = 'data/setUserID';
export const STORE_TRIAL = 'data/storeTrialData';

export const storeTrialData = (userAction, startTime, reactionTime, trialData, attempts)=> ({
	type: STORE_TRIAL,
	userAction,
	block: trialData.block,
	mode: trialData.mode,
	stimuli: trialData.stimuli,
	correctAction: trialData.correctAction,
	rule: trialData.rule,
	reactionTime,
	startTime,
	attempts,
	millis: Date.now(),
	time: new Date().toTimeString(),
	date: new Date().toDateString()
});

export const setUserID = id => ({
	type: SET_USER_ID,
	id: id
});