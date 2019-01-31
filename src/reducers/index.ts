import { LoopReducer, Cmd, loop, Loop } from 'redux-loop';
import { api } from '../api';
import { getType } from 'typesafe-actions';

import { createStandardAction, ActionType, createAsyncAction } from 'typesafe-actions'

export const incrementCounter = createStandardAction('INCREMENT_COUNTER')()
export const resetCounter = createStandardAction('RESET_COUNTER')()

export const saveCount = createAsyncAction(
  "SAVE_COUNT_REQUEST",
  "SAVE_COUNT_SUCCESS",
  "SAVE_COUNT_ERROR",
)<number, number, Error>()

export const loadCount = createAsyncAction(
  "LOAD_COUNT_REQUEST",
  "LOAD_COUNT_SUCCESS",
  "LOAD_COUNT_ERROR",
)<void, number, Error>()

export type Action =
  // UI actions
  | ActionType<typeof incrementCounter>
  | ActionType<typeof resetCounter>
  // API Requests
  | ActionType<typeof saveCount>
  | ActionType<typeof loadCount>

export interface IState {
  readonly counter: number;
  readonly isSaving: boolean;
  readonly isLoading: boolean;
  readonly error?: Error
};

export const initialState: IState = {
  counter: 0,
  isSaving: false,
  isLoading: false,
  error: undefined,
};

export const reducer: LoopReducer<IState, Action> = (
  state: IState = initialState,
  action: Action
): IState | Loop<IState, Action> => {
  switch (action.type) {
    case getType(incrementCounter):
      return { ...state, counter: state.counter + 1 };
    case getType(resetCounter):
      return { ...state, counter: 0 };
    case getType(loadCount.request):
      return loop(
        { ...state, isLoading: true },
        Cmd.run(api.load, {
          successActionCreator: loadCount.success,
          failActionCreator: loadCount.failure,
        })
      );
    case getType(loadCount.success):
      return { ...state, isLoading: false, counter: action.payload };
    case getType(loadCount.failure):
      return { ...state, error: action.payload, isLoading: false };
    case getType(saveCount.request):
      return loop(
        { ...state, isSaving: true },
        Cmd.run(api.save, {
          successActionCreator: saveCount.success,
          failActionCreator: saveCount.failure,
          args: [action.payload],
        })
      );
    case getType(saveCount.success):
      return { ...state, isSaving: false };
    case getType(saveCount.failure):
      return { ...state, error: action.payload, isSaving: false };
    default:
      return state;
  }
};
