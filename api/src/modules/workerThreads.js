const { isMainThread } = require('node:worker_threads');
const Pool = require('worker-threads-pool');
const CPUs = require('os').cpus().length;
const logRegister = require('./logRegister');

if(isMainThread){

    const processName = 'WorkerThreads';
    const pool = new Pool({ max: CPUs });
    
    module.exports = (filePath, arrayParams)=>{
        if(isMainThread){
            logRegister.log(
                'INFO',
                processName,
                `IS MAIN THREAD - CPUs Available: ${CPUs}`
            );
        
            // const worker = new Worker(filePath, { workerData: '' });
            pool.acquire(filePath, { workerData: JSON.stringify(arrayParams) }, 
                (err, worker)=>{
                    if(err) return console.error(console.error(`[ERROR][WorkerThreads]: `, error));
                    
                    logRegister.log(
                        'INFO',
                        processName,
                        `Started worker - pool size: ${pool.size} - `+
                        `File Called: ${filePath} | PARAMS: ${JSON.stringify(arrayParams || [])}`
                    );
            
                    worker.on('message', (message) => {});
                    worker.on('error', (error) => {
                        logRegister.error(processName, error)
                    });
                    worker.on('exit', (code)=>{
                        if(code !== 0) 
                            logRegister.error(
                                processName,
                                `${filePath} => Worker stopped with exit code ${code}`
                            );
                    });
                }
            );
        }
    };
}

