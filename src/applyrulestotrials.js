import {
	TRIAL_ACTION_PHOTO,
	TRIAL_ACTION_SKIP
} from "./redux/trialconstants";

import _ from 'underscore';

function detectOrdinalColours(trials) {
	return _.first(trials,4);
}

function processTrials(ruleSet, trials) {
	console.log(ruleSet);
	const ordinalColours = detectOrdinalColours(trials);
	let ruleIndex = 0;
	let targetIndex = 0;
	let transitionOnTargetIndex = 0;
	let targetMatches = 0;
	let takePhoto = [];

	for(const col of trials) {
		const rule = ruleSet[ruleIndex];
		const targetSequence = rule.target.map(t => ordinalColours[t]? ordinalColours[t]: t);
		const hasTransitionOnTargetRule = _.has(rule, "transitionTarget");
		const transitionOnTarget = rule.transitionTarget;

		const isTarget = targetSequence? targetSequence[targetIndex].indexOf(col) >= 0: false;
		const isTransitionTarget = hasTransitionOnTargetRule && transitionOnTarget[transitionOnTargetIndex].indexOf(col) >= 0;

		let isPhotoTarget = false;
		if (isTarget || isTransitionTarget) {
			if (isTarget) {
				targetIndex ++;
				if (targetIndex >= targetSequence.length) {
					targetIndex = 0;
					if (!hasTransitionOnTargetRule) {
						targetMatches ++;
					}
					isPhotoTarget = true;
				}
			}
			if (isTransitionTarget) {
				transitionOnTargetIndex ++;
				if (transitionOnTargetIndex >= transitionOnTarget.length){
					transitionOnTargetIndex = 0;
					targetMatches ++;
				}
			}

			const hasTransition = _.has(rule, "transitionToRule");
			if (hasTransition && targetMatches >= rule.transitionAfterTargetsMatched) {
				targetMatches = 0;
				ruleIndex = rule.transitionToRule;
			}
		}

		if (!isTarget) {
			targetIndex = 0;
		}

		if (!isTransitionTarget) {
			transitionOnTargetIndex = 0;
		}

		takePhoto.push(isPhotoTarget);
	}

	return takePhoto.map(b => b? TRIAL_ACTION_PHOTO: TRIAL_ACTION_SKIP);
}

function mapRuleTransitions(ruleSet) {
	let ruleMap = new Array(ruleSet.length);
	let index = 0;
	for (let i = 0; i < ruleSet.length; i++) {
		ruleMap[i] = {};
		let rs = ruleSet[i];
		if (_.has(rs, "target")) {
			ruleMap[i].target = new Array(rs.target.length);
			for (let t = 0; t < rs.target.length; t++) {
				ruleMap[i].target[t] = index;
				index ++;
			}
		}
		if (_.has(rs, "transitionTarget")) {
			ruleMap[i].transitionTarget = new Array(rs.transitionTarget.length);
			for (let t = 0; t < rs.transitionTarget.length; t++) {
				ruleMap[i].transitionTarget[t] = index;
				index ++;
			}

		}
	}

	return ruleMap;
}

function countNumRuleTransitions(ruleSet) {
	let numTransitions = 0;
	for (let i = 0; i < ruleSet.length; i++) {
		let ruleTransitions = 0;
		if (_.has(ruleSet[i], "target")) {
			ruleTransitions += ruleSet[i].target.length;
		}
		if (_.has(ruleSet[i], "transitionTarget")) {
			ruleTransitions += ruleSet[i].transitionTarget.length;
		}
		numTransitions += ruleTransitions;
	}

	return numTransitions;
}

function countRuleTransitions(ruleSet, trials) {
	const ordinalColours = detectOrdinalColours(trials);

	let transitions = new Array(countNumRuleTransitions(ruleSet));
	let ruleMap = mapRuleTransitions(ruleSet);
	transitions.fill(0);

	let ruleIndex = 0;
	let targetIndex = 0;
	let transitionOnTargetIndex = 0;
	let targetMatches = 0;

	for(const col of trials) {
		const rule = ruleSet[ruleIndex];
		const targetSequence = rule.target.map(t => ordinalColours[t]? ordinalColours[t]: t);;
		const hasTransitionOnTargetRule = _.has(rule, "transitionTarget");
		const transitionOnTarget = rule.transitionTarget;

		const isTarget = targetSequence? targetSequence[targetIndex].indexOf(col) >= 0: false;
		const isTransitionTarget = hasTransitionOnTargetRule && transitionOnTarget[transitionOnTargetIndex].indexOf(col) >= 0;

		if (isTarget || isTransitionTarget) {
			if (isTarget) {
				transitions[ruleMap[ruleIndex].target[targetIndex]] ++;
				targetIndex ++;
				if (targetIndex >= targetSequence.length) {
					targetIndex = 0;
					if (!hasTransitionOnTargetRule) {
						targetMatches ++;
					}
				}
			}
			if (isTransitionTarget) {
				transitions[ruleMap[ruleIndex].transitionTarget[transitionOnTargetIndex]] ++;
				transitionOnTargetIndex ++;
				if (transitionOnTargetIndex >= transitionOnTarget.length){
					transitionOnTargetIndex = 0;
					targetMatches ++;
				}
			}

			const hasTransition = _.has(rule, "transitionToRule");
			if (hasTransition && targetMatches >= rule.transitionAfterTargetsMatched) {
				targetMatches = 0;
				ruleIndex = rule.transitionToRule;
			}
		}

		if (!isTarget) {
			targetIndex = 0;
		}

		if (!isTransitionTarget) {
			transitionOnTargetIndex = 0;
		}

	}

	return transitions;
}

export {
	processTrials,
	countRuleTransitions,
	countNumRuleTransitions
};