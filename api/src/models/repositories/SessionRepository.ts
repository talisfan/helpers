import DbConn from "./DbConn";
import Redis from "../entities/Redis";

export default class SessionRepository{

    private dbConn: DbConn;    

    constructor(){
        this.dbConn = new Redis();        
    }

    async getTokenSession(key: string): Promise<string>{                
        const value = await this.dbConn.get([key]);
        return value[key];
    }

    async insertTokenSession(key: string, value: string, expiresInMs: number): Promise<any>{    
        if(!expiresInMs) throw({ status: 500, message: '[ERROR][SessionRepository][CreateSession]: Param expiresInMs cannot be null'});    
        return await this.dbConn.insert({ [key]: value }, expiresInMs);
    }

    async deleteTokenSession(key: string){
        return await this.dbConn.delete([key]);
    }
}