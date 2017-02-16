import DashboardContainer from './DashboardContainer';
import pageIcon from './images/pageIcon.svg';

export default {
    onReady:
    (action) => action.ofType('@@all/borderline/READY')
        .mapTo({
            type: '@@core/page/PAGE_DOCK',
            name: 'Dashboard',
            particule: 'dashboard',
            view: DashboardContainer,
            icon: pageIcon
        })
};
