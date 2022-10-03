import moment from "moment";
import { DATETIME_FORMAT } from "../../src/utils/constants";
import ExternalApi from "../ExternalAPI";
import type { ResponseGetOrderform, VtexOrder } from '../types/vtex/responseTypes';

export default class Vtex extends ExternalApi {

    constructor() {
        super(String(process.env.VTEX_API_URL), {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'X-VTEX-API-AppKey': String(process.env.VTEX_APP_KEY),
                'X-VTEX-API-AppToken': String(process.env.VTEX_APP_TOKEN)
            }
        });
    }

    public async getMasterdataDocuments(dataEntity: string, fields: string = '_all', where?: string): Promise<Array<any>> {
        let url: string = this.baseUrlApi + `/dataentities/${dataEntity}/search?_fields=${fields}`;
        if (where) url += `&_where=${where}`;
        let results = await this.doRequest({
            url: url,
            method: 'GET'
        }, 'VTEX-MASTERDATA-Search');

        return results.data;
    }

    public async getProfileAddress(email: string): Promise<{ [key: string]: string }> {        
        let results = await this.doRequest({
            url: this.baseUrlApi + `/profile-system/pvt/profiles/${email}/addresses`,
            method: 'GET'
        }, 'VTEX-PROFILEADDRESS-Search');

        return results.data;
    }

    public async createProfileAddress(email: string, data: any): Promise<{ profileId: string }> {
        let url: string = this.baseUrlApi + `/profile-system/pvt/profiles/${email}/addresses`;
        let res = await this.doRequest({
            url: url,
            method: 'POST',
            body: data
        }, 'VTEX-PROFILEADDRESS-Create');

        return res.data;
    }

    public async getPersonalData(email: string): Promise<{ [key: string]: string }> {
        let url: string = this.baseUrlApi + `/profile-system/pvt/profiles/${email}/PersonalData`;
        let results = await this.doRequest({
            url: url,
            method: 'GET'
        }, 'VTEX-PERSONALDATA-Search');

        return results.data;
    }

    public async createPersonalData(data: any): Promise<{ profileId: string }> {
        let url: string = this.baseUrlApi + `/profile-system/pvt/profiles/${data.email}/PersonalData`;
        let res = await this.doRequest({
            url: url,
            method: 'POST',
            body: data
        }, 'VTEX-PERSONALDATA-Create');

        return res.data;
    }    

    public async getSession(cookies: string): Promise<any> {
        let res = await this.doRequest({
            url: this.baseUrlApi + '/sessions?items=profile.isAuthenticated,profile.email,'+
                'public.codUsuario,public.document,public.email,public.id,public.dadosEndereco,public.nome',
            headers: { Cookie: cookies },
            method: 'GET'
        }, 'VTEX-SESSIONS-Get');

        return res.data;
    }

    public async updateSession(data: any, cookies: string): Promise<{ [key: string]: { value: any } }> {

        Object.keys(data).forEach((key) => {
            data[key] = { value: data[key] }
        });

        await this.doRequest({
            url: this.baseUrlApi + '/sessions',
            method: 'PATCH',
            headers: {
                Cookie: cookies
            },
            body: {
                public: data
            }
        }, 'VTEX-SESSIONS-Set');
        return data;
    }

    public async getOrderForm(orderformId: string): Promise<ResponseGetOrderform> {
        let res = await this.doRequest({
            url: this.baseUrlApi + `/checkout/pub/orderForm/${orderformId}?refreshOutdatedData=true`,
            method: 'GET'
        }, 'VTEX-GetOrderform');

        return <ResponseGetOrderform>res.data;
    }

    public async updateCustomDataOrderForm(
        orderformId: string, 
        appId = 'servicesdata', 
        appFieldName = 'additionalInfo', 
        newValue: string
    ): Promise<void> {
        await this.doRequest({
            url: this.baseUrlApi + `/checkout/pub/orderForm/${orderformId}/customData/${appId}/${appFieldName}`,
            method: 'PUT',
            body: {
                value: newValue
            }
        }, 'VTEX-PutOrderformCustomData');        
    }

    public async getOrderById(orderId: string): Promise<VtexOrder> {
        let res = await this.doRequest({
            url: this.baseUrlApi + `/oms/pvt/orders/${orderId}`,
            method: 'GET'
        }, 'VTEX-GetOrderByID');

        return <VtexOrder>res.data;
    }

    public async insertInvoiceNumberInOrder(orderId: string, invoiceNumber: string, value: number = 1): Promise<{ 
        date: string,
        orderId: string,
        receipt: string
    }> {
        let res = await this.doRequest({
            url: this.baseUrlApi + `/oms/pvt/orders/${orderId}/invoice`,
            method: 'POST',
            body: {
                type: "Output",
                invoiceNumber,
                courier: "",
                trackingNumber: "",
                trackingUrl: "",
                items: null,
                issuanceDate: moment().utc().format(DATETIME_FORMAT),
                invoiceValue: value
            }
        }, 'VTEX-OrderInvoiceNotification');

        return res.data;
    }

    public async startHandlingOrder(orderId: string): Promise<void>{
        await this.doRequest({
            url: this.baseUrlApi + `/oms/pvt/orders/${orderId}/start-handling`,
            method: 'POST'
        }, 'VTEX-StartHandlingOrder');        
    }

    public async listOrders(startDate: string, endDate: string, status: string = 'ready-for-handling'): Promise<
        Array<{ 
            orderId: string,
            invoiceOutput: string[],
            totalValue: number
        }>
    >{        
        const res = await this.doRequest({
            url: this.baseUrlApi + '/oms/pvt/orders?'+
                `f_creationDate=creationDate:[${startDate}.000Z TO ${endDate}.000Z]&`+
                `f_status=${status}`,
            method: 'GET'
        }, 'VTEX-ListOrders');

        return res.data.list;
    }

    public async cancelOrder(orderId: string): Promise<any>{
        const res = await this.doRequest({
            url: this.baseUrlApi + `/oms/pvt/orders/${orderId}/cancel`,
            method: 'POST'
        }, 'VTEX-CancelOrder');        

        return res.data;
    }
}