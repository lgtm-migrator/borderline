export const storylineEpics = {
    mainEpic:
    (action) => {
        return action.ofType('Coucou').mapTo({ type: 'Helooo' });
    }
};
