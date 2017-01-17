import { createStore } from 'redux';
import reducers from '../reducers';

function configureStore(initialState = {}) {

    const store = createStore(reducers, initialState);

    if (module.hot) {

        // Upon hot reload we fetch a new instance of the reducers and refresh the store
        module.hot.accept('../reducers', () => {
            const hotReducer = require('../reducers').default;
            store.replaceReducer(hotReducer);
        });
    }

    return store;
}

const store = configureStore();
export default store;
