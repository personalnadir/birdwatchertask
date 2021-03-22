import {
  SHOW_ITI,
  SHOW_STIMULUS,
  SHOW_FEEDBACK,
  NEXT_TRIAL,
  END_TRIAL,
  SET_TRIAL_STIMULI,
  REGISTER_INPUT,
  INCREASE_ATTEMPTS
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
  attempts: 0,
  stimuli: [],
  complete: true,
  correctAction: [],
  id:0
};

// eslint-disable-next-line import/no-anonymous-default-export
export default function(state = initialState, action) {
  switch (action.type) {
    case SET_TRIAL_STIMULI:
      return {
        ...state,
        id: state.id + 1,
        currentTrial: 0,
        trialPhaseIndex: 0,
        stimuli: action.stimuli,
        complete: false,
        correctAction: processTrials(action.rule, action.stimuli, action.stimuliMirroring)
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
        complete,
        id: state.id + 1
      };
    case END_TRIAL:
      return {
        ...state,
        attempts: 0,
        complete:true,
        id: state.id + 1
      };
    case REGISTER_INPUT:
      const correct = state.correctAction[state.currentTrial] === action.optionSelected;
      return {
        ...state,
        correct,
        optionSelected: action.optionSelected,
        trialPhaseIndex: TRIAL_FLOW.indexOf(TRIAL_FEEDBACK)
      };
    case INCREASE_ATTEMPTS:
      if (action.id !== state.id) {
        return state;
      }
      return {
        ...state,
        attempts: state.attempts + 1,
        id: state.id + 1
      };
    default:
      return state;
  }
};
