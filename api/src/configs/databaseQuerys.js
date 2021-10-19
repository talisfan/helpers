exports.getTotalLancamentos = (codCredenciado, initDate, endDate)=>{
    return {
        query: 'SELECT COUNT(DISTINCT nrLancamento) AS total '+            
            `FROM tbl_credito `+
            'WHERE codCredenciado = ? '+
            'AND dataLancamento >= ? AND dataLancamento <= ? '+
            ';',
        values: [codCredenciado, initDate, endDate]
    };
}

exports.getCreditsPerDate = (codCredenciado, initDate, endDate,  exceptTransactionId = null)=>{                
    let queryValue = {
        query: 'SELECT valorCreditado, nrLancamento, motivo, usuario, DATE_FORMAT(dataLancamento, "%Y-%m-%dT%H:%i:%s") AS dataLancamento, '+
            'saldo, expiraEm, tipo '+
            'FROM tbl_credito '+
            'WHERE codCredenciado = ? '+
            'AND dataLancamento >= ? AND dataLancamento <= ? '+
            ((exceptTransactionId) ? 'AND nrLancamento <> ? ' : '') +
            'ORDER BY dataLancamento DESC;',
        values: [codCredenciado, initDate, endDate]
    };

    if(exceptTransactionId) queryValue.values.push(exceptTransactionId)

    return queryValue;
}

exports.updateEmailCustomer = (email, codCredenciado)=>{
    const current_date = require('moment').utc().format('YYYY-MM-DDTHH:mm:ss');
    return {
        query: `UPDATE tbl_cliente SET email = ?, dataAtualizacao = ? WHERE codCredenciado = ?;`,
        values: [ email, current_date, codCredenciado ]
    };
}