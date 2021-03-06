import {
  NEXT_TASK_STATE,
  NEXT_BLOCK,
  NEXT_MODE,
  SHOW_TIMEOUT,
  HIDE_TIMEOUT,
  REGENERATE_BLOCK,
  COUNTER_BALACE
} from "../taskactions";

import gen from '../../generatetrials';

import {
  TASK_FLOW
} from "../taskconstants";


import parse from '../../ruleparser';
import {
  createBlocks as genRuleBlocks,
  getBlockNames
} from '../../ruleblockparser';
import {COLOURS} from '../../constants';

let ruleSets = parse(COLOURS);
const initialState = {
  taskPhaseIndex: 0,
  currentBlock: 0,
  mode: 0
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

      const lastBlock = blockIndex + 1 >= state.blocks[state.mode].length;
      return {
        ...state,
        lastBlock,
        currentBlock: blockIndex,
        taskPhaseIndex: phaseIndex
      };
    case NEXT_MODE: {
      if (action.currentMode !== state.mode) {
        return state;
      }
      const newMode = action.currentMode + 1;
      const blockNames = getBlockNames();
      const lastMode = newMode + 1 >= blockNames.length;
      const lastBlock = state.blocks[newMode].length === 1;

      return {
        ...state,
        mode: newMode,
        taskPhaseIndex: 0,
        currentBlock: 0,
        lastMode: lastMode,
        lastBlock
      };
    }
    case SHOW_TIMEOUT:
      return {
        ...state,
        timeout:true
      };
    case HIDE_TIMEOUT:
      return {
        ...state,
        timeout:false
      };
    case REGENERATE_BLOCK: {
      let blocks = state.blocks;
      ruleSets = parse(COLOURS);
      const blockNames = getBlockNames();
      blocks[state.mode] = gen(genRuleBlocks(blockNames[state.mode], ruleSets, state.counterBalanceA));
      return {
        ...state,
        blocks
      };

    }
    case COUNTER_BALACE: {
      const blockNames = getBlockNames();
      const blocks = blockNames.map(n => gen(genRuleBlocks(n, ruleSets, action.counterBalanceA)));
      // check in case tutorial only has one block
      const lastBlock = blocks[state.mode].length === state.currentBlock + 1;

      return {
        ...state,
        blocks,
        counterBalanceA: action.counterBalanceA,
        lastBlock,
        lastMode: blocks.length === state.mode + 1
      };
    }
    default:
      return state;
  }
};
