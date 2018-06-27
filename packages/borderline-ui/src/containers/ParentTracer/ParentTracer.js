import React, { Component } from 'react';
import { default as T } from 'prop-types';
import { connect } from 'react-redux';

class ParentTracer extends Component {

    // Types for available context
    static contextTypes = {
        modelName: T.string,
        router: T.object
    };

    get displayName() {
        const { displayName, name } = this.props.tracedComponent;
        return `ParentTracer(${displayName || name || 'Component'})`;
    }

    render() {
        if (this.connectedComponent === undefined)
            this.connectedComponent = connect(
                (state, ownProps) => this.props.mapStateToProps(state[this.context.modelName] !== undefined ? state[this.context.modelName].toJS() : {}, ownProps),
                () => ({})
            )(this.props.tracedComponent);
        const filteredProps = Object.assign({}, this.props);
        delete filteredProps.tracedComponent;
        delete filteredProps.mapStateToProps;

        return <this.connectedComponent {...filteredProps} />;
    }
}

export default ParentTracer;
