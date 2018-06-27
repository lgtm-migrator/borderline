import React, { Component } from 'react';
import { default as T } from 'prop-types';
import DOMPurify from 'dompurify';

export default class SVG extends Component {

    // Custom name for container
    static displayName = 'SVG';

    // Typechecking for container's props
    static propTypes = {
        src: T.string
    };

    static cache = {};

    propertyFilter(property) {
        let match = null;
        switch (property) {
            case 'class':
                return 'className';
            case 'style':
                return null;
            case (match = property.match(/(.*?):(.)(.*)/) || {}).input: /* eslint no-cond-assign: "off" */
                return match[1] + match[2].toUpperCase() + match[3];
            default:
                return property;
        }
    }

    attributeMapping(attributes) {
        let ret = {};
        let prop = null;
        for (let i = 0; i < attributes.length; i++) {
            prop = this.propertyFilter(attributes[i].name);
            if (prop !== null)
                ret[prop] = attributes[i].value;
        }
        return ret;
    }

    constructor(props) {
        super(props);
        this.state = {
            element: null
        };
    }

    componentDidMount() {

        if (SVG.cache[this.props.src] === undefined)
            SVG.cache[this.props.src] = fetch(this.props.src)
                .then(response => response.text())
                .then(text => (new DOMParser()).parseFromString(DOMPurify.sanitize(text), 'image/svg+xml').documentElement);
        SVG.cache[this.props.src].then(element => {
            if (this.refs.svg)
                this.setState({
                    element: element
                });
        });
    }

    render() {

        const { element } = this.state;

        if (element === null)
            return <div ref="svg" { ...this.props } />;
        else
            return <svg ref="svg" {...this.attributeMapping(element.attributes) } dangerouslySetInnerHTML={{ __html: element.innerHTML }} { ...this.props } />;
    }
}
