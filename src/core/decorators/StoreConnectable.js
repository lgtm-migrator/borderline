import { connect } from 'react-redux';

function StoreConnectable(...mappings) {
    return (function (target) {
        return connect(...mappings)(target);
    });
}

export default StoreConnectable;
