import React from 'react';
import renderer from 'react-test-renderer';
import SVG from './SVG';

describe('must sanitize the DOM', () => {

    let component = null
    const response = fetch.mockResponseSuccessOnce('<script></script><svg></svg>');

    it('returns <div> before fetch complete', async () => {
        component = renderer.create(<SVG src="mock" />);
        let result = component.toJSON();
        expect(result.type).toBe('div');
        result = component.toJSON();
        expect(result.type).toBe('div');
    });
});
