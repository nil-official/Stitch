import { combineReducers, legacy_createStore, applyMiddleware } from 'redux';
import { thunk } from 'redux-thunk';
import { createLogger } from 'redux-logger';
import cartReducers from './customer/cart/cartReducers';

const rootReducers = combineReducers({
    cartState: cartReducers,
});

const middlewares = [thunk];

if (process.env.NODE_ENV === 'development') {
    const logger = createLogger({
        collapsed: true,
        diff: true,
    });
    middlewares.push(logger);
}

export const store = legacy_createStore(
    rootReducers,
    applyMiddleware(...middlewares),
);