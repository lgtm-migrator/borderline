import React, { Component } from 'react';
import { Link, Match } from 'react-router'

const Waterfall = () => <div>Waterfall</div>;
const ANova = () => <div>ANova</div>;
const Survival = () => <div>Survival</div>;

class StoryLine extends Component {

    render() {

        let pathname = this.props.pathname;
        let names = [Waterfall, ANova, Survival];
        let namesList = names.map((component) =>
            <Match exactly pattern={`${pathname}/${component.name}`} key={component.name} component={component} />
        );

        return (
            <div>
                <p className="Borderline-intro">There are <Link to={`${pathname}/waterfall`}>Waterfall analysis</Link> and <Link to={`${pathname}/anova`}>ANova</Link>.</p>
                <ul>{namesList}</ul>
            </div>
        );
    }
};

export default StoryLine;
