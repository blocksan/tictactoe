import { applyMiddleware, compose, createStore } from "redux";
import createSagaMiddleware from "redux-saga";

import { setStore } from "../helpers/redux_store_helper";
import rootReducer from "./reducers";
import rootSaga from "./sagas";

const sagaMiddleware = createSagaMiddleware();
const middlewares = [sagaMiddleware];
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export let store;

export function configureStore(initialState) {

  store = createStore(
    rootReducer,
      initialState,
      composeEnhancers(
          applyMiddleware(...middlewares)
      ),
  );
  setStore(store);
  sagaMiddleware.run(rootSaga);
  return store;
}

