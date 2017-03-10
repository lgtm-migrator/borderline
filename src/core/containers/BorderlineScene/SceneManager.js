/* -------------------------------------------------------------------------------------------
 *  Copyright (c) Florian Guitton. All rights reserved.
 *  Licensed under the MIT License. See LICENSE in the project root for license information.
 * ---------------------------------------------------------------------------------------- */

import { Component, Children, PropTypes as T } from 'react';
import { BehaviorSubject } from 'rxjs';
import { combineEpics } from 'redux-observable';
import storeManager from '../../utilities/StoreManager';

// Container delcaration
export default class SceneManager extends Component {

    // Custom name for container
    static displayName = 'SceneManager';

    // Typechecking for container's props
    static propTypes = {
        scene: T.string,
        model: T.string,
        seed: T.func,
        children: T.element
    };

    // Typechecking for children's context
    static childContextTypes = {
        dispatch: T.func,
        model: T.string
    };

    static defaultProps = {
        scene: 'extension',
        model: null,
        seed: null
    };

    constructor(props, context) {
        super(props, context);
        this.state = {
            valid: false
        };
        this.reducers = {};
        this.epics = {};
        this.epicsTags = [];
        this.model = this.props.model;
        this.scene = this.props.scene;
    }

    getChildContext() {
        return {
            dispatch: this.dispatchProxy(),
            model: this.model
        };
    }

    bootstrap() {

        this.instance = new this.props.seed();
        if (!this.instance.__proto__.identity) {
            if (!this.model || this.model === '') {
                console.error('Extention cannot be identified'); // eslint-disable-line no-console
                return false;
            }
        } else
            this.model = this.instance.identity();
        if (!this.instance.__proto__.invocation) {
            console.error('Extention cannot be invoked'); // eslint-disable-line no-console
            return false;
        }

        this.prepare();
        this.instance.invocation.apply(this.access);
        this.setState({
            valid: true
        });
    }

    prepare() {

        this.access = {

            declareReducers: (reducers) => {
                if (reducers === undefined || reducers === null)
                    return;
                Object.assign(this.reducers, reducers);
                this.declareReducers();
            },

            declareEpics: (epics) => {
                if (epics === undefined || epics === null)
                    return;
                if (process.env.NODE_ENV !== 'production' && this.epicsTags.length > 0)
                    console.info(`In ${this.model} when declareEpics is called multiple time homonyms will be dropped`); // eslint-disable-line no-console
                Object.assign(this.epics, epics);
                this.declareEpics();
            }
        };
    }

    declareReducers() {

        // Reducers are OK to re-inject at runtime provided the same identifier
        let current = Object.values(this.reducers);

        if (current.length === 0)
            return;

        let chain = (reducers) => (previous, action) => reducers.reduce((state, r) => r(state, this.actionDetagger(action)), previous);
        storeManager.injectAsyncReducer(this.model, chain(current));
    }

    declareEpics() {

        // Epics will lead to enormous problems while re-injected, here we filter only the new ones
        // Note this will leave previously loaded homony active

        let current = [];
        Object.keys(this.epics).map((key) => {
            if (!this.epicsTags.includes(key))
                current.push(this.epics[key]);
            else if (process.env.NODE_ENV !== 'production')
                console.info(`An epic named '${key}' was already inject earlier, new one will be ignored.`); // eslint-disable-line no-console
        });

        if (current.length === 0)
            return;

        let chain = (epics) => (action) => epics.mergeMap(epic => epic(action.map(a => this.actionDetagger(a)), {
            retrieve: () => storeManager.getStore().getState()[this.model]
        })).map(a => this.actionTagger(a));
        storeManager.injectAsyncEpic(this.model, chain(new BehaviorSubject(combineEpics(...current))));
        this.epicsTags = Object.keys(this.epics);
    }

    actionTagger(action) {

        // We trace the origin of the action here
        action.__origin__ = this.model;
        // We tag the action type provided by external developer
        if (action.type.match(/@@.*?\/.*?\/.*/g) !== null)
            return action;
        return Object.assign({}, action, { type: `@@${this.scene}/${this.model}/${action.type}` });
    }

    actionDetagger(action) {

        // We detag the action type provided by external developer
        return Object.assign({}, action, { type: action.type.replace(`@@${this.scene}/${this.model}/`, '') });
    }

    dispatchProxy() {
        return (action) => {
            storeManager.dispatch(this.actionTagger(action, this.scene, this.model));
        };
    }

    componentWillMount() {
        if (this.props.seed !== null)
            this.bootstrap();
    }

    componentDidMount() {
        this.setState({
            valid: true
        });
        if (this.props.seed !== null)
            storeManager.dispatch(this.actionTagger({ type: 'START' }, this.scene, this.model));
    }

    componentWillUnmount() {
        if (this.props.seed !== null)
            storeManager.dispatch(this.actionTagger({ type: 'STOP' }, this.scene, this.model));
    }

    render() {
        const { children } = this.props;
        return children && this.state.valid ? Children.only(children) : null;
    }
}
