
import store from '../store';

// This is the API version for good measure
export const apiVersion = 1;

// Function to allow reducer registration
export const registerReducer = (reducer) => {
    let name = (Math.random() * 0xFFFFFF << 0).toString(16);
    store.injectAsyncReducer(name, reducer);
    return name;
};

// Allow extensions to dispatch actions
export const dispatch = (action) => {
    store.dispatch(action);
};
