import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';

import * as ChatStore from './store';
import ChatPlugin from './chat';

let store = createStore(ChatStore.ChatReducer, applyMiddleware(ChatStore.ChatEpic));
// We fetch the anchor of our app the the HTML template
const root = document.getElementById('root');

// We render the application
ReactDOM.render(
    <Provider store={store}>
        <ChatPlugin />
    </Provider>,
    root
);

store.dispatch(ChatStore.queryMessageAction());
