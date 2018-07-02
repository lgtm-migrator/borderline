import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { stateAware } from 'utilities/storeManager';
import style from './style.module.css';

@stateAware(state => ({
    currentStep: state.currentStep,
    stepsList: state.stepsList[state.currentWorkflow],
    stepsTree: state.stepsTree
}))
class StepList extends Component {

    // Custom name for container
    static displayName = 'StepList';

    pickPaddings = (paddings) => {
        return Array.from(paddings).map((pad, index) => {
            switch (pad) {
                case '°':
                    return <span className={style.pad} key={index}>°</span>;
                case '|':
                    return <span className={style.pad} key={index}>|</span>;
                default:
                    return null;
            }
        });
    }

    render() {
        const { stepsList, stepsTree, currentStep, match: { url } } = this.props;
        const list = stepsTree.map(element =>
            <Link to={`${url.substr(0, url.lastIndexOf('/'))}/${element._id}`} className={`${style.stepButton} ${element._id === currentStep ? style.stepActive : ''}`} key={element._id}>
                {this.pickPaddings(element.padding)}{stepsList[element._id].extension}
            </Link>
        );
        return list;
    }
}

export default StepList;
