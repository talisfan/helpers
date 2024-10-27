export type KeyIdObj = { [keyIdName: string]: string | number };

export interface IRepository<TypeItem> {
    create(data: TypeItem): Promise<TypeItem>;
    get(key: KeyIdObj | any): Promise<TypeItem>;
    update(key: KeyIdObj | any, data: Partial<TypeItem>): Promise<TypeItem>;
    deleteItem(key: KeyIdObj | any): Promise<void>;
    search(
        whereProps?: any, 
        orderBy?: any, 
        limit?: number, 
        skip?: number, 
        ...optionalParams: any[]
    ): Promise<TypeItem[]>;
}