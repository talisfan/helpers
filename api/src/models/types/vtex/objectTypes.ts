import { ServiceType } from "../piSap/objectTypes";

export type ProductOrder = {
    uniqueId: string,
    id: string,
    productId: string,
    productRefId: string,
    refId?: any,
    ean: string,
    name: string,
    skuName: string,
    modalType?: any,
    parentItemIndex?: any,
    parentAssemblyBinding?: any,
    assemblies?: any[],
    priceValidUntil: string,
    tax: number,
    price: number,
    listPrice: number,
    manualPrice?: any,
    manualPriceAppliedBy?: any,
    sellingPrice: number,
    rewardValue: number,
    isGift: boolean,
    additionalInfo?: any,
    preSaleDate?: any,
    productCategoryIds: string,
    productCategories?: any,
    quantity: number,
    seller: string,
    sellerChain: string[],
    imageUrl: string,
    detailUrl: string,
    components?: any[],
    bundleItems?: any[],
    attachments?: any[],
    attachmentOfferings?: any[],
    offerings?: any[],
    priceTags?: any[],
    availability: string,
    measurementUnit: string,
    unitMultiplier: number,
    manufacturerCode?: any,
    priceDefinition: {
        calculatedSellingPrice: number,
        total: number,
        sellingPrices: Array<{                
            value: number,
            quantity: number
        }>
    }
};

export type CustomData = {
    codUsuario: string,
    services: Array<{
        baseOperacional?: string,
        protocolo?: string,
        tipoServico: ServiceType,                        
        parcelamento?: string,       
        produtos: Array<{
            id: string,
            skuId: string | number,
            metros: string | number,
            quantity: number
        }>,
        dadosTarefa?: {
            idTarefa: string,
            duracao: string,
            prioridade: number,
            qtdDiasSla: string
        },
        agendamento?: {
            dataSelecionada: string,
            turno: string
        }
    }>,
    value?: number
}

export type OrderHookRequest = {    
    Domain: string,
    OrderId: string,
    State: string,
    LastState?: string,
    LastChange: string,
    CurrentChange: string,
    Origin: {
        Account: string,
        Key: string
    }
}