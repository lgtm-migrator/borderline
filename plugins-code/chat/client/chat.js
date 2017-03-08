import React, { Component } from 'react';

import ChatMessageListContainer from './list';
import ChatFormContainer from './form';

class Chat extends Component {
    constructor(props) {
        super(props);
    }

    render () {
        return  <div id="chat-plugin">  <div className="wrapper">
                        <ChatMessageListContainer />
                        <ChatFormContainer />
                    </div>
                </div>
        ;
    }

}

export default Chat;
