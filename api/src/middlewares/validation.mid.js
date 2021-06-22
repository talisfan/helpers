const utils_functions = require('../static/utils_functions');

exports.login = async (req, res, next)=>{
    utils_functions.printRequest(req);

    if(!req.query.codCredenciado || !req.query.numeroCro){
        return res.status(400).send();
    }

    //global.dcms.access_token = await Services.dcms.getToken();

    const dentista = null;//await Services.dcms.getDentist({ codCredenciado: req.query.codCredenciado });

    if(!dentista){
        return res.status(404).send();
    }

    if(dentista.status.toLowerCase() != "ativo"){
        return res.status(403).send("Usuário inativo.")
    }

    if(!dentista.numeroCro){
        return res.status(409).send("CRO inexistente na base do DCMS.");
    }else if(dentista.numeroCro != req.query.numeroCro){
        return res.status(403).send("CRO divergente.");
    }else{
        return res.status(200).send();
    }
}

exports.checkCodes = async (req, res, next)=>{
    utils_functions.printRequest(req);
    
    if(!req.params.codCredenciado){
        return res.status(400).send();
    }

    //global.dcms.access_token = await Services.dcms.getToken();

    const dentista = null;//await Services.dcms.getDentist({ codCredenciado: req.params.codCredenciado });

    if(!dentista){
        return res.status(404).send();
    }

    if(dentista.status.toLowerCase() != "ativo"){
        return res.status(403).send("Usuário inativo.")
    }else{
        return res.status(200).send();
    }
}