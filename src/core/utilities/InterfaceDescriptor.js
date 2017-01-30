
import storeManager from '../utilities/StoreManager';

// This is the API version for good measure
export const apiVersion = 1;

// Function to allow reducer registration
export const registerReducers = (reducers) => {
    Object.keys(reducers).map((key) =>
        storeManager.injectAsyncReducer(key, reducers[key])
    );
};

// Function to allow reducer registration
export const registerEpics = (epics) => {
    Object.keys(epics).map((key) =>
        storeManager.injectAsyncEpic(key, epics[key])
    );
};

// Allow extensions to dispatch actions
export const dispatch = (action) => {
    storeManager.dispatch(action);
};
