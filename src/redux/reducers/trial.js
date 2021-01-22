import {
  SHOW_ITI,
  SHOW_STIMULUS,
  SHOW_FEEDBACK,
  NEXT_TRIAL,
  SET_TRIAL_STIMULI,
  REGISTER_INPUT
} from "../trialactions";

import {
  TRIAL_FEEDBACK,
  TRIAL_ITI,
  TRIAL_STIMULUS,
  TRIAL_FLOW,
} from "../trialconstants";

import {processTrials} from '../../applyrulestotrials';

const initialState = {
  trialPhaseIndex: 0,
  currentTrial: 0,
  feedbackType:false,
  stimuli: [],
  complete: true,
  correctAction: []
};

// eslint-disable-next-line import/no-anonymous-default-export
export default function(state = initialState, action) {
  switch (action.type) {
    case SET_TRIAL_STIMULI:
      return {
        ...state,
        currentTrial: 0,
        trialPhaseIndex: 0,
        stimuli: action.stimuli,
        complete: false,
        correctAction: processTrials(action.rule, action.stimuli)
      };
    case SHOW_ITI:
      return {
        ...state,
        trialPhaseIndex: TRIAL_FLOW.indexOf(TRIAL_ITI),
      };
    case SHOW_FEEDBACK:
      return {
        ...state,
        trialPhaseIndex: TRIAL_FLOW.indexOf(TRIAL_FEEDBACK),
      };
    case SHOW_STIMULUS:
      return {
        ...state,
        trialPhaseIndex: TRIAL_FLOW.indexOf(TRIAL_STIMULUS),
      };
    case NEXT_TRIAL:
      let nextTrial = state.currentTrial + 1;
      let complete = nextTrial >= state.stimuli.length - 1;
      if (nextTrial >= state.stimuli.length) {
        nextTrial = 0;
      }
      return {
        ...state,
        currentTrial: nextTrial,
        complete
      };
    case REGISTER_INPUT:
      const correct = state.correctAction[state.currentTrial] === action.optionSelected;
      return {
        ...state,
        correct,
        optionSelected: action.optionSelected,
        trialPhaseIndex: TRIAL_FLOW.indexOf(TRIAL_FEEDBACK)
      };
    default:
      return state;
  }
};
