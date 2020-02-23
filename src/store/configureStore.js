import { createStore, applyMiddleware, compose } from 'redux';
import { routerMiddleware } from 'connected-react-router';
import thunk from 'redux-thunk';
import createRootReducer from './rootReducer';

export default (history, initialState) => {
  const store = createStore(createRootReducer(history),applyMiddleware(thunk),initialState);

  return store;
};
