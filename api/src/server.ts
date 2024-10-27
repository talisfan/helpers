import 'express-async-errors';
import 'dotenv/config';

import { isAuthenticated, rolesControl } from "./middlewares/auth";
import express, { Request, Response, NextFunction } from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import cors from 'cors';

import routes from './routes';
import cluster from 'cluster';
import os from 'os';

const ENV_IS_PROD = String(process.env.NODE_ENV).includes('prod');


const cpusLength = Number(proccess.env.CLUSTER_MAX_FORKS) || 1 // os.cpus().length;

// Só usar cluster no caso de não gerenciamento por instancias (como no pm2 ou caprover)
if (cluster.isPrimary) {
    console.log(`Master ${process.pid} is running`);
  
    // Fork workers
    for (let i = 0; i < cpusLength; i++) {
      cluster.fork();
    }
  
    // Listen for dying workers and fork a new worker when one dies
    cluster.on('exit', (worker, code, signal) => {
      console.log(`Worker ${worker.process.pid} died`);
      cluster.fork(); // Fork a new worker
    });
  
} else {
    const app = express();
    
    app.use(morgan('dev'));
    app.use(helmet());
    app.use(cookieParser());
    app.use(express.json());
    
    const originAllowed = [
        'https://www.tmlcodes.com'
    ];
    
    const corsOptions = {
        origin: (origin, callback) => {
          if (!origin) {
            return callback(null, true);
          }
      
          const regex = new RegExp(`^(https?://)?([a-z0-9-]+\\.)*${'tmlcodes.com'.replace('.', '\\.')}$`);
          if (
            regex.test(origin) 
            || originAllowed.includes(new URL(origin).hostname)
            || (!ENV_IS_PROD && /^http:\/\/localhost(:\d+)?$/.test(origin))
        ) {
            callback(null, true);
          } else {
            callback(new Error('Not allowed by CORS'));
          }
        },
        methods: ['GET', 'POST', 'PATCH', 'DELETE'],
        allowedHeaders: ['authorization', 'apikey']
    };
    
    app.use(cors(corsOptions));

    app.use((req: Request, res: Response, next: NextFunction)=>{
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
        console.error(`[ERROR]: ${req.method.toUpperCase()} ${req.path} => `, error);
    
        let status = error?.response?.status || error?.status || 500;
        let message = error?.response?.data || error?.message || error;
        delete error.status;
    
        if(typeof message == 'string' && message.includes('prisma')){
            status = 502;
            message = 'Error connection Database - Prisma error code ' + error.code;
        }else{
            if(JSON.stringify(message, null, 4).includes('P2002')){
                status = 502;
                message = 'Conflito de chave única';
            }else if(message?.error?.errors){
                message = message?.error?.errors[0]?.description;
            }else if(JSON.stringify(message, null, 4).includes('prisma')){
                status = 502;
                message = 'Error connection Database - Prisma error code ' + error.code;
            }
        }
    
        return res.status((error?.response?.status) ? 502 : status).send({
            error: true,
            status,
            message
        });
    });
    
    app.use((req: Request, res: Response) => {
        return res.status(404).send();
    });
    
    app.listen(process.env.PORT_SERVER || 3001, () => {
        console.log(`[${String(process.env.NODE_ENV).toUpperCase()}] 🚪 porta ${process.env.PORT_SERVER || 3001}`);
    });
}
