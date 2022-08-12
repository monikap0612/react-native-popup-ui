// Imports: Dependencies
import AsyncStorage from '@react-native-community/async-storage';
// import { configureStore } from '@reduxjs/toolkit';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { createLogger } from 'redux-logger';
import { persistStore, persistReducer } from 'redux-persist';
// Imports: Redux
import rootReducer from './reducers';

const middleware = [thunk];

middleware.push(createLogger());

// Middleware: Redux Persist Config
const persistConfig = {
  // Root
  key: 'root',
  // Storage Method (React Native)
  storage: AsyncStorage,
  // Whitelist (Save Specific Reducers)
  whitelist: ['theme', 'auth', 'notification', 'charging'],
  // Blacklist (Don't Save Specific Reducers)
};
// Middleware: Redux Persist Persisted Reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);
// Redux: Store
const store = createStore(persistedReducer, applyMiddleware(...middleware));
// Middleware: Redux Persist Persister
let persistor = persistStore(store);
// Exports
export { store, persistor };