import {
	COLOURS,
	MIN_ANIMALS_PER_BLOCK,
	MAX_ANIMALS_PER_BLOCK,
	NUM_BLOCKS
} from './constants';

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
}

export default () => {
	let blocks = [];
	for (var i = NUM_BLOCKS - 1; i >= 0; i--) {
		const numTrials = getRandomInt(MIN_ANIMALS_PER_BLOCK, MAX_ANIMALS_PER_BLOCK);

		const trials = Array(numTrials);
		for (let k = numTrials - 1; k >= 0; k--) {
			trials[k] = COLOURS[getRandomInt(0,COLOURS.length)];
		}
		blocks[i] = trials;
	}
	return blocks;
};