/* -------------------------------------------------------------------------------------------
 *  Copyright (c) Florian Guitton. All rights reserved.
 *  Licensed under the MIT License. See LICENSE in the project root for license information.
 * ---------------------------------------------------------------------------------------- */

import React, { Component, PropTypes as T } from 'react';
import DOMPurify from 'dompurify';

export default class SVG extends Component {

    // Custom name for container
    static displayName = 'SVG';

    // Typechecking for container's props
    static propTypes = {
        src: T.string
    };

    propertyFilter(property) {
        let match = null;
        switch (property) {
            case 'class':
                return 'className';
            case 'style':
                return null;
            case (match = property.match(/(.*?):(.)(.*)/) || {}).input:
                return match[1] + match[2].toUpperCase() + match[3];
            default:
                return property;
        }
    }

    attributeMapping(attributes) {
        let ret = {};
        let prop = null;
        for (let i = 0; i < attributes.length; i++) {
            if ((prop = this.propertyFilter(attributes[i].name)) !== null)
                ret[prop] = attributes[i].value;
        }
        return ret;
    }

    render() {
        const { src } = this.props;
        let element = (new DOMParser()).parseFromString(DOMPurify.sanitize(src), 'image/svg+xml').documentElement;
        return (
            <svg {...this.attributeMapping(element.attributes) } children={null} dangerouslySetInnerHTML={{ __html: element.innerHTML }} />
        );
    }
}
