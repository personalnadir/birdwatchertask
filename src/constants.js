export const COLOUR_RED = 'COLOUR_RED';
export const COLOUR_BLUE = 'COLOUR_BLUE';
export const COLOUR_GREEN = 'COLOUR_GREEN';
export const COLOUR_YELLOW = 'COLOUR_YELLOW';
export const COLOURS = [COLOUR_RED,COLOUR_BLUE,COLOUR_GREEN,COLOUR_YELLOW];
export const LOOKING_LEFT = 'LOOKING_LEFT';
export const LOOKING_RIGHT = 'LOOKING_RIGHT';
export const DIRECTIONS = [LOOKING_LEFT, LOOKING_RIGHT];

export const USER_INPUT_SKIP = 'USER_INPUT_SKIP';
export const USER_INPUT_PHOTO = 'USER_INPUT_PHOTO';
export const MIN_ANIMALS_PER_BLOCK = 5;
export const MAX_ANIMALS_PER_BLOCK = 12;
export const TIMEOUT_MILLIS = 5000;
export const ATTEMPTS_PER_TRIALBLOCK = 3;

export const HUMAN_READABLE_COLOURS = {
	[COLOUR_RED]: 'red',
	[COLOUR_BLUE]: 'blue',
	[COLOUR_GREEN]: 'green',
	[COLOUR_YELLOW]: 'yellow',
};

export const KEYS = {
	[USER_INPUT_SKIP]: "KeyQ",
	[USER_INPUT_PHOTO]: "KeyP",
};

export const HUMAN_READABLE_KEYS = {
	[USER_INPUT_SKIP]: "Q",
	[USER_INPUT_PHOTO]: "P",
};

export const HUMAN_READABLE_DIRECTIONS = {
	[LOOKING_LEFT]: "facing left",
	[LOOKING_RIGHT]: "facing right"
};