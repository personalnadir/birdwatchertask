import rulesConfig from './data/rules.json';
import _ from 'underscore';
import {
	HUMAN_READABLE_COLOURS,
	HUMAN_READABLE_KEYS,
	USER_INPUT_SKIP,
	USER_INPUT_PHOTO
} from './constants';

import {
  TYPE_TUTORIAL,
  TYPE_MAIN,
} from "./redux/taskconstants";

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

const keyAct = /\{key_act\}/g;
const keySkip = /\{key_skip\}/g;

const isOr = /([a-d])\|([a-d])/g;
const isNot = /!([a-d])/g;
const anySymbol = /\*/g;
const specifcSymbol = /([a-d])/g;
const number = /([1-4])/g;

const processSymbol = symbol => {
	let array = [...symbol.matchAll(isOr)];
	if (array.length > 0) {
		return [ruleSymbols[array[0][1]],ruleSymbols[array[0][2]]];
	}
	array = [...symbol.matchAll(isNot)];
	if (array.length > 0) {
		const exclude = ruleSymbols[array[0][1]];
		let include = [];
		for (const letter in ruleSymbols) {
			const letterCode = ruleSymbols[letter];
			if (letterCode === exclude) {
				continue;
			}
			include.push(letterCode);
		}

		return include;
	}
	array = [...symbol.matchAll(anySymbol)];
	if (array.length > 0) {
		return Object.values(ruleSymbols);
	}

	array = [...symbol.matchAll(specifcSymbol)];
	if (array.length > 0) {
		return [ruleSymbols[array[0][1]]];
	}
	array = [...symbol.matchAll(number)];
	if (array.length > 0) {
		return [ruleSymbols[array[0][1]]];
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

const generateInstructions = (humanReadableExplanation, colourOrder, variableValues) => {
	let processedText = humanReadableExplanation;
	for (const [col, reKey] of _.zip(colourOrder, colourKeys)) {
		processedText = processedText.replace(reKey, HUMAN_READABLE_COLOURS[col]);
	}

	for (const valName in variableValues) {
		processedText = processedText.replace(new RegExp(`{${valName}}`,'g'), variableValues[valName]);
	}
	processedText = processedText.replace(keyAct, HUMAN_READABLE_KEYS[USER_INPUT_PHOTO]);
	processedText = processedText.replace(keySkip, HUMAN_READABLE_KEYS[USER_INPUT_SKIP]);
	return processedText;
};

const generateRules = (rules, colourOrder) => {
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
	  			target.push(processSymbol(symbol).map(
  					i => i >= 0? colourOrder[i]: Math.abs(symbol) - 1
	  			));
			}
			rule.target = target;
		}

		if (transitionOnTargetSpecified) {
			let transitionOnTarget = [];
	  		for (const symbol of rule.transitionOnTarget) {
	  			transitionOnTarget.push(processSymbol(symbol).map(
  					i => i >= 0? colourOrder[i]: Math.abs(symbol) - 1
	  			));
			}
			delete rule.transitionOnTarget;
			rule.transitionTarget = transitionOnTarget;
		}
	}

	return processedRules;
};

// eslint-disable-next-line import/no-anonymous-default-export
export default (colourOrder) => {
	let processedRules = {};

	for (const ruleName in rulesConfig) {
		const {humanReadableExplanation, variables, rules} = rulesConfig[ruleName];
		const variableValues = getVariables(variables, rules);
		const instruction = generateInstructions(humanReadableExplanation, colourOrder, variableValues);
		const translatedRules = generateRules(rules, colourOrder);
		processedRules[ruleName] = {
			text: instruction,
			rules: translatedRules,
			name: ruleName
		};
	}

	return processedRules;
};