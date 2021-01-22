import blocksConfig from './data/ruleblocks.json';

import {
  TYPE_TUTORIAL,
  TYPE_MAIN,
} from "./redux/taskconstants";

const createBlocks = (type, ruleSets) => {
	const typeConverter = {
		[TYPE_MAIN]: "main",
		[TYPE_TUTORIAL]: "tutorial"
	};

	const blockStructure = blocksConfig[typeConverter[type]];
	const blockOrder = blockStructure.ruleOrder;

	let orderedRules = [];

	for (let i = 0; i < blockOrder.length; i++){
		const rule = ruleSets[blockOrder[i]];
		console.assert(rule, `No rule with name ${blockOrder[i]} found in rules.json`);
		orderedRules[i] = rule;
	}
	return orderedRules;
};

export default createBlocks;