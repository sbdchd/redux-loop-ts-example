import { createStore, compose, StoreEnhancer } from 'redux';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { install, StoreCreator } from 'redux-loop';
import { initialState, reducer, IState } from './reducers';

import { CounterContainer } from './components/counter';

const enhancedCreateStore = createStore as StoreCreator;

const enhancer: StoreEnhancer<IState> = window.__REDUX_DEVTOOLS_EXTENSION__ ? compose(
  install(),
  window.__REDUX_DEVTOOLS_EXTENSION__({
    serialize: {
      options: true,
    },
  })
) : compose(install())

const store = enhancedCreateStore(reducer, initialState, enhancer);

const Root = () => (
  <Provider store={store}>
    <CounterContainer />
  </Provider>
);

const rootEl = document.getElementById('root');
ReactDOM.render(<Root />, rootEl);
