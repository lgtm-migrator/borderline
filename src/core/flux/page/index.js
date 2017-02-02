import pageReducers from './reducers';

class PagePlugin {

    identity() {
        return '0000-00-000';
    }

    invocation() {
        this.declareReducers(pageReducers);
    }
}

export default PagePlugin;
