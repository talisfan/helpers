import axios from 'axios';

type RequestObject = {
    url: string,
    method: string,
    body?: any,
    headers?: { [key: string]: any }
}

type ResponseObject = {
    data: any,
    status: number
}

export default class ExternalApi {
    
    private autoRetry: boolean;
    private maxRetries: number;
    protected baseUrlApi: string;
    protected headers?: { [key: string]: any };

    constructor(baseUrlApi: string, options?: {
            headers?: { [key: string]: any },
            autoRetry?: boolean,
            maxRetries?: number
        }
    ){
        this.baseUrlApi = baseUrlApi;
        this.headers = options?.headers || {};
        this.autoRetry = options?.autoRetry || false;
        this.maxRetries = options?.maxRetries || 3;
    }

    private async handlingRequest(requestObject: RequestObject, operationLog: string){
        try{
            let reqObj = { ...requestObject, data: requestObject.body };
            delete reqObj.body;

            if(this.headers) reqObj.headers = { ...reqObj.headers, ...this.headers };

            return await axios(reqObj);
        }catch(error: any){
            let errorResponse: { [key: string]: any } = { 
                status: 500,
                body: {
                    operation: operationLog
                }
            };

            if(error.response) {
                errorResponse.status = error.response.status;
                if(error.response?.data) errorResponse.body['error'] = error.response.data;
            }else if(error.request) {
                errorResponse.status = 502;
                errorResponse.body['error'] = {
                    message: error.message || 'NO RESPONSE FROM SERVER',
                    requestUrl: error.request._currentUrl
                }
            }else{
                errorResponse.status = 500;
                errorResponse.body['error'] = error.message || error
            }

            throw(errorResponse);
        }
    }

    protected async doRequest(requestObject: RequestObject, operationLog: string): Promise<ResponseObject>{

        let response;

        if(this.autoRetry){
            for(let i = 1; i <= this.maxRetries; i++){
                try{
                    response = await this.handlingRequest(requestObject, operationLog);
                }catch(error){
                    if(i == this.maxRetries) throw(error);
                }
            }
        }else{
            response = await this.handlingRequest(requestObject, operationLog);
        }
        
        return <ResponseObject> response;
    }
}