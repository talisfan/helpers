export default abstract class DbConn {
    protected credentials: object;
    protected connectionActive: boolean = false;

    constructor(credentials: object){
        this.credentials = credentials;
    }

    protected abstract connect(): Promise<void>;

    protected abstract closeConnection(): Promise<void>;

    abstract get(keys: string[], ...optionalParams: any[]): Promise<any>;

    abstract insert(keyValues: { [key: string]: any; }, ...optionalParams: any[]): Promise<any>;

    abstract delete(keys: string[], whereClosure?: any, ...optionalParams: any[]): Promise<any>;
}