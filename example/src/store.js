import Immutable from 'immutable';
import {
    createStore,
    applyMiddleware
} from 'redux';
import {
     combineReducers
} from 'redux-immutable';
import {
    reducers,
    state as initialState
} from '@applaudience/react-carousel';
import createLogger from 'redux-logger';

let logger,
    reducer,
    state,
    store;

logger = createLogger({
    collapsed: false,
    transformer: (nextState) => nextState.toJS().carousel
});
state = Immutable.fromJS({carousel: initialState});
reducer = combineReducers({carousel: reducers});

store = applyMiddleware(logger)(createStore)(reducer, state);

export default store;
