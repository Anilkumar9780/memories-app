import React from 'react';
import ReactDOM from 'react-dom';

// redux packages
import { Provider } from 'react-redux';
import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';

// component
import { App } from './App';
import { reducers } from './reducers';

// style
import './index.css';

// store
const store = createStore(reducers, compose(applyMiddleware(thunk)));

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root'),
);
