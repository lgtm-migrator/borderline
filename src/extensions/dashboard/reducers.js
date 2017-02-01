export const dashboardReducers = {
    mainReducer:
    (state = '', action) => {
        if (action == 'Plop')
            state = 'Yupi !';
        console.log('Dashboard reduction', state, action); // eslint-disable-line no-console
        return state;
    },
    secondaryDude:
    (state = '', action) => {
        console.log('Dahdah Dude !', state, action); // eslint-disable-line no-console
        return state;
    }
};
