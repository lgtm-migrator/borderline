import storeManager from '../utilities/StoreManager';
import stylesHandle from '../styles/Layout.css';

// This is the API version for good measure
export const apiVersion = 1;

// We export common styles from borderline
export const styles = stylesHandle;

// Allow extensions to dispatch actions
export const dispatch = (action) => {
    storeManager.dispatch(action);
};

export const store = (() => process.env.NODE_ENV === 'production' ? null : storeManager.getStore())();
