require('dotenv').config({ 
    path: process.env.NODE_ENV == 'dev' ? '.dev.env' :'.env' 
});

const baseUrl = `https://${process.env.VTEX_ACCOUNTNAME}.vtexcommercestable.com.br/api/dataentities/CL`;

const headers = {
    'X-VTEX-API-AppKey': process.env.VTEX_API_KEY,
    'X-VTEX-API-AppToken': process.env.VTEX_API_TOKEN
}

exports.updateDocument = (idDocument, ativo)=> {
    return {        
        url: `${baseUrl}/documents/${idDocument}`,
        method: 'PUT',
        headers: headers,
        body: { ativo: ativo } 
    }
}

exports.getClient = (codCredenciado)=>{
    return {        
        url: `${baseUrl}/search?_fields=_all&_where=codCredenciado=${codCredenciado}`,
        method: 'GET',
        headers: headers 
    }
}