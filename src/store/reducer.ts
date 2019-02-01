import { LoopReducer, Cmd, loop, Loop } from "redux-loop"
import * as api from "../api"
import { getType } from "typesafe-actions"

import {
  createStandardAction,
  ActionType,
  createAsyncAction
} from "typesafe-actions"

export const incrementCounter = createStandardAction("INCREMENT_COUNTER")()
export const resetCounter = createStandardAction("RESET_COUNTER")()

export const saveCount = createAsyncAction(
  "SAVE_COUNT_REQUEST",
  "SAVE_COUNT_SUCCESS",
  "SAVE_COUNT_ERROR"
)<void, number, Error>()

export const loadCount = createAsyncAction(
  "LOAD_COUNT_REQUEST",
  "LOAD_COUNT_SUCCESS",
  "LOAD_COUNT_ERROR"
)<void, number, Error>()

export type Action =
  // UI actions
  | ActionType<typeof incrementCounter>
  | ActionType<typeof resetCounter>
  // API Requests
  | ActionType<typeof saveCount>
  | ActionType<typeof loadCount>

export const enum Status {
  None = 0,
  Loading = 1,
  Saving = 2
}

export interface IState {
  readonly count: number
  readonly status: Status
  readonly error?: Error
}

export const initialState: IState = {
  count: 0,
  status: Status.None,
  error: undefined
}

export const reducer: LoopReducer<IState, Action> = (
  state: IState = initialState,
  action: Action
): IState | Loop<IState, Action> => {
  switch (action.type) {
    case getType(incrementCounter):
      return { ...state, count: state.count + 1 }
    case getType(resetCounter):
      return { ...state, count: 0 }
    case getType(loadCount.request):
      return loop(
        { ...state, status: Status.Loading },
        Cmd.run(api.load, {
          successActionCreator: loadCount.success,
          failActionCreator: loadCount.failure
        })
      )
    case getType(loadCount.success):
      return { ...state, count: action.payload, status: Status.None }
    case getType(loadCount.failure):
      return { ...state, error: action.payload, status: Status.None }
    case getType(saveCount.request):
      return loop(
        { ...state, status: Status.Loading },
        Cmd.run(api.save, {
          successActionCreator: saveCount.success,
          failActionCreator: saveCount.failure,
          args: [state.count]
        })
      )
    case getType(saveCount.success):
      return { ...state, status: Status.None }
    case getType(saveCount.failure):
      return { ...state, error: action.payload, status: Status.None }
    default:
      return state
  }
}
