import { store, history } from './storeManager';

it('produces a store', () => {
    expect(store !== undefined && store !== null);
});

it('produces a history', () => {
    expect(history !== undefined && history !== null);
});
