import {
	TRIAL_ACTION_PHOTO,
	TRIAL_ACTION_SKIP
} from "./redux/trialconstants";

import _ from 'underscore';

function processTrials(ruleSet, trials) {
	console.log(ruleSet);
	let ruleIndex = 0;
	let targetIndex = 0;
	let targetMatches = 0;
	let takePhoto = [];

	for(const col of trials) {
		const targetSequence = ruleSet[ruleIndex].target;
		if (typeof targetSequence === 'undefined') {
			takePhoto.push(false);
			continue;
		}
		const isTarget = targetSequence[targetIndex].indexOf(col) >= 0;
		console.log(col, isTarget);
		let isPhotoTarget = false;
		if (isTarget) {
			targetIndex ++;
			if (targetIndex >= targetSequence.length) {
				targetIndex = 0;
				targetMatches ++;
				isPhotoTarget = true;
				const rule = ruleSet[ruleIndex];
				const hasTransition = _.has(rule, "transitionToRule");
				if (hasTransition && targetMatches >= rule.transitionAfterTargetsMatched) {
					targetMatches = 0;
					ruleIndex = rule.transitionToRule;
				}
			}
		} else {
			targetMatches = 0;
		}

		takePhoto.push(isPhotoTarget);
	}

	return takePhoto.map(b => b? TRIAL_ACTION_PHOTO: TRIAL_ACTION_SKIP);
}

function countRuleTransitions(ruleSet, trials) {
	let transitions = new Array(ruleSet.length);
	transitions.fill(0);

	let ruleIndex = 0;
	let targetIndex = 0;
	let targetMatches = 0;

	for(const col of trials) {
		const targetSequence = ruleSet[ruleIndex].target;
		if (typeof targetSequence === 'undefined') {
			break;
		}
		const isTarget = targetSequence[targetIndex].indexOf(col) >= 0;
		if (isTarget) {
			targetIndex ++;
			if (targetIndex >= targetSequence.length) {
				targetIndex = 0;
				targetMatches ++;
				const rule = ruleSet[ruleIndex];
				const hasTransition = _.has(rule, "transitionToRule");
				if (hasTransition && targetMatches >= rule.transitionAfterTargetsMatched) {
					targetMatches = 0;
					transitions[ruleIndex] ++;
					ruleIndex = rule.transitionToRule;
				}
			}
		} else {
			targetMatches = 0;
		}
	}

	return transitions;
}

export {
	processTrials,
	countRuleTransitions
};