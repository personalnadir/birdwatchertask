import {
  NEXT_TASK_STATE,
  NEXT_BLOCK,
  SWITCH_MODE
} from "../taskactions";

import gen from '../../generatetrials';

import {
  TYPE_TUTORIAL,
  TYPE_MAIN,
  TASK_FLOW,
} from "../taskconstants";


import parse from '../../ruleparser';
import genRuleBlocks from '../../ruleblockparser';
import {COLOURS} from '../../constants';

const ruleSets = parse(COLOURS);
const initialState = {
  taskPhaseIndex: 0,
  currentBlock: 0,
  mode: TYPE_TUTORIAL,
  blocks: {
    [TYPE_TUTORIAL]:gen(genRuleBlocks(TYPE_TUTORIAL, ruleSets)),
    [TYPE_MAIN]:gen(genRuleBlocks(TYPE_MAIN, ruleSets))
  }
};

// check in case tutorial only has one block
initialState.lastBlock = initialState.blocks[TYPE_TUTORIAL].length === initialState.currentBlock + 1;

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

      const lastBlock = blockIndex + 1 >= state.blocks[state.mode].length;
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
