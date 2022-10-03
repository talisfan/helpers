import { Service } from "../piSap/objectTypes";
import type { ProductOrder } from "./objectTypes";

export type ResponseGetOrderform = {
    orderFormId: string,
    salesChannel: string,
    loggedIn: boolean,
    isCheckedIn: boolean,
    allowManualPrice: boolean,
    canEditData: boolean,
    userProfileId?: any,
    value: number,
    messages?: any[],
    items: ProductOrder[],
    shippingData: {
        address?: any,
        logisticsInfo: Array<{
            itemIndex: number,
            selectedSla?: any,
            selectedDeliveryChannel: string,
            addressId?: any,
            slas?: any[],
            shipsTo: string[],
            itemId: 9,
            deliveryChannels: Array<{ id: string }>
        }>,
        selectedAddresses?: any[],
        availableAddresses?: any[]
    },
    clientProfileData?: any,
    clientPreferencesData?: any,
    commercialConditionData?: any,
    openTextField?: any,
    customData?: {
        customApps: Array<{
            fields: {
                additionalInfo: string
            },
            id: string,
            major: number
        }>
    },
    itemMetadata: {
        items: Array<{
            id: string,
            seller: string,
            name: string,
            skuName: string,
            productId: string,
            refId?: any,
            ean: string,
            imageUrl: string,
            detailUrl: string,
            assemblyOptions?: any[]
        }>
    },
    hooksData?: any
};

export type VtexProduct = {
    id: string,
    metros: string,
    skuId: string | number,
    quantity: string | number
}

export type VtexOrder = {
    orderId: string,
    value: number,
    creationDate: string,
    items: Array<{
        ean: string,
        quantity: number,
        tipoServico: string,
        metros?: number,
        price: number,
        listPrice: number
    }>,
    openTextField?: any,
    clientProfileData: {
        document: string,
        firstName: string,
        lastName: string,
        email: string,
        phone: string
    },
    shippingData: {
        address: {
            postalCode: string,
            addressId: string,
            street: string,
            number: string,
            complement?: string | null,
            reference?: string | null,
            neighborhood: string,
            city: string,
            state: string,
        },
        logisticsInfo: {
            price: string,
        }
    }
    authorizedDate: string,
    selectedSla: string,
    shippingEstimate: string,
    orderFormId: string,
    customData: {
        customApps: Array<{
            fields: {
                additionalInfo: string
            },
            id: "servicesdata",
            major: 1
        }>        
    },
    packageAttachment: {
        packages: Array<{
            invoiceNumber: string
        }>
    }
}