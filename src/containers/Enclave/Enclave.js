import React, { Component } from 'react';
import { default as T } from 'prop-types';
import { Observable } from 'rxjs';
import { fromJS } from 'immutable';
import { ActionsObservable } from 'redux-observable';
import storeManager, { store } from 'utilities/storeManager';
import Stale from 'components/Stale';

const assets = {};
class Enclave extends Component {

    // Typechecking for container's props
    static propTypes = {
        children: T.oneOfType([T.array, T.element]),
        domain: T.string,
        model: T.object,
        modelName: T.string
    };

    // Default props values
    static defaultProps = {
        domain: 'core',
        model: null,
        modelName: null
    };

    // Typechecking for children's context
    static childContextTypes = {
        dispatch: T.func,
        modelName: T.string
    };

    get displayName() {
        return `Enclave(${this.state.modelName})`;
    }

    getChildContext() {
        return {
            dispatch: this.dispatchProxy(),
            modelName: this.state.modelName
        };
    }

    constructor(props) {
        super(props);
        this.state = {
            ready: false,
            done: false,
            valid: true,
            domain: props.domain,
            model: null,
            modelName: props.modelName
        };
    }

    componentDidMount() {
        if (this.props.model !== null)
            this.props.model.then(({ default: model }) => {
                if (model === null || model === undefined) {
                    this.displayError('No model found');
                    return;
                }
                const state = {
                    model,
                    ready: true
                };
                if (this.state.modelName === null) {
                    if (model.modelName !== undefined)
                        state.modelName = model.modelName;
                    else {
                        this.displayError('No name found for the model');
                        state.valid = false;
                    }
                }
                this.setState(state);
            }).catch(() => {
                this.setState({
                    valid: false
                });
            });
        else if (this.props.modelName !== null)
            this.setState({
                done: true
            });
        else
            this.setState({
                valid: false
            });
    }

    componentDidUpdate(__unused__prevProps, prevState) {
        this.declareAssets();
        this.startModel(prevState);
    }

    componentWillUnmount() {
        if (this.state.model !== null)
            this.dispatchProxy()({ type: 'STOP' });
    }

    componentDidCatch() {
        this.setState({
            valid: false
        });
    }

    displayError(message) {
        if (process.env.NODE_ENV === 'development')
            console.error(`There was a problem creating an enclave: ${message}`);
    }

    declareAssets() {

        if (this.state.done === false && this.state.ready === true) {
            assets[this.state.modelName] = {};
            if (this.state.model !== null) {
                if (this.state.model.modelReducers !== undefined)
                    this.declareReducers(this.state.model.modelReducers);
                if (this.state.model.modelEpics !== undefined)
                    this.declareEpics(this.state.model.modelEpics);
            }
            this.setState({
                done: true
            });
        }
    }

    startModel(prevState) {
        if (prevState.done !== this.state.done && this.state.done === true && this.state.ready === true)
            this.dispatchProxy()({ type: 'START' });
    }

    declareReducers(reducers) {

        assets[this.state.modelName].reducers = reducers;
        storeManager.injectAsyncReducer(this.state.modelName, (previous, action) =>
            Object.values(assets[this.state.modelName].reducers).reduce((state, r) => fromJS(r(state !== undefined ? state.toJS() : state, this.actionDetagger(action))), previous)
        );
    }

    declareEpics(epics) {

        assets[this.state.modelName].epics = epics;
        storeManager.injectAsyncEpic(this.state.modelName, (action, store) =>
            action.mergeMap(a =>
                Observable.concat(
                    ...Object.values(assets[this.state.modelName].epics).map(epic => {
                        let state = store.getState()[this.state.modelName];
                        if (state !== undefined)
                            state = state.toJS();
                        return epic(ActionsObservable.of(this.actionDetagger(a)), state).map(a => this.actionTagger(a));
                    })
                )
            )
        );
        this.setState({
            epics: epics
        });
    }

    actionTagger(action) {
        action.__origin__ = this.state.modelName;
        if (process.env.NODE_ENV === 'development' && this.state.model !== null && this.state.model.modelName !== undefined)
            action.__dev_origin__ = this.state.model.modelName;
        if (action.type.match(/@@.*?\/.*?\/.*/g) !== null)
            return action;
        return Object.assign({}, action, { type: `@@${this.state.domain}/${this.state.modelName}/${action.type}` });
    }

    actionDetagger(action) {
        return Object.assign({}, action, { type: action.type.replace(`@@${this.state.domain}/${this.state.modelName}/`, '') });
    }

    dispatchProxy() {
        return (action) => {
            if (this.state.valid === true)
                store.dispatch(this.actionTagger(action));
        };
    }

    render() {
        if (this.state.valid === false)
            return <Stale />;
        if (this.state.done === true) {
            const children = this.props.children !== undefined ? this.props.children : null;
            if (this.state.model !== null)
                return <this.state.model children={children} />;
            else
                return children;
        }
        return null;
    }
}

export default Enclave;
