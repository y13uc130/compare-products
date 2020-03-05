import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import createRootReducer from './rootReducer';

export default (history, initialState) => {
  const store = createStore(createRootReducer(history),applyMiddleware(thunk),initialState);

  return store;
};
