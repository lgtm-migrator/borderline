import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';

import ChatMessage from './message';

class ChatMessageList extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        var msgList = this.props.messages.map(function(msg) {
           return <ChatMessage key={msg.id} message={msg} />;
        });
        return  <div id="chat-messages"><div  className="wrapper">
                        {msgList}
                    </div>
                </div>
        ;
    }
}
ChatMessageList.propTypes = {
    messages: PropTypes.array.isRequired
};

const mapStateToProps = function (state) {
    return {
        messages: state.messages
    };
};

let ChatMessageListContainer = connect(mapStateToProps)(ChatMessageList);
export default ChatMessageListContainer;
