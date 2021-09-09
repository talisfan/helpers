const moment = require("moment");
const path = require("path");
const CSV = require("./Csv");

let csv;
let delimiter = "|";
let dateDay = moment().utc().subtract(moment.duration("03:00:00")).format(); // -03h Horário de Brasília

exports.createCsv = async (cli) => {
    console.log(`\nGrando CSV de produtos de ${cli.name}...`);

    if (cli.delimiter) delimiter = cli.delimiter;

    const name = nominateCsv(cli.name);

    csv = new CSV(name.absolute, cli.encoding);

    let headers = [];
    for (let linha in cli.headers) {
        headers.push(linha);
    }

    if (cli.addFields) {
        console.log("[WARNING] - Gerando CSV com campos customizados")
        for (let addLine in cli.addFields) {
            headers.push(addLine);
            console.log(addLine)
        }
    } else {
        console.log("[WARNING] - Gerando CSV sem campos customizados")
    }

    headers = headers.join(delimiter);
    csv.writeHeader(headers);

    console.log("CSV gerado com sucesso! CSV: " + name.onlyName + "\n");

    return name.onlyName + ".csv";
};

exports.writeLines = async (cli, list) => {
    // Formata somente os campos desejados dos produtos
    list = await formatList(cli, list); // retorna array de objetos [{},{}]

    let newProps = list.map(function (sku) {
        const skuValues = Object.values(sku);

        if (cli.addFields) {
            dateDay = dateDay.substr(0, 10);
            skuValues.push(dateDay)
        }

        
        for (let i = 0; i < skuValues.length; i++) {
            skuValues[i] = skuValues[i]
                .toString()
                .replace(new RegExp(`[${delimiter}]`, "gmi"), "");
        }

        return skuValues.join(delimiter).replace(/[\n\r]/gim, "");
    });

    csv.writeLines(newProps);

    return list.length;
};

function nominateCsv(nameStore) {
    /*
     * Caso nome da loja haja espaços
     * serão substituídos por '_'.
     */
    while (nameStore.includes(" ")) {
        nameStore = nameStore.replace(" ", "_");
    }
    nameStore = nameStore.toLowerCase();

    let date = moment().utc().subtract(moment.duration("03:00:00")).format(); // -03h Horário de Brasília
    // Removendo a hora e mantendo somente a data (2021-02-04)
    date = date.substr(0, 10);
    // Removendo traços para não ter conflito no envio para sftp
    date = date.replace("-", "").replace("-", "");

    let dir = path.resolve("csv");

    const nameAbsolute = `${dir}/${nameStore}-products-${date}`;
    const onlyName = `${nameStore}-products-${date}`;

    return {
        absolute: nameAbsolute,
        onlyName: onlyName,
    };
}
