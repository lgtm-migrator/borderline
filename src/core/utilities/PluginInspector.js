import { Observable } from 'rxjs';
import PluginContext from './PluginContext';
import storeManager from '../utilities/StoreManager';
import CoreFluxPlugin, { coreFluxPluginActions } from '../flux';

class PluginInspector {

    constructor() {
        this.initialized = false;

        // We add hot reloading block here to prevent propagation
        if (module.hot) {
            return;
        }
    }

    discover() {

        console.info('Launching Plugin discovery ...'); // eslint-disable-line no-console

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

        new PluginContext(CoreFluxPlugin, 'core');
        storeManager.dispatch(coreFluxPluginActions.borderlineBoot());
    }
}

const pluginInspector = new PluginInspector();
export default pluginInspector;
