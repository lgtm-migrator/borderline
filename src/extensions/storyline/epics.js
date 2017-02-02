import StorylineContainer from './StorylineContainer';

export default {
    onReady:
    (action) => action.ofType('@@all/borderline/READY')
        .mapTo({
            type: '@@extensions/0000-00-000/PAGE_DOCK',
            name: 'Storyline',
            particule: 'storyline',
            view: StorylineContainer
        })
};
