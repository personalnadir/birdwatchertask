import {
  NEXT_APP_STATE,
} from "../applicationactions";

const initialState = {
  appStateIndex: 0
};

export default function(state = initialState, action) {
  switch (action.type) {
    case NEXT_APP_STATE:
      return {
        ...state,
        appStateIndex: state.appStateIndex + 1,
      };
    default:
      return state;
  }
};
