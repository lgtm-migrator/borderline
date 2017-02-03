import StoreContainer from './StoreContainer';

export default {
    onReady:
    (action) => action.ofType('@@all/borderline/READY')
        .mapTo({
            type: '@@extensions/0000-00-000/PAGE_DOCK',
            name: 'Extensions',
            particule: 'store',
            view: StoreContainer
        })
};
