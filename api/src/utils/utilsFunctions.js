exports.printRequest = (req)=>{    
    console.log('\n--REQUEST INBOUND:');    
    console.log({
        'endpoint': req.url,                
        'method': req.method || undefined,
        'endpoint': req.url || undefined,
        'params': req.params || undefined,
        'queryString': req.query || undefined,
        'body': req.body || undefined        
    }, '\n');
}

exports.printResponse = (res)=>{
    console.log('\n--RESPONSE OUTBOUND:');
    console.log({
        status: res.status || undefined,
        body: res.body || undefined
    });
}

exports.printError = (error)=>{
    if(!error.status){
        error.status = 500;
    }

    console.error('\n===== ERROR =====');
    console.error(JSON.stringify(error));

    if(error && error.errorMessage && 
        typeof error.errorMessage == 'object')
    {
        const errorMessage = error.errorMessage;
        for(const prop in errorMessage){
            if(prop.includes('sql')){
                delete error.errorMessage[prop];
            }
        };
    }

    this.printResponse({status: error.status, body: error});
    return error;
}

exports.sleep = (milliseconds) =>{
    return new Promise(resolve => setTimeout(resolve, milliseconds));
}