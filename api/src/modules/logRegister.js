const { threadId } = require('node:worker_threads');
const path = require('path');
const fs = require('fs');

const stage = process.env.NODE_ENV || 'prod';
const logWritingEnabled = process.env.LOG_WRITING_ENABLED;
const logFilePath = path.resolve('./logs/log.log');

if(logWritingEnabled && !fs.existsSync(logFilePath)) 
    fs.writeFileSync(logFilePath, '');

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

exports.error = (processName, messageError, error = null)=>{
    let text = baseText
        .replace('{status}', 'ERROR')
        .replace('{date}', new Date().toISOString())
        .replace('{processName}', processName)
    ;

    if(error) console.error(error);
    console.error(text, (typeof messageError === 'string' || messageError?.stack) ? messageError : JSON.stringify(messageError, null, 4));
    if(logWritingEnabled == 'true')
        writeFile(text + ' ' + ((typeof messageError === 'string') ? messageError : messageError.stack || JSON.stringify(messageError, null, 4)))
}

function writeFile(log){
    fs.stat(logFilePath, (err, stats)=> {
        if(stats.size >= 52428800){ // 52428800 = 50mb
            fs.writeFileSync(logFilePath, log);
        }else{
            fs.appendFileSync(logFilePath, log + '\n');
        }
    });
}