import {
  NEXT_TASK_STATE,
  NEXT_BLOCK,
  SWITCH_MODE
} from "../taskactions";

import gen from '../../generatetrials';

import {
  TASK_RULE,
  TASK_PROPER,
  TYPE_TUTORIAL,
  TYPE_MAIN,
  TASK_FLOW,
} from "../taskconstants";

const initialState = {
  taskPhaseIndex: 0,
  currentBlock: 0,
  mode: TYPE_TUTORIAL,
  blocks: {
    [TYPE_TUTORIAL]:gen(),
    [TYPE_MAIN]:gen()
  }
};

// eslint-disable-next-line import/no-anonymous-default-export
export default function(state = initialState, action) {
  switch (action.type) {
  case NEXT_TASK_STATE:
      return {
        ...state,
        taskPhaseIndex: (state.taskPhaseIndex + 1) % TASK_FLOW.length,
      };
    case NEXT_BLOCK:
      const blockIndex = state.currentBlock + 1;
      const phaseIndex = state.taskPhaseIndex;

      const lastBlock = blockIndex >= state.blocks[state.mode].length;
      return {
        ...state,
        lastBlock,
        currentBlock: blockIndex,
        taskPhaseIndex: phaseIndex
      };
    case SWITCH_MODE:
      return {
        ...state,
        mode:action.mode,
        taskPhaseIndex: 0,
        currentBlock: 0,
        lastBlock: false
      };
    default:
      return state;
  }
};
