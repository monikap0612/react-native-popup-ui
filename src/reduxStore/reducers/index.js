import { combineReducers } from 'redux';
import { LOGOUT_REQUEST } from 'reduxStore/actions/ActionTypes';

import theme from './theme';
import auth from './auth';
import home from './home';
import notification from './notification';
import charging from './charging';

// Redux: Root Reducer
const appReducer = combineReducers({
  theme,
  auth,
  home,
  notification,
  charging
});

const rootReducer = (state, action) => {
  if (action.type === LOGOUT_REQUEST) {
    return appReducer(undefined, action)
  }

  return appReducer(state, action)
}

export default rootReducer;