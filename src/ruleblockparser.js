import blocksConfig from './data/ruleblocks.json';

import {
  TYPE_TUTORIAL,
  TYPE_RANDOMISED,
  TYPE_NONRANDOMISED
} from "./redux/taskconstants";
import _ from 'underscore';


const createBlocks = (type, ruleSets, counterBalanceA) => {
	const typeConverter = {
		[TYPE_TUTORIAL]: "tutorial",
		[TYPE_RANDOMISED]: "randomised",
		[TYPE_NONRANDOMISED]: "nonrandomised"
	};

	const blockStructure = blocksConfig[typeConverter[type]];
	const blockOrder = blockStructure.ruleOrder;

	let orderedRules = [];
	let index = 0;

	for (let i = 0; i < blockOrder.length; i++){
		const ruleName = blockOrder[i];
		if (typeof ruleName !== "string") {
			const counterBalanceBlock = ruleName;
			console.assert(_.has(counterBalanceBlock, "a"), `ruleblocks.json: ${typeConverter[type]} - rule ${i} looks like a counter balanced block, but has no 'a' array of rules to balance`);
			console.assert(_.has(counterBalanceBlock, "b"), `ruleblocks.json: ${typeConverter[type]} - rule ${i} looks like a counter balanced block, but has no 'b' array of rules to balance`);

			const {a, b} = counterBalanceBlock;
			console.assert(_.isArray(a), `ruleblocks.json: ${typeConverter[type]} - rule ${i}. Key 'a' must be an array of 1 or more rules`);

			console.assert(_.isArray(b), `ruleblocks.json: ${typeConverter[type]} - rule ${i}. Key 'b' must be an array of 1 or more rules`);

			const order = counterBalanceA?[a, b]: [b, a];
			orderedRules = orderedRules.concat(_.chain(order).flatten().map(n => {
				index ++;
				const rule = ruleSets[n];
				console.assert(rule, `No rule with name ${n} found in rules.json`);
				return rule;
			}).value());
		} else {
			const rule = ruleSets[ruleName];
			console.assert(rule, `No rule with name ${blockOrder[i]} found in rules.json`);
			orderedRules[index] = rule;
			index ++;
		}
	}
	return orderedRules;
};

export default createBlocks;