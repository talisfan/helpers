import moment from "moment";

function redirectConsole(outputFunction: Function, prefix: string) {
    return (...args: any[]) => {
        const logMessage = args
            .map((arg) =>  {
                if (arg instanceof Error) {
                    return arg.stack || arg.message;
                } else if (typeof arg === "object") {
                    return JSON.stringify(arg);
                }
                return arg;
            })
            .join(" ")
        ;
        const formattedMessage = `[${moment().utc().subtract(3, 'h').format('YYYY-MM-DDTHH:mm:ss-03:00')}][${prefix}]${logMessage[0] != '[' ? ' ' + logMessage : logMessage}`;

        outputFunction.apply(console, [formattedMessage]);
    };
}

console.log = redirectConsole(console.log, "LOG");
console.error = redirectConsole(console.error, "ERROR");
console.debug = redirectConsole(console.debug, "DEBUG");
console.warn = redirectConsole(console.warn, "WARN");