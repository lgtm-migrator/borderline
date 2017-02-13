import DashboardContainer from './DashboardContainer';

export default {
    onReady:
    (action) => action.ofType('@@all/borderline/READY')
        .mapTo({
            type: '@@core/page/PAGE_DOCK',
            name: 'Dashboard',
            particule: 'dashboard',
            view: DashboardContainer
        })
};
