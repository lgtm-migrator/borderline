import StorylineContainer from './StorylineContainer';

export default {
    onReady:
    (action) => action.ofType('@@all/borderline/READY')
        .mapTo({
            type: '@@core/page/PAGE_DOCK',
            name: 'Stories',
            particule: 'stories',
            view: StorylineContainer
        })
};
