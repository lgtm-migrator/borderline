import storeManager from '../utilities/StoreManager';

// This is the API version for good measure
export const apiVersion = 1;

// Allow extensions to dispatch actions
export const dispatch = (action) => {
    storeManager.dispatch(action);
};

export const store = (() => process.env.NODE_ENV === 'production' ? null : storeManager.getStore())();
