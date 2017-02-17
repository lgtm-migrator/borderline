import storeManager from './StoreManager';
import serverCommunication from './ServerCommunication';
import stylesHandle from '../styles/Layout.css';

// This is the API version for good measure
export const apiVersion = 1;

// We export common styles from borderline
export const styles = stylesHandle;

// We expose the server API
export const api = serverCommunication;

// Allow extensions to dispatch actions
export const dispatch = (action) => {
    storeManager.dispatch(action);
};

export const store = (() => process.env.NODE_ENV === 'production' ? null : storeManager.getStore())();
