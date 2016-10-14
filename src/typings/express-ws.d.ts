declare namespace Express {
    export interface Application {
        ws(path: any, action: any): any;
    }
}

declare module "express-ws" {

    import * as express from "express";

    function e(app: express.Application, ...args: any[]): any;

    namespace e {
    }    
    
    export = e;
}