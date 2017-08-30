import React from 'react';
import ReactDOM from 'react-dom';

export const canRender = (Component) => {

    it('renders without crashing while empty', () => {
        const div = document.createElement('div');
        ReactDOM.render(<Component />, div);
    });

    it('renders without crashing with a child', () => {
        const div = document.createElement('div');
        ReactDOM.render(<Component>
            <h1>Hello World</h1>
        </Component>, div);
    });

    it('renders without crashing with multiple children', () => {
        const div = document.createElement('div');
        ReactDOM.render(<Component>
            <h1>Hello</h1>
            <h1>World</h1>
        </Component>, div);
    });
}
