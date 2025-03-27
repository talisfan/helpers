import type { ApiName } from "../../@types/index.js";
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { logErrorHandler, readTokenFromFile, saveTokenToFile } from "../../configs.js";

export abstract class BaseEntityApis {
    private token?: string;
    protected apiName: ApiName;
    protected baseUrl: string;
    protected username: string;
    protected password: string;
    
    constructor({
        apiName,
        baseUrl,
        username,
        password
    }:{
        apiName: ApiName,
        baseUrl: string,
        username: string,
        password: string
    }){
        this.apiName = apiName;
        this.baseUrl = baseUrl;
        this.username = username;
        this.password = password;
    }

    abstract authenticate(): Promise<string>;

    protected async getAccessToken(newToken: boolean = false): Promise<string> {
        let token: string;

        if(newToken){
            console.log(`[${this.apiName.toUpperCase()}] Solicitando novo token de acesso...`);
            try {
                token = await this.authenticate();
                console.log(`[${this.apiName}] Token obtido com sucesso. Escrevendo no arquivo...`);
                saveTokenToFile(this.apiName, token);
            } catch (error: any) {
                const { url, method, headers: requestHeaders, data: requestData } = error.response.request;
                throw (`[${this.apiName}][GetAccessToken]: Request => ${
                    JSON.stringify({
                        url, method, requestHeaders, requestData
                    }, null, 2)
                } -- ERROR => ${logErrorHandler(error)}`);
            }
        }else{
            if(this.token)
                return this.token;

            const oldToken = readTokenFromFile(this.apiName);
            if(oldToken)
                token = oldToken;
            else
                token = await this.getAccessToken(true);
        }

        this.token = token;
        return token;
    };

    
    protected async requestAuthenticated(req: AxiosRequestConfig, functionName: string): Promise<AxiosResponse>{
        req.baseURL = this.baseUrl;
        if(req.headers)
            req.headers.Authorization = `Bearer ${this.token}`;
        else 
            req.headers = { 'Authorization': `Bearer ${this.token}` };

        try {
            await this.getAccessToken();
            const res = await axios(req);
            return res;
        } catch (error: any) {
            const msgError = `[${this.apiName.toUpperCase()}][${functionName}] Excesso de tentativas para realizar autenticação: ${logErrorHandler(error)}`;
            if (error?.response?.status === 401) {
                console.warn(
                    `[${this.apiName.toUpperCase()}][${functionName}] Token expirado. Tentando autenticar novamente...`
                );
                try {
                    await this.getAccessToken(true);       
                    return await axios(req);
                } catch (error) {
                    throw(msgError);
                }
            }
            throw(msgError);
        }
    }
}