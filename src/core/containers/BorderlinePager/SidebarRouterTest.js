/* -------------------------------------------------------------------------------------------
 *  Copyright (c) Florian Guitton. All rights reserved.
 *  Licensed under the MIT License. See LICENSE in the project root for license information.
 * ---------------------------------------------------------------------------------------- */
/* global borderline */

import React, {Component} from 'react';
import {
    // BrowserRouter as Router,
    Route,
    NavLink
} from 'react-router-dom';

// Each logical "route" has two components, one for
// the sidebar and one for the main area. We want to
// render both of them in different places when the
// path matches the current URL.
const routes = [
    {
        name: 'Home',
        path: '/',
        exact: true,
        sidebar: () => <div>home!</div>,
        main: () => <h2>Home</h2>
    },
    {
        name: 'Bubblegum',
        path: '/bubblegum',
        sidebar: () => <div>bubblegum!</div>,
        main: () => <h2>Bubblegum</h2>
    },
    {
        name: 'Shoelaces',
        path: '/shoelaces',
        sidebar: () => <div>shoelaces!</div>,
        main: () => <h2>Shoelaces</h2>
    }
];

@borderline.stateAware('SidebarExample')
export default class SidebarExample extends Component {

    shouldComponentUpdate() {
        return true;
    }

    render() {
        const Wrapper = borderline.components.wrapper;
        return (
            // <Router>
                <Wrapper relative>
                    <div style={{
                        padding: '10px',
                        width: '40%',
                        background: '#f00'
                    }}>
                        <ul style={{ listStyleType: 'none', padding: 0 }}>
                            {routes.map((route, index) => (
                                <li key={`l_${index}`}><NavLink exact activeStyle={{color: '#0f0'}}
                                    to={route.path}
                                >{route.name}</NavLink></li>
                            ))}
                        </ul>
                    </div>

                    <div style={{ flex: 1, padding: '10px' }}>
                        {routes.map((route, index) => (
                            <Route
                                key={`r_${index}`}
                                path={route.path}
                                exact={route.exact}
                                component={route.main}
                            />
                        ))}
                    </div>
                </Wrapper>
            // </Router>
        );
    }
}
