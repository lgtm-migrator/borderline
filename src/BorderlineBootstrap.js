import React from 'react';
import ReactDOM from 'react-dom';
import BorderlineProvider from 'BorderlineProvider';

export default class BorderlineBootstrap {

    // Custom name for container
    static displayName = 'BorderlineBootstrap';

    constructor() {

        this.startBorderline();
    }

    startBorderline() {

        // We fetch the anchor of our app the the HTML template
        const root = document.getElementById('root');

        // We render the application
        ReactDOM.render(
            <BorderlineProvider />, root
        );

        if (module.hot) {
            module.hot.accept('BorderlineProvider', () => {

                // Upon hot reload we fetch a new instance of the application and render it
                var HotBorderlineProvider = require('BorderlineProvider').default;
                ReactDOM.render(
                    <HotBorderlineProvider />, root
                );
            });
        }
    }
}
