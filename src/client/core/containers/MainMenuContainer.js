import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { List } from 'immutable';

class MainMenuContainer extends Component {

    constructor() {

        super(...arguments);
        this.state = {
            mainMenuLinkList: null,
        };
    }

    componentWillMount() {
        this.createList();
    }

    componentWillUpdate() {
        this.createList();
    }

    createList() {

        let pathname = this.props.pathname || '';
        this.state.mainMenuLinkList = this.props.list.map((link) => {
            return (
                <div key={link}>
                    <Link to={`${pathname}/${link}`}>{link}</Link>
                </div>
            )
        });
    }

    render() {
        return (
            <div>
                Main Menu<br/>
                {this.state.mainMenuLinkList}
            </div>
        );
    }
}

const mapStateToProps = function (store) {
    return {
        list: (store.componentListState || List([])).toJS()
    };
}

const result = connect(mapStateToProps)(MainMenuContainer);
result.child = MainMenuContainer.name

export default result;
