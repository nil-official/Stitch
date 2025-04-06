import { combineReducers, legacy_createStore, applyMiddleware, compose } from 'redux';
import { thunk } from 'redux-thunk';
import { createLogger } from 'redux-logger';
import authReducer from './auth/reducer';
import cartReducers from './customer/cart/cartReducers';
import searchProductsReducers from './customer/search/searchProductsReducers';
import searchFiltersReducers from './customer/search/searchFiltersReducers';

const rootReducers = combineReducers({
    auth: authReducer,
    cartState: cartReducers,
    searchProductsState: searchProductsReducers,
    searchFiltersState: searchFiltersReducers,
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