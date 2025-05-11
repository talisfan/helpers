import type { Request } from 'express';
import moment from 'moment';
import * as cheerio from 'cheerio';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export function verifyTokenFormat(req: Request): string{
    if (!req.headers.authorization && !req.cookies?.access_token) 
        throw({ status: 401 });

    if(req.headers.authorization){
        const tokenSplited = req.headers.authorization.split(" ");

        if (tokenSplited.length !== 2 || !/^Bearer$/i.test(tokenSplited[0]))
            throw({ status: 401, message: 'Invalid format Bearer token' });
    
        return tokenSplited[1];
    } else 
        return req.cookies?.access_token;
}

export function booleanify (value: string): boolean {
    const truthy: string[] = [
        'true',
        'True',
        '1'
    ]

    return truthy.includes(String(value))
}

export function isJwtExpired(token: string) {
    try {
        const parts = token.split('.');
        if (parts.length !== 3) {
            throw new Error('Token JWT inválido.');
        }
        const payload = JSON.parse(atob(parts[1]));
        if (!payload.exp) {
            throw new Error('Token JWT não contém data de expiração.');
        }
        const now = Math.floor(Date.now() / 1000);
        return now >= payload.exp;
    } catch (error: any) {
        console.error('Erro ao verificar o token JWT:', error);
        return true; 
    }
}

export function getClosureOrderByObj(orderByStr?: string){
    let orderBy: { [key: string]: 'asc' | 'desc' };
    if(orderByStr){
        let [key, sortType] = String(orderByStr).split(' ');
        orderBy = { [key]: sortType } as any;
    }else{
        orderBy = { createdAt: 'desc' };
    }
    return orderBy;
}

const regexIpv4 = /^((25[0-5]|2[0-4][0-9]|1?[0-9]?[0-9])\.){3}(25[0-5]|2[0-4][0-9]|1?[0-9]?[0-9])$/;
const regexIpv6 = /^([0-9a-fA-F]{1,4}:){1,7}[0-9a-fA-F]{1,4}(:[0-9a-fA-F]{1,4})*$/;

export function isValidIp(ip: string){
    if(ip.includes(':'))
        return regexIpv6.test(ip);
    else
        return regexIpv4.test(ip);
}

type WherePrisma = {
    [key: string]: any,
    AND?: any[],
    OR?: any[],
    NOT?: any[]
}

type OrderByPrisma = {
    [key: string]: 'asc' | 'desc'
}

export function buildClosuresSql (where?: any, orderBy?: string | any): { where?: WherePrisma, orderBy?: OrderByPrisma }{
    let whereObj: WherePrisma | undefined = undefined;
    let orderByObj: OrderByPrisma | undefined = undefined;    

    if(where){
        whereObj = {};

        for(let key in where){
            key = key.trim();

            let value = where[key];
            if(typeof value == 'string'){
                value = value.trim().replace(/['"]/gim, '');
                if(value.toLowerCase() === 'null'){
                    value = null;
                }else if(value.toLowerCase() === 'true' || value.toLowerCase() === 'false'){
                    value = booleanify(value);
                }else if(value == 'not null'){
                    value = { not: null };
                }else if(value.includes('range(')){
                    const [startDate, endDate] = value.replace(/range|\(|\)/g, '').split(';');
                    if(!moment(startDate).isValid() || !moment(endDate).isValid()){
                        throw({ status: 400, message: 'Invalid date format - Only ISOString (YYYY-MM-DDTHH:mm:ss) format is accepted' });
                    }
                    value = [ 
                        { [key]: { 'gte': (startDate.length == 19) ? startDate + '.000Z' : startDate }}, 
                        { [key]: { 'lte': (endDate.length == 19) ? endDate + '.000Z' : endDate }} 
                    ];
                    key = 'AND';
                }else if(
                    value.includes('< ') || value.includes('> ') ||
                    value.includes('<= ') || value.includes('>= ')
                ){
                    const operator = value.split(' ');
                    const key = 
                        operator[0] == '<=' 
                        ? 'lte' 
                        : (operator[0] == '<' )
                        ? 'lt'
                        : (operator[0] == '>=' )
                        ? 'gte'
                        : (operator[0] == '>' )
                        ? 'gt'
                        : ''
                    ;

                    value = { 
                        [key]: Number(operator[1]) ?? operator[1] 
                    }
                }
            }

            if (
                (
                    key.toLocaleUpperCase().includes('qnt') || 
                    key.toLocaleUpperCase().includes('quantity') || 
                    key.toLocaleUpperCase().includes('value') 
                ) 
                && 
                typeof value === 'string'
            ) {
                value = Number(value);
            }
            
            whereObj[key] = value;
        
        }
    }

    if(orderBy){
        if(typeof orderBy === 'string'){
            const field: string = orderBy.split(' ')[0];
            const order = orderBy.split(' ')[1].toLowerCase() as 'asc' | 'desc';
            orderByObj = (field && order) 
                ? { [field]: order } 
                : {}
            ;
        }else{
            orderByObj = orderBy;
        }
    }

    return {
        where: whereObj, 
        orderBy: orderByObj
    };
}

export function formatIntHourToString(hour: number){
    return String(hour).length == 4 ? 
        `${String(hour).substring(0,2)}:${String(hour).substring(2)}`
        : `0${String(hour).substring(0,1)}:${String(hour).substring(1)}`
    ;
}

export function convertHtmlToWhatsAppMessage(html: string): string {
    const $ = cheerio.load(html); // Carrega o HTML

    // Remover imagens
    $("img").remove();

    $("br").each((_, el) => {
        $(el).replaceWith(`\n`);
    });

    // Converter tags de formatação
    $("b, strong").each((_, el) => {
        $(el).replaceWith(`*${$(el).text()}*`);
    });
    $("i, em").each((_, el) => {
        $(el).replaceWith(`_${$(el).text()}_`);
    });
    $("s").each((_, el) => {
        $(el).replaceWith(`~${$(el).text()}~`);
    });
    $("code").each((_, el) => {
        $(el).replaceWith(`\`\`\`${$(el).text()}\`\`\``);
    });

    // Converter links para "Texto (URL)"
    $("a").each((_, el) => {
        const text = $(el).text();
        const href = $(el).attr("href") || "#"; // Garante que não seja undefined
        $(el).replaceWith((text != href && !text.includes('http')) ? `${text} (${href})` : href);
    });

    // Substituir <p> por quebra dupla de linha
    $("p").each((_, el) => {
        $(el).replaceWith(`${$(el).text()}\n`);
    });
    

    return $.text().trim(); // Retorna apenas o texto limpo
}

export function logErrorHandler(error: any): string {
    console.error(error);
    return error?.response
        ? `REQUEST >> ${
            error.config?.method
        } ${
            error?.config?.url
        }${
            error.config.params
            ? '?' + qs.stringify(error.config.params)
            : '' 
        } Body: ${JSON.stringify(error?.config?.data || {})} - RESPONSE >> Status: ${error?.response.status} - Data: ${
              JSON.stringify(error?.response?.data, null, 2) ||
              error?.response?.data
          }`
        : error?.stack || error?.message || error;
}

export function getWeekOfMonth(date: string | Date) {
    const startOfMonth = moment(date).startOf('month'); // Primeiro dia do mês
    return moment(date).diff(startOfMonth, 'weeks') + 1; // Diferença de semanas + 1
}


export const statesApproximate: Record<string, string[]> = {
    AC: ['AM', 'RO'],
    AL: ['BA', 'PE', 'SE'],
    AP: ['PA'],
    AM: ['AC', 'RO', 'MT', 'PA', 'RR'],
    BA: ['AL', 'GO', 'MG', 'PE', 'PI', 'SE', 'TO', 'ES'],
    CE: ['PB', 'PE', 'PI', 'RN'],
    DF: ['GO'],
    ES: ['BA', 'MG', 'RJ'],
    GO: ['BA', 'DF', 'MG', 'MT', 'MS', 'TO'],
    MA: ['PA', 'PI', 'TO'],
    MT: ['AM', 'GO', 'MS', 'PA', 'RO', 'TO'],
    MS: ['GO', 'MT', 'MG', 'PR', 'SP'],
    MG: ['BA', 'DF', 'ES', 'GO', 'MS', 'RJ', 'SP'],
    PA: ['AM', 'AP', 'MA', 'MT', 'RR', 'TO'],
    PB: ['CE', 'PE', 'RN'],
    PR: ['MS', 'SC', 'SP'],
    PE: ['AL', 'BA', 'CE', 'PB', 'PI'],
    PI: ['BA', 'CE', 'MA', 'PE', 'TO'],
    RJ: ['ES', 'MG', 'SP'],
    RN: ['CE', 'PB'],
    RO: ['AC', 'AM', 'MT'],
    RR: ['AM', 'PA'],
    RS: ['SC'],
    SC: ['PR', 'RS'],
    SE: ['AL', 'BA'],
    SP: ['MG', 'MS', 'PR', 'RJ'],
    TO: ['BA', 'GO', 'MA', 'MT', 'PA', 'PI']
  };
  