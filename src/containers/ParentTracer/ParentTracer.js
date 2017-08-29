import React, { Component } from 'react'
import { default as T } from 'prop-types';
import { connect } from 'react-redux';

class ParentTracer extends Component {

    // Types for available context
    static contextTypes = {
        modelName: T.string,
        router: T.object
    };

    get displayName() {
        return `ParentTracer${this.state.connector !== undefined ? `(${this.state.connector.displayName || this.state.connector.name})` : '(Component)'}`;
    }

    componentWillMount() {
        this.setState({
            connector: connect(
                (state, ownProps) => this.props.mapStateToProps(state[this.context.modelName] !== undefined ? state[this.context.modelName].toJS() : {}, ownProps),
                () => ({})
            )(this.props.tracedComponent)
        })
    }

    render() {
        const filteredProps = Object.assign({}, this.props);
        delete filteredProps.tracedComponent
        delete filteredProps.mapStateToProps
        return <this.state.connector {...filteredProps} />;
    }
}

export default ParentTracer
