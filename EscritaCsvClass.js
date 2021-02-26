const fs = require('fs');

module.exports = class CSV {
    /**
        * @param {String} filename
        * @param {String} delimiter
    */
    constructor(filename, encoding) {
        this.filename = filename;        

        fs.writeFileSync(`${filename}.csv`, '', { encoding: encoding });
    }

    /**
        * @param {String} header
    */
    writeHeader(values) {
        fs.appendFileSync(`${this.filename}.csv`, `${values}\n`);
    }

    /**
        * @param {String} lines
    */
    writeLine(values) {
        fs.appendFileSync(`${this.filename}.csv`, `${values}\n`);
    }

    /**
        * @param {Array} lines
    */
    writeLines(lines) {
        for (let i = 0; i < lines.length; i++) {
            this.writeLine(lines[i]);
        }
    }
}