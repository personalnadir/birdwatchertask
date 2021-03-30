import {
  STORE_TRIAL,
  SET_USER_ID,
  SET_READING_TIME
} from "../dataactions";

const initialState = {
  data: []
};

export default function(state = initialState, action) {
  switch (action.type) {
    case STORE_TRIAL:
      let {data} = state;
      const {
        userAction,
        block,
        mode,
        stimuliColour,
        stimuliDirection,
        correctAction,
        rule,
        attempts,
        reactionTime,
        startTime,
        time
      } = action;
      data.push({
        userAction,
        block,
        mode,
        stimuliColour,
        stimuliDirection,
        correctAction,
        rule,
        attempts,
        reactionTime,
        startTime,
        time,
      });
      return {
        ...state,
        data: data,
      };
    case SET_USER_ID:
      return {
        ...state,
        user: action.id
      };
    case SET_READING_TIME:
      return {
        ...state,
        readingTime: action.time
      };
    default:
      return state;
  }
};
