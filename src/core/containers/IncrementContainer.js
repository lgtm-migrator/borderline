import React, { Component } from 'react';
import { connect } from 'react-redux';
import store from '../store';
import Display from '../components/Display';

class IncrementContainer extends Component {

    componentDidMount() {
        this.interval = setInterval(() => {
            store.dispatch({
                type: 'INCREMENT'
            });
        }, 10000);
    }

    componentWillUnmount() {
        clearInterval(this.interval);
        store.dispatch({
            type: 'INCREMENT_STOP'
        });
    }

    render() {
        return (
            <Display value={this.props.counter} color='blue'/>
        );
    }
}

const mapStateToProps = function (store) {
    return {
        counter: store.counterState
    };
}

const result = connect(mapStateToProps)(IncrementContainer);
result.child = IncrementContainer.name

export default result;
