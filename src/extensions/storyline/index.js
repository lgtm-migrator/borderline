import storylineEpics from './epics';

class StorylinePlugin {

    identity() {
        return '0000-00-002';
    }

    invocation() {
        this.declareEpics(storylineEpics);
    }
}

export default StorylinePlugin;
