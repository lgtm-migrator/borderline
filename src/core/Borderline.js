import React, { Component } from 'react';
import { BrowserRouter as Router, Link, Match, Miss } from 'react-router'

import IncrementContainer from './containers/IncrementContainer';
import DecrementContainer from './containers/DecrementContainer';

export default class Borderline extends Component {

    constructor() {

        super(...arguments);
        this.state = {
            frontList: null,
            frontLinkList: null,
            frontMatchList: null,
        };
    }

    componentWillMount() {

        this.createList();
    }

    componentWillUpdate() {

        this.createList();
    }

    createList() {

        this.state.frontList = [IncrementContainer, DecrementContainer];
        let pathname = this.props.pathname || '';
        this.state.frontLinkList = this.state.frontList.map((connector) =>
            <Link to={`${pathname}/${connector.child}`} key={connector.child}>{connector.child}</Link>
        );
        this.state.frontMatchList = this.state.frontList.map((connector) =>
            <Match pattern={`${pathname}/${connector.child}`} key={connector.child} component={connector} />
        );
    }

    render() {
        return (
            <Router>
                <div>
                    {this.state.frontLinkList}
                    {this.state.frontMatchList}
                </div>
            </Router>
        )
    }
    /*

        render() {
            return (
                    <div>
                        {this.state.frontLinkList}
                        {this.state.frontMatchList}
                        <br/>

                         <Counter
                            value={store.getState()}
                            onIncrement={() => store.dispatch({ type: 'INCREMENT' })}
                            onDecrement={() => store.dispatch({ type: 'DECREMENT' })}
                        />
                        }
                    </div>
            );
        }
    */

}
