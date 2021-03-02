import {
  NEXT_APP_STATE,
  NEXT_INSTRUCTIONS_PAGE
} from "../applicationactions";

const initialState = {
  appStateIndex: 0,
  instructionPage: 0
};

export default function(state = initialState, action) {
  switch (action.type) {
    case NEXT_APP_STATE:
      return {
        ...state,
        appStateIndex: state.appStateIndex + 1,
      };
    case NEXT_INSTRUCTIONS_PAGE:
      return {
        ...state,
        instructionPage: state.instructionPage + 1
      };
    default:
      return state;
  }
};
