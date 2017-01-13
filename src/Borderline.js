import React, { Component } from 'react';
import { BrowserRouter as Router, Link, Match, Miss } from 'react-router'
import logo from './logo.svg';
import './Borderline.scss';
import Home from './Home';
import StoryLine from './StoryLine';

const Empty = () => {
    return (
        <div>
            Empty
        </div>
    );
};

class Borderline extends Component {
    render() {
        return (
            <Router>
                <div className="Borderline">
                    <div className="Borderline-header">
                        <img src={logo} className="Borderline-logo" alt="logo" />
                        <h2>Welcome to <Link to='/story'>Borderline</Link> !</h2>
                    </div>
                    <Match exactly pattern='/' component={Home} />
                    <Match pattern='/story' component={StoryLine} />
                    <Miss component={Empty} />
                </div>
            </Router>
        );
    }
}

export default Borderline;
