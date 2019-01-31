import { reducer, IState } from "../index"
import {
  loadCount,
  resetCounter,
  saveCount,
  incrementCounter
} from "../../reducers"
import { api } from "../../api"
import { Cmd, loop } from "redux-loop"

describe("reducer", () => {
  let state: IState

  beforeEach(() => {
    state = {
      counter: 0,
      isSaving: false,
      isLoading: false,
      error: undefined
    }
  })

  it("unknown action should return the initial state", () => {
    expect(reducer(undefined, { type: "noOp" })).toEqual(state)
  })

  it("incrementCounter() should increment counter by 1", () => {
    expect(reducer(undefined, incrementCounter())).toEqual({
      ...state,
      counter: 1
    })
  })

  it("resetCounter() should return the initial state", () => {
    expect(reducer({ ...state, counter: 5 }, resetCounter())).toEqual({
      ...state,
      counter: 0
    })
  })

  describe("loadCount()", () => {
    it("returns an object which deeply equals the object returned by reducer", () => {
      const result = reducer(state, loadCount.request())

      expect(
        loop(
          { ...state, isLoading: true },
          Cmd.run(api.load, {
            successActionCreator: loadCount.success,
            failActionCreator: loadCount.failure
          })
        )
      ).toEqual(result)
    })
  })

  describe("loadCount()", () => {
    it("returns an object which deeply equals the object returned by reducer", () => {
      const result = reducer(state, loadCount.request())

      expect(
        loop(
          { ...state, isLoading: true },
          Cmd.run(api.load, {
            successActionCreator: loadCount.success,
            failActionCreator: loadCount.failure
          })
        )
      ).toEqual(result)
    })
  })

  describe("saveCount()", () => {
    it(" returns an object which deeply equals the object returned by reducer", () => {
      const result = reducer(state, saveCount.request(5))

      expect(
        loop(
          { ...state, isSaving: true },
          Cmd.run(api.save, {
            successActionCreator: saveCount.success,
            failActionCreator: saveCount.failure,
            args: [5]
          })
        )
      ).toEqual(result)
    })
  })
})
