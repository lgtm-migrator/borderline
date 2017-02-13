import { Observable } from 'rxjs';
import PluginContext from './PluginContext';
import storeManager from '../utilities/StoreManager';
import InspectorPlugin from '../flux/inspector';
import SessionPlugin from '../flux/session';
import PagePlugin from '../flux/page';

class LifecycleManager {

    constructor() {
        this.initialized = false;

        // We add hot reloading block here to prevent propagation
        if (module.hot) {
            return;
        }
    }

    rediscover() {
        storeManager.recreate();
        this.initialized = false;
        this.discover();
    }

    discover() {

        console.info('Injecting core applicaton fluxes ...'); // eslint-disable-line no-console

        // Here we prevent double initialization
        // We should make sure we handle reloading from there
        if (this.initialized)
            return;

        // For some unheard of reasons, borderline global is not yet available at this time.
        // We use Observable to delay the check and then carry on.
        let wait = Observable.interval(100)
            .filter(() => window.borderline && window.borderline.apiVersion)
            .subscribe(() => {
                wait.unsubscribe();
                this.injectFlux();
                this.initialized = true;
            });
    }

    injectFlux() {

        new PluginContext(PagePlugin, 'core');
        new PluginContext(InspectorPlugin, 'core');
        new PluginContext(SessionPlugin, 'core');
        storeManager.dispatch({ type: '@@all/borderline/BOOT' });
    }
}

const lifecycleManager = new LifecycleManager();
export default lifecycleManager;
