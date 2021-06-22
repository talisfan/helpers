const fetch = require('node-fetch');

module.exports = async (req, operation)=>{
    let tentativas = 0;

    let res = await request(req);
    console.log(`[${req.method}][${operation}]: URL => ${req.url}\n`);

    while(res.status > 206 && tentativas < 5){
        tentativas++;
        console.log(`[${req.method}]: FAIL - ATTEMPT ${tentativas}\n`);

        if(tentativas == 5){
            res = await convertResponse(res);
            res.error = true;
            console.log(`[ERROR][${req.method}][${operation}]: FAIL - Excesso de tentativas.`);
            console.log(
                `[ERROR][${req.method}][${operation}]: STATUS ${res.status} - 
                ResponseDescription =>\n${res}`
            );
            return res;
        }
    }

    res = await convertResponse(res);
    res.error = false;
    return res;
}

async function request(req){
    let res = await fetch(req.url, {
        method: req.method,
        headers: req.headers,
        body: JSON.stringify(req.body || {})
    });

    return res;
}

async function convertResponse(res){
    let response = {};
    response.status = res.status;
    response.url = res.url;    
    response.body = null;

    try{
        response.body = await res.json();
    }catch(error){}

    return response;
}