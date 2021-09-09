
(()=>{
    const express = require('express');
    const app = express();
    const index = require('./index')
    const bodyParser = require('body-parser');

    app.use(bodyParser.urlencoded({ extended: false }));

    app.post('/', async (req, res, next)=>{
        console.debug(req)
        return res.status(200).send(await index.handler(req.body))
    });

    app.use((error, req, res, next) => {

        if(!error.statusCode){
            error.statusCode = 500;
        }
    
        console.error('\n===== ERROR =====');
        console.error(JSON.stringify(error));
            
        return res.status(error.statusCode).send(error);
    });
    
    app.use((req, res) => {        
        return res.status(404).send();
    });        

    const http = require('http');
    const server = http.createServer(app);
    const port = 3000;
    server.listen(port);
    console.log(`Servidor rodando na porta ${port}!`);
})()