/*---------------------------------------------------------------------------------------------
 * @license
 * Copyright Florian Guitton (f.guitton@imperial.ac.uk). All rights reserved.
 * Licensed under the MIT License. See LICENSE in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

'use strict';

import * as parser from 'body-parser';
import * as express from 'express';
import * as expressWs from 'express-ws';
import * as helmet from 'helmet';
import * as logger from 'morgan';
import * as favicon from 'serve-favicon';

/**
 * The server.
 *
 * @class Application
 */
export class Application {

    // variable to hold application configuration
    public static config = require('./config.json');

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
        // start the server
        this.listen();
    }

    /**
     * Sets up Express HTTP endpoint
     *
     * @class Server
     * @method HTTPconfig
     */
    private HTTPconfig(): void {

        // defines the listening port
        this.app.set('port', Application.config.default.port);

        // setting up the logger and body parser
        this.app.use(logger('dev'));
        this.app.use(parser.json());
        this.app.use(parser.urlencoded({ extended: false }));

        // adding security protections
        this.app.use(helmet());

        // defines static content routes
        this.app.use(favicon(`${__dirname}/public/images/favicon.ico`));
        this.app.use(express.static(`${__dirname}/public`));
        this.app.use(`${Application.config.default.base}i`, express.static(`${__dirname}/public/images`));
        this.app.use(`${Application.config.default.base}j`, express.static(`${__dirname}/public/scripts`));
        this.app.use(`${Application.config.default.base}c`, express.static(`${__dirname}/public/styles`));

        // sends HTTP requests through the action dispatcher
        this.app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
            next();
        });

        // delivers the front page
        this.app.get(Application.config.default.base, (req: express.Request, res: express.Response) => {
            res.sendFile(`${__dirname}/public/index.html`);
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
        let wss = ews.getWss(Application.config.default.base);

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
        this.app.ws(Application.config.default.base, (ws: any, req: any) => {
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

// getting on with starting the NodeJS server
let server = Application.bootstrap();
module.exports = server.app;
