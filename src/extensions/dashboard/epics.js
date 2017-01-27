export const mainEpic = (action) => {
    return action.ofType('Coucou').mapTo({ type: 'Holaaa' });
};
