import pageReducers from './reducers';

class PagePlugin {

    identity() {
        return 'page';
    }

    invocation() {
        this.declareReducers(pageReducers);
    }
}

export default PagePlugin;
