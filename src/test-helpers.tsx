import * as React from "react"
import * as shallowRenderer from "react-test-renderer/shallow"
import { IState, initialState } from "./reducers/index"
import { Provider } from "react-redux"
import * as deepRenderer from "react-test-renderer"
import { createStore } from "redux"
import { install, StoreCreator } from "redux-loop"
import { reducer } from "./reducers/index"

const enhancedCreateStore = createStore as StoreCreator

// TODO(sbdchd): this type seems wrong
const store = enhancedCreateStore(reducer, initialState, install())
// tslint:disable-next-line no-any
type TestComponent = React.ReactElement<any>

export function renderComponentShallow(component: TestComponent) {
  return shallowRenderer.createRenderer().render(component)
}

export function renderComponent(
  component: TestComponent,
  _state: IState = initialState
) {
  return deepRenderer.create(<Provider store={store}>{component}</Provider>)
}
