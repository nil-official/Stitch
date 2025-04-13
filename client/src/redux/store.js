import { combineReducers, legacy_createStore, applyMiddleware, compose } from 'redux';
import { thunk } from 'redux-thunk';
import { createLogger } from 'redux-logger';
import authReducer from './auth/reducer';
import homeReducer from './customer/home/reducer';
import cartReducer from './customer/cart/reducer';
import searchReducer from './customer/search/reducer';
import filterReducer from './customer/filter/reducer';

const rootReducers = combineReducers({
    auth: authReducer,
    home: homeReducer,
    cart: cartReducer,
    search: searchReducer,
    filter: filterReducer,
});

const middlewares = [thunk];

if (process.env.NODE_ENV === 'development') {
    const logger = createLogger({
        collapsed: true,
        diff: true,
    });
    middlewares.push(logger);
}

const composeEnhancers =
    process.env.NODE_ENV === 'development' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
        ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
        : compose;

export const store = legacy_createStore(
    rootReducers,
    composeEnhancers(applyMiddleware(...middlewares))
);