const { Worker, isMainThread, parentPort, workerData } = require('node:worker_threads');
const Pool = require('worker-threads-pool');
const CPUs = require('os').cpus().length;

const pool = new Pool({ max: CPUs });

console.log('CPUs: ' + CPUs);

if(isMainThread){
    console.log('IS MAIN THREAD');
    
    // const worker = new Worker(__filename, { workerData: 1 });
    pool.acquire(__filename, { workerData: 1 }, (err, worker)=>{
        if(err) return console.error(err);
        console.log(`Started worker ${JSON.stringify(worker)} (pool size: ${pool.size})`)

        worker.on('message', message => console.log(message));
        worker.on('error', error => console.error(error));
        worker.on('exit', (code)=>{
            if(code !== 0) console.error(`Error: Worker stopped with exit code ${code}`);
        });
    });

    console.log('FINNALY');
}else{
    console.log("IT'S NOT MAIN THREAD");
    parentPort.postMessage(workerData + 2);
}