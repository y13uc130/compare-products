import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';

import boards from '../services/Boards/BoardsReducers';

const reducers = {
  boards
};

export default (history) => combineReducers({ router: connectRouter(history), ...reducers });
