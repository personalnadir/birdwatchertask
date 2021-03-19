import {
	COLOURS,
	MIN_ANIMALS_PER_BLOCK,
	MAX_ANIMALS_PER_BLOCK,
	LOOKING_LEFT,
	DIRECTIONS
} from './constants';

import {
	countRuleTransitions,
	countNumRuleTransitions
} from './applyrulestotrials';
import _ from 'underscore';

const geneticCreatures = 50;

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
}

function generateRandomTrials(varyFacing) {
	const numTrials = getRandomInt(MIN_ANIMALS_PER_BLOCK, MAX_ANIMALS_PER_BLOCK);

	const trials = Array(numTrials);
	for (let k = numTrials - 1; k >= 0; k--) {
		trials[k] = {
			col: COLOURS[getRandomInt(0,COLOURS.length)],
			face: varyFacing? DIRECTIONS[getRandomInt(0,DIRECTIONS.length)]: LOOKING_LEFT
		};
	}
	return trials;
}

function crossOver(mum, dad) {
	let trials = new Array(getRandomInt(MIN_ANIMALS_PER_BLOCK, MAX_ANIMALS_PER_BLOCK));
	const parents = [mum, dad];
	for (let i = 0; i < trials.length; i++) {
		const p = parents[getRandomInt(0, 2)];
		if (i >= p.length) {
			trials[i] = COLOURS[getRandomInt(0,COLOURS.length)];
		} else {
			trials[i] = p[i];
		}
	}
	if (Math.random() < 0.05) {
		return _.shuffle(trials);
	}

	return trials;
}

function generateBlockTrials(rules) {
	let population = new Array(geneticCreatures);
	for (let i = 0; i < geneticCreatures; i++) {
		population[i] = generateRandomTrials();
	}

	let numTransitionsDesired = population.map(trials => countNumRuleTransitions(rules, trials));

	let count = 0;
	while (true) {
		count ++;
		if (count > 500) {
			console.log(rules, "Perfect match not generated for rule");
			return;
		}
		let transitionCounts = population.map(trials => countRuleTransitions(rules, trials));
		let transitionBitmaps = transitionCounts.map(counts => counts.map(n => Math.min(1, n)));
		let perfectMatch = _.findIndex(transitionBitmaps, (bits, index) => {
			let numTransitions = 0;
			for (let i = 0; i < bits.length; i++) {
				if (bits[i]) {
					numTransitions ++;
				}
			}
			return numTransitions === numTransitionsDesired[index];
		});
		if (perfectMatch >= 0) {
			return population[perfectMatch];
		}

		const fitnesses = transitionBitmaps.map(bits => bits.reduce((m, n) => m +n, 0));

		const indexesFitnesses = _.zip(_.range(fitnesses.length), fitnesses);
		indexesFitnesses.sort((a, b) => a[1] < b[1]? -1 : 1);
		const probablityOfDeath = indexesFitnesses.map((iFitness, rank) => 1 - rank/geneticCreatures);
		const isDead = probablityOfDeath.map(prob => Math.random() < prob);
		const notDeadList = new Array(geneticCreatures);
		let numNotDead = 0;
		for (let i = 0; i < geneticCreatures; i++) {
			const dead = isDead[i];
			const populationIndex = indexesFitnesses[i][0];
			if (!dead) {
				notDeadList[numNotDead] = populationIndex;
				numNotDead++;
				continue;
			}
			population[populationIndex] = null;
		}

		for (let i = 0; i < geneticCreatures; i++) {
			if (population[i]) {
				continue;
			}
			const mum = population[notDeadList[getRandomInt(0, numNotDead)]];
			const dad = population[notDeadList[getRandomInt(0, numNotDead)]];
			population[i] = crossOver(mum, dad);
		}
	}
}

// eslint-disable-next-line import/no-anonymous-default-export
export default (ruleSets) => {
	let blocks = [];
	for (var i = 0; i < ruleSets.length; i++) {

		blocks[i] = {
			trials: generateBlockTrials(ruleSets[i].rules),
			rules: ruleSets[i]
		};
	}
	return blocks;
};