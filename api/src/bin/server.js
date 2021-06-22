const utils_functions = require('../static/utils_functions');
const express = require('express');
const app = express();
const routes = require('../routes');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//CORS
app.use((req, res, next) => {    
    res.header('Access-Control-Allow-Origin', '*'); 
    res.header('Access-Control-Allow-Header', 
    'Origin, X-Requested-With, Content-Type, Accept, Authorization');

    if(req.method == 'OPTIONS'){
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET'); 
        return res.status(200).send();        
    }else{
        // terminar validação de keys
        if(req.headers['X-VTEX-API-AppKey'] && req.headers['X-VTEX-API-AppToken']){
            next();
        }else{
            return res.status(401).send();
        }
    }    
});

app.use('/validation', routes.validation);
app.use('/provider/giftcards', routes.provider);
app.use('/hookQueues', routes.hookQueues);

app.use((error, req, res, next) => {

    if(!error.statusCode){
        error.statusCode = 500;
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

    utils_functions.printResponse({status: error.statusCode, body: error});
    return res.status(error.statusCode).send(error);
});

app.use((req, res) => {
    utils_functions.printRequest(req);
    utils_functions.printResponse({status: 404});
    return res.status(404).send();
});

module.exports = app;