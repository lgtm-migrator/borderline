import StoreContainer from './StoreContainer';
import pageIcon from './images/pageIcon.svg';

export default {
    onReady:
    (action) => action.ofType('@@all/borderline/READY')
        .mapTo({
            type: '@@core/page/PAGE_DOCK',
            name: 'Extensions',
            particule: 'store',
            view: StoreContainer,
            icon: pageIcon
        })
};
