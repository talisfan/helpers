exports.insertCliente = (cliente)=>{
    return `INSERT INTO tbl_cliente (codCredenciado, nome, cro, ativo, documento`+
        `${cliente.email ? ', email': ''}) `+
        `VALUES ("${cliente.codCredenciado}", "${cliente.nome}", "${cliente.cro}", `+
        `"${cliente.ativo}", "${cliente.documento}" `+
        cliente.email ? `, "${cliente.email}"` : '' +
    ');';
}

exports.updateStatusCliente = (status, codCredenciado)=>{
    return `UPDATE tbl_cliente SET ativo = ${status} WHERE codCredenciado = "${codCredenciado}";`;
}

exports.insertLancamento = (lancamento)=>{
    const moment = require('moment');
    let date = moment.utc().format('YYYY-MM-DD');    

    return 'INSERT INTO tbl_lancamentos ' +
        '(codCredenciado, nrLancamento, tipo, valor, usuario, referenciaLancamento, dataLancamento'+        
        lancamento.expiraEm ? ', expiraEm' : '' + lancamento.motivo ? ', motivo' : '' + 
        `) VALUES ("${lancamento.codCredenciado}", `+
        `"${lancamento.nrLancamento ? lancamento.nrLancamento : Math.random().toString().replace('0.', '')}", `+
        `"${lancamento.tipo}", ${lancamento.valor}, "${lancamento.usuario}", "${lancamento.referenciaLancamento}", `+
        lancamento.dataLancamento ? `"${lancamento.dataLancamento}"` : `"${date}"` +
        lancamento.expiraEm ? `, "${lancamento.expiraEm}"` : '' + 
        lancamento.motivo ? `, "${lancamento.motivo}"` : '' +         
    ');';
}

exports.getCreditosExpirados = (expiraEm, codCredenciado)=>{
    return `SELECT * FROM tbl_lancamentos WHERE expiraEm = "${expiraEm}" `+
        `AND codCredenciado = "${codCredenciado}";`
    ;
}

exports.getCarteira = (codCredenciado)=>{
    return 'SELECT ct.id, cl.codCredenciado, ct.saldo, cl.nome, cl.documento, cl.email, cl.ativo ' +
        'FROM tbl_cliente AS cl INNER JOIN tbl_carteira AS ct ON cl.codCredenciado = ct.codCredenciado '+
        `WHERE cl.codCredenciado = "${codCredenciado}";`
    ;
}

exports.getExtrato = (codCredenciado)=>{
    return 'SELECT lc.nrLancamento, cl.codCredenciado, lc.tipo, lc.valor, lc.usuario, lc.dataLancamento, ' +
        'lc.referenciaLancamento, lc.expiraEm, lc.motivo, '+
        'cl.nome, cl.documento, cl.email, cl.ativo '+
        'FROM tbl_cliente AS cl INNER JOIN tbl_lancamentos AS lc ON cl.codCredenciado = lc.codCredenciado '+
        `WHERE cl.codCredenciado = "${codCredenciado}" `+
        `ORDER BY dataLancamento DESC LIMIT 100;`
    ;
}

exports.getAllCarteiras = (filtro = null)=>{
    
    switch(filtro){
        case 0: 
            filtro = 'WHERE cl.ativo = 0';
            break;
        case 1: 
            filtro = 'WHERE cl.ativo = 1';
            break;        
        default:
            filtro = '';
            break;
    }
    
    return 'SELECT ct.id, cl.codCredenciado, ct.saldo, cl.nome, cl.documento, cl.email, cl.ativo ' +
        'FROM tbl_cliente AS cl INNER JOIN tbl_carteira AS ct ON cl.codCredenciado = ct.codCredenciado '+
        `${filtro};`
    ;
}

exports.getDebitosReferentes = (nrLancamento, codCredenciado)=>{
    return `SELECT * FROM tbl_lancamentos WHERE codCredenciado = "${codCredenciado}" `+ 
    `AND tipo = "debit" AND referenciaLancamento = "${nrLancamento}";`;
}