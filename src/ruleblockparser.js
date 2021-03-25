import blocksConfig from './data/ruleblocks.json';

import _ from 'underscore';

const getBlockNames = () => blocksConfig.map(cfg => cfg.name);

const createBlocks = (blockName, ruleSets, counterBalanceA) => {
	const blockStructure = _.findWhere(blocksConfig, {name: blockName});
	const blockOrder = blockStructure.ruleOrder;
	const itiTime = blockStructure.iti;

	let orderedRules = [];
	let index = 0;

	const getRule = name => {
		index ++;
		const rule = ruleSets[name];
		console.assert(rule, `No rule with name ${name} found in rules.json`);
		return rule;
	};

	for (let i = 0; i < blockOrder.length; i++){
		const ruleName = blockOrder[i];
		if (typeof ruleName !== "string") {
			const counterBalanceBlock = ruleName;
			console.assert(_.has(counterBalanceBlock, "a"), `ruleblocks.json: ${blockName} - rule ${i} looks like a counter balanced block, but has no 'a' array of rules to balance`);
			console.assert(_.has(counterBalanceBlock, "b"), `ruleblocks.json: ${blockName} - rule ${i} looks like a counter balanced block, but has no 'b' array of rules to balance`);

			const {a, b} = counterBalanceBlock;
			console.assert(_.isArray(a), `ruleblocks.json: ${blockName} - rule ${i}. Key 'a' must be an array of 1 or more rules`);

			console.assert(_.isArray(b), `ruleblocks.json: ${blockName} - rule ${i}. Key 'b' must be an array of 1 or more rules`);

			const order = counterBalanceA?[a, b]: [b, a];
			orderedRules = orderedRules.concat(_.chain(order).flatten().map(getRule).value());
		} else {
			const rule = ruleSets[ruleName];
			console.assert(rule, `No rule with name ${blockOrder[i]} found in rules.json`);
			orderedRules[index] = rule;
			index ++;
		}
	}
	return orderedRules.map(r => ({
		...r,
		iti: itiTime
	}));
};

export {
	createBlocks,
	getBlockNames
};