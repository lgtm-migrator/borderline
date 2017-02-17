import React from 'react';
import DOMPurify from 'dompurify';

class SVGContainer extends React.Component {

    propertyFilter(property) {
        let match = null;
        switch (property) {
            case 'class':
                return 'className';
            case 'style':
                return null;
            case (match = property.match(/(.*?)(:)(.)(.*)/) || {}).input:
                return match[1] + match[3].toUpperCase() + match[4];
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

export default SVGContainer;
