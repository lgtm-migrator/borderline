import React, { Component } from 'react';
import { connect } from 'react-redux';
import store from '../store';
import Display from '../components/Display';

export class DecrementContainer extends Component {

    componentDidMount() {
        this.interval = setInterval(() => {
            store.dispatch({
                type: 'DECREMENT'
            });
        }, 1000);
    }

    componentWillUnmount() {
        clearInterval(this.interval);
        store.dispatch({
            type: 'DECREMENT_STOP'
        });
    }

    render() {
        return (
            <Display value={this.props.stepper} color='red'/>
        );
    }
}

const mapStateToProps = function (store) {
    return {
        stepper: store.counterState
    };
}

const result = connect(mapStateToProps)(DecrementContainer);
result.child = DecrementContainer.name

export default result;
