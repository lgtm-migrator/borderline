'use strict';

import * as express from 'express';
import * as expressHb from 'express-handlebars';
import * as expressWs from 'express-ws';

import * as config from '../../tools/config';

/**
 * The server.
 *
 * @class Application
 */
export class Application {

    // variable to hold express
    public app: express.Express;

    // open client websockets
    private ows: Object = {};

    /**
     * Bootstrap the application.
     *
     * @class Application
     * @method bootstrap
     * @static
     * @return Returns the newly created injector for this app.
     */
    public static bootstrap(): Application {

        process.stdout.write('Bootstraping Node Server ...\n');
        return new Application();
    }

    /**
     * Constructor.
     *
     * @class Server
     * @constructor
     */
    constructor() {

        // create expressjs injector
        this.app = express();
        // configure the application
        this.HTTPconfig();
        this.WSconfig();
    }

    /**
     * Sets up Express HTTP endpoint
     *
     * @class Server
     * @method HTTPconfig
     */
    private HTTPconfig(): void {

        // register the Handlebars templating engine
        this.app.engine('handlebars', expressHb({ defaultLayout: 'main' }));
        this.app.set('views', `${config.APP_DEST}/views`);
        this.app.set('view engine', 'handlebars');

        // defines the listening port
        this.app.set('port', config.PORT);

        // defines static content routes
        this.app.use(`${config.APP_BASE}i`, express.static(`${config.APP_STATIC}/images`));
        this.app.use(`${config.APP_BASE}j`, express.static(config.JS_DEST));
        this.app.use(`${config.APP_BASE}c`, express.static(config.CSS_DEST));

        // sends HTTP requests through the action dispatcher
        this.app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
            next();
        });

        // delivers the front page
        this.app.get(config.APP_BASE, (req, res) => {
            res.render('index', { title: config.APP_TITLE });
        });
    }

    /**
     * Sets up Express WebSocket endpoint
     *
     * @class Server
     * @method HTTPconfig
     */
    private WSconfig() {

        let ews = expressWs(this.app);
        let wss = ews.getWss(config.APP_BASE);

        // adds a broadcasting function to the websocket handle
        wss.broadcast = (data: string) => {
            for (let i in wss.clients) {
                if (wss.clients.hasOwnProperty(i)) {
                    try {
                        wss.clients[i].send(data);
                    } catch (e) {
                        process.stdout.write('Could not reach client');
                    }
                }
            }
        };

        // defines the event function for the websockets
        this.app.ws(config.APP_BASE, (ws: any, req: any) => {
            ws.on('message', (msg: string) => {
                let obj = JSON.parse(msg);
                if (obj.verb && obj.verb === 'connect') {
                    if (!obj.message || !obj.message.id) {
                        return;
                    }
                    (<any>this.ows)[obj.message.id] = ws;
                    process.stdout.write(obj.message.id, 'Connected');
                }
                wss.broadcast(msg);
            });
            ws.on('close', () => {
                Object.keys(this.ows).forEach((key: string) => {
                    if ((<any>this.ows)[key].readyState !== 1) {
                        wss.broadcast(JSON.stringify({ message: { id: key }, verb: 'disconnect' }));
                        delete (<any>this.ows)[key];
                        process.stdout.write(key, 'Disconnected');
                    }
                });
            });
            ws.on('error', () => {
                Object.keys(this.ows).forEach((key: string) => {
                    if ((<any>this.ows)[key].readyState !== 1) {
                        wss.broadcast(JSON.stringify({ message: { id: key }, verb: 'disconnect' }));
                        delete (<any>this.ows)[key];
                        process.stdout.write(key, 'Disconnected');
                    }
                });
            });
        });
    }

    /**
     * Binds the server to the port
     *
     * @class Server
     * @method listen
     */
    private listen() {
        let server = this.app.listen(this.app.get('port'), () => {
            process.stdout.write('Express server listening on port ' + server.address().port + '\n');
        });
    }
}
