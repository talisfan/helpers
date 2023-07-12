const express = require('express');
const app = express();

//CORS
app.use((req, res, next) => {    
    res.header('Access-Control-Allow-Origin', '*'); 
    res.header('Access-Control-Allow-Header', 
    'Origin, X-Requested-With, Content-Type, Accept, Authorization');

    if(req.method == 'OPTIONS'){
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET'); 
        return res.status(200).send();        
    }
    next();
});

app.use(express.urlencoded({ extended: false }));

app.use(function (error, req, res, next) {
    const status = error?.status || error?.response?.status || 500
    console.error(error, status);
    res.status(status);
    return res.send(error?.response?.data || error?.data || error?.body || error?.message || error);
});

app.use('/', express.Router().get('/', async(req, res)=>{
    const run = require('./index').handler;
    const result = await run(req);
    res.send(result);
}));

//Caso rota informada não exista
app.use((req, res) => {
    return res.status(404).send();
});

const http = require('http');
const server = http.createServer(app);
const port = 3000;
server.listen(port);
console.log(`Servidor rodando na porta ${port}!`);