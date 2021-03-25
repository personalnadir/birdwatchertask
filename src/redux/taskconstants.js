export const TASK_RULE = 'TASK_RULE';
export const TASK_PROPER = 'TASK_PROPER';
export const TASK_TIMEOUT = 'TASK_TIMEOUT';

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
