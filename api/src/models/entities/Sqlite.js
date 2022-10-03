const sqlite = require('sqlite3');
const { open } = require('sqlite');
const fs = require('fs');
const path = require('path');

const dbFilePath = path.resolve('database/', 'notices.db');
const dumpFilePath = path.resolve('database/', 'dump.json');

function getQueryInsert(table, keyValues){
    let formatedKeyValues = {};

    var query = `INSERT INTO ${table} (`; 
    query += Object.entries(keyValues)
        .map(([key, value])=>{
            formatedKeyValues[`:${key}`] = value
            return key;
        })
        .join(', ');
    query += ') VALUES (';
                
    query += Object.keys(formatedKeyValues).join(', ');
    query += ')';

    return { query, formatedKeyValues };
}

async function createTables(){
    return new Promise((resolve, reject)=>{
        console.log('[SQLITE]: Criando banco de dados local...');

        db = new sqlite.Database(dbFilePath);
            
        const tables = require('../../database/tables.json');
                
        db.serialize(function(){
            for(let table in tables){
                let query = `CREATE TABLE IF NOT EXISTS ${table} (${
                    Object.keys(tables[table]).map((column)=>{
                        return `${column} ${tables[table][column]}`
                    })
                    .join(', ')
                })`;
            
                db.run(query);
            }
            console.log('[SQLITE]: Tabelas criadas com sucesso!');

            if(fs.existsSync(dumpFilePath)){
                console.log('[SQLITE]: Populando tabelas...');
                const dump = require(dumpFilePath);

                for(let table in dump){
                    for(let keyValues of dump[table]){
                        let { query, formatedKeyValues } = getQueryInsert(table, keyValues);
                        db.run(query, formatedKeyValues);
                    }
                }
                console.log('[SQLITE]: Tabelas populadas com sucesso!');
            }
        });

        db.close((err)=>{
            let objErr = { err, operation: '[ERROR][SQLITE]: Criação de tabelas...' }
            err ? reject(objErr) : resolve();
        });
    })
}
module.exports = class Sqlite {
    
    #poolConnection;
    #connection;
    /**
     * 
     * @param {boolean} poolConnection If true, closeConnection must be invoked
     */
    constructor(poolConnection = false){
        this.#poolConnection = poolConnection;
    }

    async #connect () {
        if(!fs.existsSync(dbFilePath)){
            await createTables();
        }
    
        if(!this.#connection){
            this.#connection = await open({ 
                filename: dbFilePath,
                driver: sqlite.Database
            });
        }
    }
    
    async closeConnection(){
        if(this.#connection){
            await this.#connection.close();
            this.#connection = null;
        }
    }
    
    async select (
        table, 
        fields = '*', 
        whereClosure = null, 
        options = {
            orderBy: { 
                column: null, 
                order: 'ASC' || 'DESC'
            }, 
            limit: 100, 
            offset: 0
        }
    ){
        try{
            await this.#connect();
    
            let query = `SELECT ${fields} FROM ${table}`;
            if(whereClosure) query += ` WHERE ${whereClosure}`;

            if(options.orderBy.column && options.orderBy.order){
                options.orderBy.order = options.orderBy.order.toUpperCase();
                if(options.orderBy.order != 'ASC' && options.orderBy.order != 'DESC'){
                    throw({ status: 400, message: 'Invalid order' });
                }
        
                query += ` ORDER BY ${options.orderBy.column} ${options.orderBy.order}`;
            }            
            query += ` LIMIT ${options.offset},${options.limit}`;
    
            return await this.#connection.all(query);
        }catch(error){
            console.error('[ERROR][SQLITE][SELECT]: ', error);
            throw({ operation: '[ERROR][SQLITE][SELECT]', error });
        }finally{
            if(!this.#poolConnection) await this.closeConnection();
        }
    }
    
    async insert (table, keyValues){
        try{
            await this.#connect();
            let { query, formatedKeyValues } = getQueryInsert(table, keyValues);
                
            return await this.#connection.run(query, formatedKeyValues);
        }catch(error){
            console.error('[ERROR][SQLITE][INSERT]: ', query, error);
            throw({ operation: '[ERROR][SQLITE][INSERT]', error });
        }finally{
            if(!this.#poolConnection) await this.closeConnection();
        }
    }
    
    async update(table, whereClosure, keyValues){
        if(!whereClosure) throw('[ERROR][SQLITE][UPDATE]: WhereClosure is missing!');

        try{
            await this.#connect();            

            let formatedKeyValues = {};

            keyValues['updatedAt'] = "datetime('now')";

            let query = `UPDATE ${table} SET `;             
            query += Object.entries(keyValues)
                .map(([key, value])=>{ 
                    if(String(value).includes('date(') || String(value).includes('datetime(')){
                        return `${key} = ${value}`;
                    }else{
                        formatedKeyValues[`:${key}`] = value;
                        return `${key} = :${key}`;
                    }
                })
                .join(', ');

            query += ` WHERE ${whereClosure}`;
            
            return await this.#connection.run(query, formatedKeyValues);
        }catch(error){
            console.error('[ERROR][SQLITE][UPDATE]: ', error);
            throw({ operation: '[ERROR][SQLITE][UPDATE]', error });
        }finally{
            if(!this.#poolConnection) await this.closeConnection();
        }
    }
    
    async delete (table, whereClosure){
        if(!whereClosure) throw('[ERROR][SQLITE][DELETE]: WhereClosure is missing!');
    
        try{
            await this.#connect();

            let query = `DELETE FROM ${table} WHERE ${whereClosure}`;        
            return await this.#connection.exec(query);
        }catch(error){
            console.error('[ERROR][SQLITE][DELETE]: ', error);
            throw({ operation: '[ERROR][SQLITE][DELETE]: ', error});
        }finally{
            if(!this.#poolConnection) await this.closeConnection();
        }
    }
}