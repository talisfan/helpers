import 'express-async-errors';
import 'dotenv/config';

import { isAuthenticated, rolesControl } from "./middlewares/auth";
import express, { Request, Response, NextFunction } from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import cors from 'cors';

import routes from './routes';

const ENV_IS_PROD = String(process.env.NODE_ENV).includes('prod');

const app = express();
app.use(morgan('dev'));
app.use(helmet());
app.use(cookieParser());
app.use(express.json());
app.use(cors());
app.use((req: Request, res: Response, next: NextFunction)=>{
    res.set('Access-Control-Allow-Origin', ENV_IS_PROD ? 'https://' : '*');
    res.set('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE');
    res.set('Access-Control-Allow-Headers', ['authorization', 'api_key']);
    next();
});

app.get('/healthcheck', (req: Request, res: Response) => {
    return res.status(200).send(
        `${ENV_IS_PROD ? 'Produção' : 'Desenvolvimento'} OK`
    );
});

app.use(routes);

// Middleware secure control
app.use(rolesControl);

app.use((error: any, req: Request, res: Response, next: NextFunction)=>{
    console.error(`[ERROR]: ${req.path} => `, error);
    let status = error.status || 500;
    let { message } = error;
    delete error.status;

    const { errorMessage } = error;
    if(errorMessage && typeof errorMessage == 'object'){
        for(const prop in errorMessage){
            if(prop.includes('sql')){
                delete error.errorMessage[prop];
            }
        };
    }else if(message && message.includes('prisma')){
        status = 502;
        message = 'Error connection Database';
    }

    return res.status(status).send({
        error: true,
        message
    });
});

app.use((req: Request, res: Response) => {
    return res.status(404).send();
});

app.listen(process.env.PORT_SERVER || 3001, () => {
    console.log(`[${String(process.env.NODE_ENV).toUpperCase()}] 🚪 porta ${process.env.PORT_SERVER || 3001}`);
});
