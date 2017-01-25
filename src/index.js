import Borderline from './core/BorderlineBootstrap';

new Borderline();

// This file should export the outside facing APIs available on global scope
// It is important that we place here all the elements to be exposed for plugin creation
// All will be available in a global scope UMD compatible variable called 'borderline'

import store from './core/store';

export const api = {
    'store': store
};
