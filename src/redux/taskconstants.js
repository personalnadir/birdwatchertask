import {
	NORMAL_ITI_MILLIS,
	FAST_ITI_MILLIS
} from '../constants';

export const TASK_RULE = 'TASK_RULE';
export const TASK_PROPER = 'TASK_PROPER';
export const TASK_TIMEOUT = 'TASK_TIMEOUT';
export const TYPE_TUTORIAL = 'TYPE_TUTORIAL';
export const TYPE_RANDOMISED = 'TYPE_RANDOMISED';
export const TYPE_NONRANDOMISED = 'TYPE_NONRANDOMISED';

export const TASK_FLOW = [
	TASK_RULE,
	TASK_PROPER
];

export const STIMULI_BIRD = 'STIMULI_BIRD';
export const STIMULI_SNAKE = 'STIMULI_SNAKE';
export const STIMULI_SPIDER = 'STIMULI_SPIDER';

export const HUMAN_READABLE_STIMULI = {
	[STIMULI_BIRD]: {singular: "bird", plural: "birds"},
	[STIMULI_SNAKE]: {singular: "snake", plural: "snakes"},
	[STIMULI_SPIDER]: {singular: "spider", plural: "spiders"},
};

export const MODE_STIMULI = {
	[TYPE_TUTORIAL]: STIMULI_BIRD,
	[TYPE_RANDOMISED]: STIMULI_BIRD,
	[TYPE_NONRANDOMISED]: STIMULI_SNAKE
};

export const MODE_ITI = {
	[TYPE_TUTORIAL]: NORMAL_ITI_MILLIS,
	[TYPE_RANDOMISED]: NORMAL_ITI_MILLIS,
	[TYPE_NONRANDOMISED]: FAST_ITI_MILLIS
};