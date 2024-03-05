const trapdog = (configs) => {
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