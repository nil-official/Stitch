import { combineReducers, legacy_createStore, applyMiddleware, compose } from 'redux';
import { thunk } from 'redux-thunk';
import { createLogger } from 'redux-logger';
import authReducer from './auth/reducer';
import homeReducer from './customer/home/reducer';
import cartReducer from './customer/cart/reducer';
import productReducer from './customer/product/reducer';
import reviewReducer from './customer/review/reducer';
import suggestionsReducer from './customer/suggestions/reducer';
import wishlistReducer from './customer/wishlist/reducer';
import searchReducer from './customer/search/reducer';
import filterReducer from './customer/filter/reducer';
import profileReducer from './customer/profile/reducer';
import addressReducer from './customer/address/reducer';
import orderReducer from './customer/order/reducer';

const rootReducers = combineReducers({
    auth: authReducer,
    home: homeReducer,
    cart: cartReducer,
    product: productReducer,
    review: reviewReducer,
    wishlist: wishlistReducer,
    suggestions: suggestionsReducer,
    search: searchReducer,
    filter: filterReducer,
    profile: profileReducer,
    address: addressReducer,
    order: orderReducer,
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