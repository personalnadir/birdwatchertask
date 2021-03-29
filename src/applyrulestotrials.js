import {
	TRIAL_ACTION_PHOTO,
	TRIAL_ACTION_SKIP
} from "./redux/trialconstants";

import _ from 'underscore';

function detectOrdinalColours(trials) {
	return _.first(trials,4);
}

function mapOrdinals(targets, ordinalColours) {
	return targets.map(list => list.map(t => ordinalColours[t.symbol]? ({
			...t,
			symbol: ordinalColours[t.symbol].col,
		})
		: t)
	);
}

function targetMatchesTrials (target, trials, evalDir){
	const ordinalColours = detectOrdinalColours(trials);
	const targetSequence = mapOrdinals(target, ordinalColours);
	let targetIndex = 0;

	for(const t of trials) {
		const isTarget = matchesTarget(targetSequence[targetIndex], t.col, t.face, evalDir);
		if (!isTarget) {
			return false;
		}
		if (isTarget) {
			targetIndex ++;
			if (targetIndex >= targetSequence.length) {
				return true;
			}
		}
	}

	return false;
}

function getStartingRuleIndex(ruleSet, trials, mirroring) {
	for (let i = 0; i < ruleSet.length; i++) {
		if (!_.has(ruleSet[i], "condition")) {
			continue;
		}

		if (targetMatchesTrials(ruleSet[i].condition, trials, mirroring)) {
			return i;
		}
	}

	return 0;
}

function matchesTarget(target, col, dir, evalDir) {
	const trial = evalDir? {symbol: col, direction: dir}:{symbol: col};
	let match = _.findWhere(target ?? [], trial);
	if (evalDir && _.isUndefined(match)) {
		match = _.findWhere(target ?? [], {symbol: col});
		return match && (_.isUndefined(match.direction) || _.isNull(match.direction));
	}
	return !_.isUndefined(match);
}

function processTrials(ruleSet, trials, mirroring) {
	const ordinalColours = detectOrdinalColours(trials);
	let ruleIndex = getStartingRuleIndex(ruleSet, trials, mirroring);
	let targetIndex = 0;
	let transitionOnTargetIndex = 0;
	let targetMatches = 0;
	let takePhoto = [];

	for(let i = 0; i < trials.length; i++) {
		const t = trials[i];
		const rule = ruleSet[ruleIndex];
		if (!_.has(rule, "target")) {
			takePhoto.push(false);
			continue;
		}
		const targetSequence = mapOrdinals(rule.target, ordinalColours);
		const hasTransitionOnTargetRule = _.has(rule, "transitionTarget");
		const transitionOnTarget = rule.transitionTarget;

		const isTarget = matchesTarget(targetSequence[targetIndex], t.col, t.face, mirroring);
		const isTransitionTarget = hasTransitionOnTargetRule && matchesTarget(transitionOnTarget[transitionOnTargetIndex], t.col, t.face, mirroring);

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
				if (isTransitionTarget) {
					i --; // check the transition target does not match the new rule target
					continue;
				}
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

function mapRuleTransitions(ruleSet, trials, mirroring) {
	let isReachable = getReachableRules(ruleSet, trials, mirroring);
	let ruleMap = new Array(ruleSet.length);
	let index = 0;
	for (let i = 0; i < ruleSet.length; i++) {
		if (!isReachable[i]) {
			continue;
		}
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

function getReachableRules(ruleSet, trials, mirroring) {
	let ruleIndex = getStartingRuleIndex(ruleSet, trials, mirroring);
	let reachable = new Array(ruleSet.length);
	reachable.fill(false);
	reachable[ruleIndex] = true;

	while (true) {
		if (!_.has(ruleSet[ruleIndex], "transitionToRule")) {
			return reachable;
		}

		ruleIndex = ruleSet[ruleIndex].transitionToRule;
		if (reachable[ruleIndex]) {
			return reachable;
		}
		reachable[ruleIndex] = true;
	}
}

function countNumRuleTransitions(ruleSet, trials, mirroring) {
	let isReachable = getReachableRules(ruleSet, trials, mirroring);
	let numTransitions = 0;
	for (let i = 0; i < ruleSet.length; i++) {
		if (!isReachable[i]) {
			continue;
		}
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

function countRuleTransitions(ruleSet, trials, mirroring) {
	const ordinalColours = detectOrdinalColours(trials);

	let transitions = new Array(countNumRuleTransitions(ruleSet, trials, mirroring));
	let ruleMap = mapRuleTransitions(ruleSet, trials, mirroring);
	transitions.fill(0);

	let ruleIndex = getStartingRuleIndex(ruleSet, trials, mirroring);
	let targetIndex = 0;
	let transitionOnTargetIndex = 0;
	let targetMatches = 0;

	for(let i = 0; i < trials.length; i++) {
		const t = trials[i];
		const rule = ruleSet[ruleIndex];
		if (!_.has(rule, "target")) {
			continue;
		}

		const targetSequence = mapOrdinals(rule.target, ordinalColours);
		const hasTransitionOnTargetRule = _.has(rule, "transitionTarget");
		const transitionOnTarget = rule.transitionTarget;
		const isTarget = matchesTarget(targetSequence[targetIndex], t.col, t.face, mirroring);
		const isTransitionTarget = hasTransitionOnTargetRule && matchesTarget(transitionOnTarget[transitionOnTargetIndex], t.col, t.face, mirroring);

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
				if (isTransitionTarget) {
					i --; // check the transition target does not match the new rule target
					continue;
				}
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