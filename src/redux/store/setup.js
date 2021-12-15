import {applyMiddleware, createStore, combineReducers, compose} from 'redux';
import thunk from 'redux-thunk';
// import SplashScreen from 'react-native-splash-screen';
import rootReducer from './reducers';
import {persistStore, persistReducer} from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {createLogger} from 'redux-logger';
import promise from './promise';
import array from './array';
import whitelist from './whitelist';
// import {goToAuth, goHome} from '../config/navigation';
import createSagaMiddleware from 'redux-saga';
import sagas from './sagas';
export const storeObj = {};
function users(state={}, action = {}) {
  const { type, payload } = action;
  switch (type) {
    case 'KKKKK':
      return {};
      
  
    default:
      return state;
  }
  
}
const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist,
};

export default function setup() {
  const isDev = global.isDebuggingInChrome || __DEV__; // eslint-disable-line
  const sagaMiddleware = createSagaMiddleware();
  const logger = createLogger();

  const middleware = [applyMiddleware(...[thunk,sagaMiddleware, promise, array, logger])];

  // if (isDev) {
  //   middleware.push(
  //     applyMiddleware(require('redux-immutable-state-invariant').default()),
  //   );
  // }
  const reducer = combineReducers(rootReducer);

  const persistedReducer = persistReducer(persistConfig, reducer);

  const store = createStore(persistedReducer, {}, compose(...middleware));
  sagaMiddleware.run(sagas);
  persistStore(store, null, () => {
    console.log('newstore', store.getState());

    // if (store.getState().user.isLoggedIn) {
    //   goHome();
    // } else if (store.getState().user.isIntroScreenWatched) {
    //   goHome();
    // }
    // SplashScreen.hide();
  });

  return store;
}
