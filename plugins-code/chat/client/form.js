import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';

import * as ChatStore from './store';

class ChatForm extends Component {
    constructor(props) {
        super(props);
        this.textInput = null;
        this.newMessage = this.newMessage.bind(this);
    }

    newMessage(event) {
        event.preventDefault();
        var newKey = (Math.random() * 1e32).toString(36);
        var m = { id: newKey, message: this.textInput.value };
        this.props.dispatch(ChatStore.sendMessageAction(m));
        this.textInput.value = '';
    }

    render() {
        return <div id="chat-plugin-form">
                    <form onSubmit={this.newMessage}>
                        <input ref={e => this.textInput = e} type="text" />
                        <input type="submit" value="Send" />
                    </form>
                </div>
        ;
    }
}

let ChatFormContainer = connect()(ChatForm);

export default ChatFormContainer;
