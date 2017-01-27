
import store from '../store';

// This is the API version for good measure
export const apiVersion = 1;

// Function to allow reducer registration
export const registerReducer = (name, reducer) => {
    store.injectAsyncReducer(name, reducer);
};

// Function to allow reducer registration
export const registerEpic = (name, epic) => {
    store.injectAsyncEpic(name, epic);
};

// Allow extensions to dispatch actions
export const dispatch = (action) => {
    store.dispatch(action);
};
