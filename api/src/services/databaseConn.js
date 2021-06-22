const mysql = require('../bin/mysql');
const utils_functions = require('../static/utils_functions');

module.exports = async (query)=>{    
    return new Promise((resolve, reject)=>{
        mysql.getConnection((error, conn) => {

            if(error){                
                error = utils_functions.printError({                    
                    status: 502,                    
                    operation: 'Erro ao conectar com o banco de dados.',
                    errorMessage: error
                });
                return reject(error);
            }
            
            console.log('[Database]: Conectado!');        
            
            conn.query(query, (err, result, field) => {
                conn.release();
    
                if(err){
                    err = utils_functions.printError({                        
                        status: 502,                                    
                        operation: 'Erro ao executar query no banco de dados.',
                        errorMessage: err
                    });                    
                    return reject(err);
                }
    
                if (result.length == 0) {                    
                    console.log('\n[Database]: Sucesso! - Sem registros.');
                }else{
                    console.log('\n[Database]: Sucesso! - Resultado:\n', result);                                        
                }
                resolve(result);
            });    
        });
    });
}