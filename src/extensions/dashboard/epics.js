export const dashboardEpics = {
    mainEpic:
    (action) => {
        return action.ofType('@@all/borderline/READY').mapTo({ type: 'Dashboard coming to life' });
    }
};
