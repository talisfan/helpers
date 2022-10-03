const { threadId } = require('node:worker_threads');

const stage = process.env.NODE_ENV || 'prod';
let baseText = `[{date}][${stage.toUpperCase()}][Thread-${threadId}][{processName}]: `;

exports.log = (status = 'INFO' | 'WARN' | 'DEBUG', processName, message) => {
    let text = baseText.replace('{date}', new Date().toISOString()).replace('{processName}', processName);
        
    if(status === 'DEBUG'){
        console.debug(text, message);
    }else{
        console.log(text, message);
    }
}

exports.error = (processName, error)=>{
    let text = baseText.replace('{date}', new Date().toISOString()).replace('{processName}', processName);

    console.error(text, (error.stack || typeof error === 'string') ? error : JSON.stringify(error, null, 4));
}