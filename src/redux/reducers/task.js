import {
  NEXT_TASK_STATE,
  NEXT_TRIAL,
} from "../taskactions";

import gen from '../../generatetrials';

import {
  TASK_RULE,
  TASK_PROPER,
  TASK_FLOW,
} from "../taskconstants";

const initialState = {
  taskPhaseIndex: 0,
  currentTrial: 0,
  currentBlock: 0,
  blocks: gen()
};

export default function(state = initialState, action) {
  switch (action.type) {
  case NEXT_TASK_STATE:
      return {
        ...state,
        taskPhaseIndex: (state.taskPhaseIndex + 1) % TASK_FLOW.Length,
      };
    case NEXT_TRIAL:
      let nextTrial = state.currentTrial + 1;
      let blockIndex = state.currentBlock;
      let phaseIndex = state.taskPhaseIndex;

      const block = state.blocks[blockIndex];
      if (nextTrial >= block.length) {
        nextTrial = 0;
        blockIndex ++;
        phaseIndex = 0;
      }
      return {
        ...state,
        currentTrial: nextTrial,
        currentBlock: blockIndex,
        taskPhaseIndex: phaseIndex
      };
    default:
      return state;
  }
};
