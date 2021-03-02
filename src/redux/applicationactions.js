export const NEXT_APP_STATE = 'application/nextAppState';

export const goToNextApplicationState = ()=> ({
	type: NEXT_APP_STATE
});

export const NEXT_INSTRUCTIONS_PAGE = 'application/nextInstruction';

export const nextInstructionPage = ()=> ({
	type: NEXT_INSTRUCTIONS_PAGE
});
