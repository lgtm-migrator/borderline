import { combineEpics, createEpicMiddleware } from 'redux-observable';
import { Observable } from 'rxjs';

export const SEND_MESSAGE = "CHAT_ACTION_SEND_MESSAGE";
export const SEND_MESSAGE_SUCCESS = "CHAT_ACTION_SEND_MESSAGE_SUCCESS";
export const SEND_MESSAGE_ERROR = "CHAT_ACTION_SEND_MESSAGE_ERROR";
export const RECV_MESSAGE = "CHAT_ACTION_RECEIVE_MESSAGE";
export const QUERY_MESSAGE = "CHAT_ACTION_QUERY_MESSAGE";

export function sendMessageAction(message_data) {
    return {
        type: SEND_MESSAGE,
        payload: message_data
    };
}

export function sendMessageSuccessAction(message_data) {
    return {
        type: SEND_MESSAGE_SUCCESS,
        payload: message_data
    };
}

export function sendMessageErrorAction(message_data) {
    return {
        type: SEND_MESSAGE_ERROR,
        payload: message_data
    };
}

export function receiveMessageAction(message_data) {
    return {
        type: RECV_MESSAGE,
        payload: message_data
    };
}

export function queryMessageAction() {
    return {
        type: QUERY_MESSAGE
    };
}

const initialState = {
    messages: []
};

export function ChatReducer(state = initialState, action) {
    switch (action.type) {
        case SEND_MESSAGE:
            action.payload.class = 'chat-send';
            return Object.assign({}, state, {
                messages: state.messages.concat([action.payload])
            });
        case SEND_MESSAGE_ERROR:
            action.payload.class = 'error';
            state.messages.pop();
            return Object.assign({}, state, {
                messages: state.messages.concat([action.payload])
            });
        case SEND_MESSAGE_SUCCESS:
            action.payload.class = 'success';
            state.messages.pop();
            return Object.assign({}, state, {
                messages: state.messages.concat([action.payload])
            });
        case RECV_MESSAGE:
            action.payload.class = 'recv';
            return Object.assign({}, state, {
                messages: state.messages.concat([action.payload])
            });
        default:
            return state;
    }
}

export function ChatQueryEpic(action) {
    return action.ofType(QUERY_MESSAGE)
        .mergeMap(action =>
            Observable.fromPromise(fetch('/chat').then(response => response.json()))
        )
        .mergeMap(msgList => Observable.from(msgList)
            .defaultIfEmpty(null)
        )
        .map(msg => msg === null  ? { type: "NONE"} : receiveMessageAction(msg) );
}

export function ChatSendEpic(action) {
    return action.ofType(SEND_MESSAGE)
        .map((msg) => Observable.from(fetch('/chat',
                {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json;charset=UTF-8'
                    },
                    body: JSON.stringify(msg.payload)
                })
                .then(function (response) {
                    if (response.status == 200)
                        return response.json();

                    throw 'Send error';
                })
            )
            .catch(err => Observable.of(msg.payload))
        )
        .mergeMap((msg) => Observable.from(msg))
        .map(data => data.hasOwnProperty('date') ? sendMessageSuccessAction(data) : sendMessageErrorAction(data));
}

export const ChatEpic = createEpicMiddleware(combineEpics(ChatQueryEpic, ChatSendEpic));
