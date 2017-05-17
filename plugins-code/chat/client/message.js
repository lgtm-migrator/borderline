import React, { Component } from 'react';

class ChatMessage extends Component {

    render() {
        var msg = <span className='message'>{this.props.message.message}</span>;
        var date = null;
        if (this.props.message.date)
            date = <span className='date'>{this.props.message.date}</span>
        else
            date = <p></p>
        return <div className={`chat-message ${this.props.message.class}`} id={this.props.message.id}>
                    {msg}
                    <br/>
                    {date}
                </div>;
    }

}

export default ChatMessage;
