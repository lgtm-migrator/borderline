import React, { Component } from 'react';
import { Match } from 'react-router';

// import storeManager from '../utilities/StoreManager';
import WrapClear from '../components/WrapClearComponent';
import styles from '../styles/ContentBox.css';

// @storeManager.retrieve(['plop'], (plop) => {
//     console.log('ContentBoxContainer Store', plop); // eslint-disable-line no-console
//     return {
//         list: plop.subapps
//     };
// })
class ContentBoxContainer extends Component {

    constructor() {
        super(...arguments);
        this.state = {
            subappContainers: null,
        };
    }

    componentWillMount() {
        this.createSubappContainers();
    }

    componentWillUpdate() {
        this.createSubappContainers();
    }

    createSubappContainers() {
        let pathname = this.props.pathname || '';
        this.state.subappContainers = Object.keys(this.props.list || {}).map((key) => (
            <Match pattern={`${pathname}/${key}`} key={key} component={() =>
                <div className={styles.contentcontainer}>
                    {key}
                </div>
            } />
        ));
    }
    render() {
        return (
            <div className={styles.contentbox}>
                <WrapClear>
                    {this.state.subappContainers}
                    <div className={styles.placeholder}>&#9640;</div>
                </WrapClear>
            </div>
        );
    }
}

export default ContentBoxContainer;
