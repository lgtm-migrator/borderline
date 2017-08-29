import React, { Component } from 'react'
import { Route } from 'react-router-dom'
import Enclave from 'containers/Enclave'
import { stateAware } from 'utilities/storeManager'
import './style.css'

class Content extends Component {

    render() {
        const { views } = this.props
        const panels = Object.keys(views).map(key => {
            const Content = views[key].view;
            return (
                <Route key={key} path={`/${views[key].path}`} render={ (props) =>
                    <Enclave key={key} domain={'extensions'} modelName={key} >
                        <Content />
                    </Enclave>
                } />
            )
        });
        return (
            <div className="content">
                {panels}
            </div>
        )
    }
}

export default stateAware(state => (state => ({
    views: state.pages || []
}))(state !== undefined && state.toJS !== undefined ? state.toJS() : {}))(Content)
