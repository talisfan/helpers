import { createClient, RedisClientType, RedisClientOptions } from 'redis';
import DbConn from '../DbConn';

// connectionString = PASSWORD@HOSTNAME:PORT?ssl=true        
const connectionString = String(process.env.REDIS_CONNECTION_STRING);
let [ password, hostPortAndParams ] = connectionString.split('@');        

if(!password || !hostPortAndParams) throw('Host or Password Redis is missing');

let [ host, portParams ] = hostPortAndParams.split(':');
let [ port, params ] = (portParams) ? portParams.split('?') : [ 6379 ];


let credentials: RedisClientOptions = {
    socket:{
        host,
        port: Number(port),
        tls: true
    },
    password
}    

if(String(process.env.NODE_ENV) === 'dev' && credentials.socket) 
    delete credentials.socket.tls;
    
export default class Redis extends DbConn {
    private connection!: RedisClientType;          
    
    constructor(){        
        super(credentials);                
    }

    protected async connect(): Promise<void> {
        if(!this.connectionActive){
            try{
                // console.log('[INFO][Redis][Connection]: Stabilizing database connection...');
                this.connection = createClient(this.credentials);

                this.connection = createClient(this.credentials || credentials);
                await this.connection.connect();
                this.connectionActive = true;

                // console.log('[INFO][Redis][Connection]: Database connection successfully established!');
            }catch(error){
                console.error('[ERROR][Redis][Connection]: Database connection (Redis) failed.', error);
                throw({ status: 502, message: 'Database connection (Redis) failed' })
            }
        }
    }

    protected async closeConnection(): Promise<void> {
        if(this.connectionActive){
            await this.connection.quit();
            this.connectionActive = false;
        } 
    }

    public async get(keys: string[]): Promise<{ [key: string]: any; }>{
        try{
            await this.connect();
            const response: { [key: string]: any; } = {};

            await Promise.all(keys.map(async (key) => {
                response[key] = await this.connection.get(key);
            }));
    
            return response;
        }catch(error: any){
            console.error(error);
            throw({status: 502, message: 'Failed executing the database query. Error => ' + error.message});
        }finally{
            await this.closeConnection();
        }
    }

    public async insert(keyValues: { [key: string]: any; }, expiresInMs: number = 600): Promise<void> {                
        try{
            await this.connect();

            await Promise.all(
                Object.entries(keyValues).map(async ([key, value]) => {
                    await this.connection.set(key, value, { EX: expiresInMs });
                })
            );
        }catch(error: any){
            console.error(error);
            throw({ status: 502, message: 'Failed to perform insert into database. Error => ' + error.message });
        }finally{
            await this.closeConnection();
        }
    }

    public async delete(keys: any[], ...optionalParams: any[]): Promise<any> {
        try{
            await this.connect();                            
            return await this.connection.del(keys);                
        }catch(error: any){
            console.error(error);
            throw({ status: 502, message: 'Failed to delete data in database. Error => ' + error.message });
        }finally{
            await this.closeConnection();
        }
    }
}