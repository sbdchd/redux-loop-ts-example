import { createStore, compose, StoreEnhancer } from "redux"
import * as React from "react"
import * as ReactDOM from "react-dom"
import { Provider } from "react-redux"
import { install, StoreCreator } from "redux-loop"
import { initialState, reducer, IState } from "./store/reducer"

import App from "./components/Counter"

const enhancedCreateStore = createStore as StoreCreator

const enhancer: StoreEnhancer<IState> = (window as any)
  .__REDUX_DEVTOOLS_EXTENSION__
  ? compose(
      install(),
      (window as any).__REDUX_DEVTOOLS_EXTENSION__()
    )
  : install()

const store = enhancedCreateStore(reducer, initialState, enhancer)

const Root = () => (
  <Provider store={store}>
    <App />
  </Provider>
)

const rootEl = document.getElementById("root")
ReactDOM.render(<Root />, rootEl)
