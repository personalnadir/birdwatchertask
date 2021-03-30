import {
	getReadingTime,
	getUserID
} from './selectors';
import {storeData} from '../database/db';
export const SET_USER_ID = 'data/setUserID';
export const SET_READING_TIME = 'data/setReadingTime';
export const STORE_TRIAL = 'data/storeTrialData';

export const storeTrialData = (userAction, startTime, reactionTime, trialData, attempts) => {
	return (dispatch, getState) => {
		const readingTime = getReadingTime(getState());
		const dataAction = {
			type: STORE_TRIAL,
			userAction,
			block: trialData.block,
			mode: trialData.mode,
			stimuliColour: trialData.stimuli.col,
			stimuliDirection: trialData.stimuli.face,
			correctAction: trialData.correctAction,
			rule: trialData.rule,
			reactionTime,
			startTime,
			attempts,
			readingTime,
			millis: Date.now(),
			time: new Date().toTimeString(),
			date: new Date().toDateString()
		};
		dispatch (dataAction);

		storeData(getUserID(getState()), dataAction);
	};
};

export const setUserID = id => ({
	type: SET_USER_ID,
	id: id
});

export const setReadingTime = t => ({
	type: SET_READING_TIME,
	time: t
});