const gdrive = require("./gdrive");
const fs = require('fs').promises;

// Consulta quantos arquivos tem dentro do diretorio especificado
async function run(directory) {

    let listFiles = await fs.readdir(directory);
    const countFiles = listFiles.length;

    console.log("[Warning]: Lista de arquivos em \"" + directory + "\":");
    listFiles.map(element => {
        console.log(element);
    });
    console.log("\n[Warning]: Total de arquivos: " + countFiles + "\n\n");

    if (countFiles && countFiles > 0) {        
        listFiles.map(element => {
            // Faz o upload do XML para o Gdrive
            gdrive.xmlUpload(element, "XML/" + element, (id) => {
                console.log("[Success]: XML " + element + " enviado com sucesso!");                
            });
        });        
    } else {
        console.log("[Error]: Nenhum arquivo encontrado no diretório \"" + directory + "\". \n");
        return;
    }
}

try {
    run('./XML');
} catch (ex) {
    console.log("[Error]: " + ex);
}