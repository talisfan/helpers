const { threadId } = require('node:worker_threads');
const path = require('path');
const fs = require('fs');

const logFilePath = path.resolve('./logs/log.log')
const stage = process.env.NODE_ENV || 'prod';
const logWritingEnabled = process.env.LOG_WRITING_ENABLED;
let baseText = `[{date}][{status}][${stage.toUpperCase()}][Thread-${threadId}][{processName}]:`;

exports.log = (status = 'INFO' | 'WARN' | 'DEBUG', processName, message) => {
    let text = baseText
        .replace('{status}', status)
        .replace('{date}', new Date().toISOString())
        .replace('{processName}', processName)
    ;
        
    if(status === 'DEBUG'){
        console.debug(text, message);
    }else{
        console.log(text, message);
    }
    
    if(logWritingEnabled == 'true')
        writeFile(text + ' ' + message);
}

exports.error = (processName, error)=>{
    let text = baseText
        .replace('{status}', 'ERROR')
        .replace('{date}', new Date().toISOString())
        .replace('{processName}', processName)
    ;

    console.error(text, (error.stack || typeof error === 'string') ? error : JSON.stringify(error, null, 4));
    if(logWritingEnabled == 'true')
        writeFile(text + ' ' + (typeof error === 'string') ? error : error.stack || JSON.stringify(error, null, 4))
}

function writeFile(log){
    fs.stat(logFilePath, (err, stats)=> {
        if(stats.size >= 52428800){
            fs.writeFileSync(logFilePath, log);
        }else{
            fs.appendFileSync(logFilePath, log + '\n');
        }
    });
}