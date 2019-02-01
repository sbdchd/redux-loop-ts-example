import * as React from "react"
import { connect, Dispatch } from "react-redux"
import { bindActionCreators } from "redux"
import {
  IState,
  saveCount,
  loadCount,
  incrementCounter,
  Status
} from "../store/reducer"

interface IComponentProps {
  readonly count: number
  readonly status: Status
  readonly error: Error | undefined
  readonly load: () => void
  readonly save: () => void
  readonly increment: () => void
}

function App({ count, increment, status, save, load }: IComponentProps) {
  return (
    <main>
      <h1>{count}</h1>
      <button onClick={increment}>increment</button>
      <button disabled={status === Status.Saving} onClick={save}>
        {status === Status.Saving ? "saving..." : "save"}
      </button>
      <button disabled={status === Status.Loading} onClick={load}>
        {status === Status.Loading ? "loading..." : "load"}
      </button>
    </main>
  )
}

function mapStateToProps(state: IState) {
  return {
    count: state.count,
    status: state.status,
    error: state.error
  }
}

function mapDispatchToProps(dispatch: Dispatch<IState>) {
  return bindActionCreators(
    {
      load: loadCount.request,
      save: saveCount.request,
      increment: incrementCounter
    },
    dispatch
  )
}

export const CounterContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(App)
