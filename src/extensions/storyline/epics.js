import StorylineContainer from './StorylineContainer';
import pageIcon from './images/pageIcon.svg';

export default {
    onReady:
    (action) => action.ofType('@@all/borderline/READY')
        .mapTo({
            type: '@@core/page/PAGE_DOCK',
            name: 'Stories',
            particule: 'stories',
            view: StorylineContainer,
            icon: pageIcon
        })
};
