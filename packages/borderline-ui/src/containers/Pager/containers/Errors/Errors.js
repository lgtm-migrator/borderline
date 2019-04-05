import React, { Component } from 'react';
import { default as T } from 'prop-types';
import { stateAware } from 'utilities/storeManager';
import { actions } from '../../flux';
import style from './style.module.css';

@stateAware(state => ({
    errors: state.errors || []
}))
class Errors extends Component {

    //Custom name for container
    static displayName = 'Errors';

    // Types for available context
    static contextTypes = {
        dispatch: T.func
    };

    dismissError = (id) => {
        this.context.dispatch(actions.dismissError(id));
    }
    render() {
        const { errors } = this.props;
        const items = Object.keys(errors).map(id => {
            return (
                <div key={id} className={style.error} onClick={() => this.dismissError(id)}>
                    <pre>{errors[id]}</pre>
                </div>
            );
        });

        return (
            <div className={style.errorsContainer}>
                {items}
            </div>
        );
    }
}

export default Errors;
