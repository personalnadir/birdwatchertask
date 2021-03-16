import {
  NEXT_TASK_STATE,
  NEXT_BLOCK,
  SWITCH_MODE,
  SHOW_TIMEOUT,
  HIDE_TIMEOUT,
  REGENERATE_BLOCK,
  COUNTER_BALACE
} from "../taskactions";

import gen from '../../generatetrials';

import {
  TYPE_TUTORIAL,
  TYPE_RANDOMISED,
  TYPE_NONRANDOMISED,
  TASK_FLOW
} from "../taskconstants";


import parse from '../../ruleparser';
import genRuleBlocks from '../../ruleblockparser';
import {COLOURS} from '../../constants';
import _ from 'underscore';

let ruleSets = parse(_.shuffle(COLOURS));
const initialState = {
  taskPhaseIndex: 0,
  currentBlock: 0,
  mode: TYPE_TUTORIAL
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
    case SWITCH_MODE:
      return {
        ...state,
        mode:action.mode,
        taskPhaseIndex: 0,
        currentBlock: 0,
        lastBlock: false
      };
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
    case REGENERATE_BLOCK:
      let blocks = state.blocks;
      ruleSets = parse(_.shuffle(COLOURS));
      blocks[state.mode] = gen(genRuleBlocks(state.mode, ruleSets, state.counterBalanceA));
      return {
        ...state,
        blocks
      };
    case COUNTER_BALACE: {
      const blocks = {
        [TYPE_TUTORIAL]:gen(genRuleBlocks(TYPE_TUTORIAL, ruleSets, action.counterBalanceA)),
        [TYPE_RANDOMISED]:gen(genRuleBlocks(TYPE_RANDOMISED, ruleSets, action.counterBalanceA)),
        [TYPE_NONRANDOMISED]:gen(genRuleBlocks(TYPE_NONRANDOMISED, ruleSets, action.counterBalanceA)),
      };
      // check in case tutorial only has one block
      const lastBlock = blocks[TYPE_TUTORIAL].length === state.currentBlock + 1;

      return {
        ...state,
        blocks,
        counterBalanceA: action.counterBalanceA,
        lastBlock
      };
    }
    default:
      return state;
  }
};
