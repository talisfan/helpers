const mysql = require('../bin/mysql');
const utils_functions = require('../static/utils_functions');

module.exports = (queryValue)=>{    
    return new Promise((resolve, reject)=>{
        console.log('\n[Database]: Conectando com o banco de dados...');

        mysql.getConnection((error, conn) => {

            if(error){                
                error = utils_functions.printError({                    
                    status: 502,                    
                    operation: '[Database]: Erro ao conectar com o banco de dados.',
                    errorMessage: error
                });
                return reject(error);
            }
            
            console.log('[Database]: Conectado!');   
            
            let callbackQuerys = (err, result, field)=>{
                conn.release();
        
                if(err){
                    err = utils_functions.printError({                        
                        status: 502,                                    
                        operation: '[Database]: Erro ao executar query no banco de dados.',
                        errorMessage: err
                    });                    
                    return reject(err);
                }
        
                console.log('[Database]: Sucesso ao executar query!');
                //console.debug(result);
                resolve(result);
            }
            
            if(queryValue.values){
                conn.query(queryValue.query, queryValue.values, callbackQuerys)  
            }else{
                conn.query(queryValue.query, callbackQuerys);    
            }
        });
    });
}