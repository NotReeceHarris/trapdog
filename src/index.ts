import { version } from '../package.json';
import { Config } from './types';

const colours = {
    "reset": "\x1b[0m",
    "red": "\x1b[31m",
    "green": "\x1b[32m",
    "blue": "\x1b[34m",
    "yellow": "\x1b[33m"
}

const trapdog = (config: Config) => {

    config = {
        "verbose": false,
        "verbose:emoji": false,
        ...config
    }

    const log = (message: any) => {
        if (config.verbose) {
            console.log(message);
        }
    }

    log(`Initialized trapdog v${version} 🐶`);

    return (reqOrCtx: any, resOrNext: any, nextOrUndefined?: any) => {
        let method: string;
        let url: string;
        let next: Function;

        // ExpressJS and native HTTP
        if (nextOrUndefined) {
            method = reqOrCtx.method;
            url = reqOrCtx.url;
            next = nextOrUndefined;
        }
        // KoaJS
        else if (resOrNext && typeof resOrNext === 'function') {
            method = reqOrCtx.request.method;
            url = reqOrCtx.request.url;
            next = resOrNext;
        }
        // NestJS
        else {
            method = reqOrCtx.method;
            url = reqOrCtx.url;
            next = () => { };
        }

        console.log(`${method} ${url}`);
        next();
    }
}

export default trapdog;