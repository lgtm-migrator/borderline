import React from 'react';
import renderer from 'react-test-renderer';

export const canRender = (Component) => {

    it('renders without crashing while empty', () => {
        const tree = renderer.create(<Component />).toJSON();
        expect(tree).toMatchSnapshot();
    });

    it('renders without crashing with a child', () => {
        const tree = renderer.create(<Component>
            <h1>Hello World</h1>
        </Component>).toJSON();
        expect(tree).toMatchSnapshot();
    });

    it('renders without crashing with multiple children', () => {
        const tree = renderer.create(<Component>
            <h1>Hello</h1>
            <h1>World</h1>
        </Component>).toJSON();
        expect(tree).toMatchSnapshot();
    });
}
