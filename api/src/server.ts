import express, { Request, Response, NextFunction } from "express";
import { oauthRoutes } from './routes';

const app = express();

// CORS
app.use(function (req: Request, res: Response, next: NextFunction) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', '*');
    if (req.method == 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'POST, GET');
        return res.status(200).send();

    }

    next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/oauth', oauthRoutes);

const healthcheck = (req: Request, res: Response, next: NextFunction) => {
    return res.status(200).send('Server running')
};

app.get('/', healthcheck);
app.get('/healthcheck', healthcheck);

app.use((error: any, req: Request, res: Response, next: NextFunction) => {
    if (!error.status) {
        error.status = 500;
    }
    console.error(`[ERROR]: ${req.method.toUpperCase()} ${req.path} =>`, JSON.stringify(error));

    res.status(error.status);
    delete error.status;
    return res.send(error.body || error.message || error);
});

app.use((req: Request, res: Response) => {
    return res.status(404).send();
});

const port = Number(process.env.SERVER_PORT) || 80;
app.listen(port);
console.log(`Servidor rodando na porta ${port}!`);

if (process.env.NODE_ENV == 'dev') {
    console.log('!!Ambiente DEV!!')
}