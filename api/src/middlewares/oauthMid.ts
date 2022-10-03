import { Request, Response, NextFunction } from "express";

async function isAuthorized(req: Request, res: Response, next: NextFunction) {

};

const validationParams = {
    getAuthorizationCode: function (req: Request, res: Response, next: NextFunction) {
        const { state, client_id, redirect_uri, documento, codUsuario } = req?.body;
        if (!state || !client_id || !redirect_uri || !documento || !codUsuario)
            return next({ status: 400 });

        if (client_id !== String(process.env.CLIENT_ID))
            return next({ status: 401 });

        next();
    },
    getAccessToken: function (req: Request, res: Response, next: NextFunction) {
        const { code, client_id, client_secret } = req?.body;

        if (!code || !client_id || !client_secret)
            return next({ status: 400 });

        if (client_id !== String(process.env.CLIENT_ID) || client_secret !== String(process.env.CLIENT_SECRET))
            return next({ status: 401 });

        next();
    },
    getUserInfo: function (req: Request, res: Response, next: NextFunction) {
        if (!req.headers.authorization || req.headers.authorization && !req.headers.authorization.includes('Bearer '))
            return next({ status: 401 });

        next();
    }
}

export { isAuthorized, validationParams };