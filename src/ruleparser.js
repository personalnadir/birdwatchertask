import rulesConfig from './data/rules.json';
import _ from 'underscore';
import {
	HUMAN_READABLE_COLOURS,
	HUMAN_READABLE_KEYS,
	USER_INPUT_SKIP,
	USER_INPUT_PHOTO,
	LOOKING_LEFT,
	LOOKING_RIGHT,
	HUMAN_READABLE_DIRECTIONS
} from './constants';

import {
	STIMULI_BIRD,
	STIMULI_SNAKE,
	STIMULI_SPIDER,
	HUMAN_READABLE_STIMULI,
} from './redux/taskconstants';

const ruleN = /rules\[(\d)\]\.(\w+)/g;
const colourKeys = [
	/\{a\}/g,
	/\{b\}/g,
	/\{c\}/g,
	/\{d\}/g
];

const ruleSymbols = {
	"a":0,
	"b":1,
	"c":2,
	"d":3,
	"1":-1,
	"2":-2,
	"3":-3,
	"4":-4
};

const directions = {
	"L": LOOKING_LEFT,
	"R": LOOKING_RIGHT
};

const stimuliType = {
	"birds":STIMULI_BIRD,
	"snakes":STIMULI_SNAKE,
	"spiders":STIMULI_SPIDER
};

const allColours = [0,1,2,3];

const keyAct = /\{key_act\}/g;
const keySkip = /\{key_skip\}/g;

const stimulus = /\{stimulus\}/g;
const stimuli = /\{stimuli\}/g;
const facingLeft = /\{L\}/g;
const facingRight = /\{R\}/g;

const isOr = /([a-d][LR]?)\|([a-d][LR]?)/g;
const isNot = /!([a-d][LR]?)/g;
const anySymbol = /\*/g;
const specifcSymbol = /([a-d][LR]?)/g;
const number = /([1-4][LR]?)/g;
const directionOnly = /([LR]?)/g;
const splitSymbol = /([a-d1-4])([LR]?)/g;

const oppositeDirection = {
	[LOOKING_LEFT]: LOOKING_RIGHT,
	[LOOKING_RIGHT]: LOOKING_LEFT
};

const ordinalToColor = (i, colourOrder) => i >= 0? colourOrder[i]: Math.abs(i) - 1;

const splitSymbolDirection = (text, colourOrder) => {
	let array = [...text.matchAll(splitSymbol)];
	const symbol = ordinalToColor(ruleSymbols[array[0][1]], colourOrder);

	return {
		symbol,
		direction: array[0][2]? directions[array[0][2]]: null
	};
};

const processSymbol = (symbol, colourOrder) => {
	let array = [...symbol.matchAll(isOr)];
	if (array.length > 0) {
		const left = splitSymbolDirection(array[0][1], colourOrder);
		const right = splitSymbolDirection(array[0][2], colourOrder);
		return [left, right];
	}
	array = [...symbol.matchAll(isNot)];
	if (array.length > 0) {
		const exclude = splitSymbolDirection(array[0][1], colourOrder);
		let include = [];
		for (const letter in ruleSymbols) {
			if (ruleSymbols[letter] < 0) {
				continue;
			}
			const symbol = ordinalToColor(ruleSymbols[letter], colourOrder);
			if (symbol === exclude.symbol) {
				continue;
			}
			include.push({
				symbol,
				direction: oppositeDirection[exclude.direction]
			});
		}

		return include;
	}
	array = [...symbol.matchAll(anySymbol)];
	if (array.length > 0) {
		return allColours.map(x => ({
			symbol:ordinalToColor(x, colourOrder)
		}));
	}

	array = [...symbol.matchAll(specifcSymbol)];
	if (array.length > 0) {
		return [splitSymbolDirection(array[0][1], colourOrder)];
	}
	array = [...symbol.matchAll(number)];
	if (array.length > 0) {
		return [splitSymbolDirection(array[0][1], colourOrder)];
	}

	array = [...symbol.matchAll(directionOnly)];
	if (array.length > 0) {
		return allColours.map(x => ({
			symbol:ordinalToColor(x, colourOrder),
			direction: directions[array[0][1]]
		}));
	}

	console.error(`Could not parse ${symbol}`);
};

const getVariables = (variables, rules) => {
	let variableValues = {};
	for (const name in variables) {
		let array = [...variables[name].matchAll(ruleN)];
		console.assert(array.length > 0, `ruleparser: no matches found for rule ${name}: ${variables[name]}`);
		console.assert(array.length < 2, `ruleparser: too many matches found for rule ${name}: ${variables[name]}`);
		array = array[0];
		const ruleIndex = Number(array[1]);
		console.assert(!isNaN(ruleIndex), `ruleparser: invalid rule index for  ${name}: ${variables[name]}`);
		const ruleKey = array[2];
		const value = rules[ruleIndex][ruleKey];
		console.assert(typeof value !== 'undefined', `ruleparser: invalid value for  ${name}: ${variables[name]}`);
		variableValues[name] = value;
	}
	return variableValues;
};

const generateInstructions = (humanReadableExplanation, colourOrder, variableValues, stimType, swapInputs) => {
	let processedText = humanReadableExplanation;
	for (const [col, reKey] of _.zip(colourOrder, colourKeys)) {
		processedText = processedText.replace(reKey, HUMAN_READABLE_COLOURS[col]);
	}

	for (const valName in variableValues) {
		processedText = processedText.replace(new RegExp(`{${valName}}`,'g'), variableValues[valName]);
	}
	if (swapInputs) {
		processedText = processedText.replace(keySkip, HUMAN_READABLE_KEYS[USER_INPUT_PHOTO]);
		processedText = processedText.replace(keyAct, HUMAN_READABLE_KEYS[USER_INPUT_SKIP]);
	} else {
		processedText = processedText.replace(keyAct, HUMAN_READABLE_KEYS[USER_INPUT_PHOTO]);
		processedText = processedText.replace(keySkip, HUMAN_READABLE_KEYS[USER_INPUT_SKIP]);
	}
	processedText = processedText.replace(stimulus, HUMAN_READABLE_STIMULI[stimType].singular);
	processedText = processedText.replace(stimuli, HUMAN_READABLE_STIMULI[stimType].plural);
	processedText = processedText.replace(facingLeft, HUMAN_READABLE_DIRECTIONS[LOOKING_LEFT]);
	processedText = processedText.replace(facingRight, HUMAN_READABLE_DIRECTIONS[LOOKING_RIGHT]);

	return processedText;
};

const generateRules = (rules, colourOrder, stimuliMirroring) => {
	let processedRules = JSON.parse(JSON.stringify(rules)); // deep clone
	for (let rule of processedRules) {
		const targetSpecified = _.has(rule, "target");
		const transitionOnTargetSpecified = _.has(rule, "transitionOnTarget");
		if (!targetSpecified && !transitionOnTargetSpecified) {
			continue;
		}
		const transitionSpecified = _.has(rule, "transitionToRule");
		const transitionRequirementsSpecified = _.has(rule,"transitionAfterTargetsMatched");
		console.assert(!transitionSpecified || transitionRequirementsSpecified, `ruleparser: rule ${rule.name} specifies a transition, but no associated limit`);

		if (targetSpecified) {
			let target = [];
	  		for (const symbol of rule.target) {
	  			target.push(processSymbol(symbol, colourOrder));
			}
			rule.target = target;
		}

		if (transitionOnTargetSpecified) {
			let transitionOnTarget = [];
	  		for (const symbol of rule.transitionOnTarget) {
	  			transitionOnTarget.push(processSymbol(symbol, colourOrder));
			}
			delete rule.transitionOnTarget;
			rule.transitionTarget = transitionOnTarget;
		}

		if (_.has(rule, "startCondition")) {
			let condition = [];
	  		for (const symbol of rule.startCondition) {
	  			condition.push(processSymbol(symbol, colourOrder));
			}
			rule.condition = condition;
		}
	}

	return processedRules;
};

// eslint-disable-next-line import/no-anonymous-default-export
export default (colourOrder) => {
	let processedRules = {};

	for (const ruleName in rulesConfig) {
		const {humanReadableExplanation, variables, rules, stimuli, stroop, swapInputs, stimuliMirroring} = rulesConfig[ruleName];
		const stimType = stimuliType[stimuli];
		console.assert(stimType, `ruleparser: invalid stimulus type ${stimuli} defined for rule ${ruleName}`);
		const variableValues = getVariables(variables, rules);
		const instruction = generateInstructions(humanReadableExplanation, colourOrder, variableValues, stimType, swapInputs);
		const translatedRules = generateRules(rules, colourOrder, stimuliMirroring);
		processedRules[ruleName] = {
			text: instruction,
			rules: translatedRules,
			name: ruleName,
			stimuli: stimType,
			stroop,
			swapInputs,
			stimuliMirroring
		};
	}

	return processedRules;
};