export const dashboardEpics = {
    onRead:
    (action) => action.ofType('@@all/borderline/READY').mapTo({ type: 'Dashboard' })
};
