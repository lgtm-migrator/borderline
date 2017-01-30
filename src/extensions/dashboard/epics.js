export const mainEpic = {
    main:
    (action) => {
        return action.ofType('Coucou').mapTo({ type: 'Holaaa' });
    }
};
