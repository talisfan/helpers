exports.printRequest = (req)=>{    
    let clientIp = req.headers['x-forwarded-for'];
    
    if(clientIp.indexOf(',') > -1){
        let arrayIps = clientIp.split(', ');
        clientIp = arrayIps[arrayIps.length-1];
    }
    // tratamento para clientIp ser o ip autentico do client

    console.log('\n--REQUEST INBOUND:');    
    console.log({
        'client': clientIp || undefined,
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

exports.sleep = (milliseconds) =>{
    return new Promise(resolve => setTimeout(resolve, milliseconds));
}

exports.ramdomString = ()=>{
    // toString(36) == base36 || toString(16) == hexadecimal
    return Math.random().toString(16).substr(2); 
}

exports.findAllChars = (str, char, group = false)=>{    
    var regex = RegExp(group ? `(${char})` : `[${char}]`, 'gim'), result, indexes = [];
    while ( (result = regex.exec(str)) ) {
        indexes.push(result.index);
    }
    return indexes;
}
